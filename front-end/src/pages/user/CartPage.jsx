// src/pages/user/CartPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, InputNumber, Typography, Card, Row, Col, Empty, Popconfirm, message, Tag } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, ArrowRightOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "../../unti/axios.cusomize.js"; 
import { getCart, updateCartQuantity, removeFromCart, clearCart } from "../../unti/cart"; 

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    calculateTotal(items);
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = (value, record) => {
    if (!value) return;
    if (value > record.stock) {
        message.warning(`Kho chỉ còn ${record.stock} sản phẩm!`);
        return;
    }
    // Truyền variant_id để update đúng dòng
    const newCart = updateCartQuantity(record.id, record.variant_id, value);
    setCartItems(newCart);
    calculateTotal(newCart);
  };

  const handleRemove = (record) => {
    // Truyền variant_id để xóa đúng dòng
    const newCart = removeFromCart(record.id, record.variant_id);
    setCartItems(newCart);
    calculateTotal(newCart);
    message.success("Đã xóa sản phẩm");
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
        message.warning("Bạn cần đăng nhập để thanh toán!");
        navigate("/login");
        return;
    }
    if (cartItems.length === 0) {
        message.error("Giỏ hàng trống!");
        return;
    }

    try {
        setLoading(true);
        // Gửi variant_id lên server
        const orderItems = cartItems.map(item => ({
            item_id: item.id,
            variant_id: item.variant_id || null, // QUAN TRỌNG: Gửi ID biến thể
            quantity: item.quantity,
            price: item.price
        }));

        await axios.post("/api/orders", { items: orderItems }, { headers: { Authorization: `Bearer ${token}` } });

        message.success("Đặt hàng thành công! Kiểm tra lịch sử đơn hàng.");
        clearCart(); 
        setCartItems([]);
        setTotalPrice(0);
        navigate("/user"); 
    } catch (err) {
        if (err.response && err.response.status === 401) {
            message.error("Phiên đăng nhập hết hạn.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            navigate("/login");
        } else {
            message.error(err.response?.data?.message || "Lỗi thanh toán.");
        }
    } finally {
        setLoading(false);
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      width: 400,
      render: (text, record) => (
        <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
          <img
             alt={text}
             src={record.image || "https://placehold.co/100x100?text=No+Img"}
             style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
          />
          <div>
            <Text strong style={{ fontSize: 16 }}>{text}</Text>
            {/* Hiển thị Tag Size/Màu */}
            {record.variant_id && (
                <div style={{ marginTop: 4 }}>
                    <Tag color="geekblue">{record.size}</Tag>
                    <Tag color="magenta">{record.color}</Tag>
                </div>
            )}
            <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Shop: {record.store_name}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (price) => <Text>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (qty, record) => (
        <InputNumber min={1} max={record.stock} value={qty} onChange={(val) => handleQuantityChange(val, record)} />
      ),
    },
    {
      title: "Thành tiền",
      render: (_, record) => (
        <Text type="danger" strong>
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(record.price * record.quantity)}
        </Text>
      ),
    },
    {
        title: "",
        render: (_, record) => (
          <Popconfirm title="Xóa khỏi giỏ?" onConfirm={() => handleRemove(record)}>
              <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        ),
      },
  ];

  if (cartItems.length === 0) {
      return (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
              <Empty description="Giỏ hàng trống trơn" />
              <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate("/")} style={{ marginTop: 20 }}>
                  Về trang chủ mua sắm
              </Button>
          </div>
      );
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "30px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Title level={2}><ShoppingCartOutlined /> Giỏ hàng ({cartItems.length})</Title>
            {currentUser && <Text type="secondary"><UserOutlined /> Xin chào, {currentUser.name}</Text>}
        </div>
        <Row gutter={24}>
            <Col xs={24} lg={16}>
                <Card style={{ borderRadius: 8 }}>
                    <Table
                      dataSource={cartItems}
                      columns={columns}
                      // Ensure a stable unique key: include variant_id normalized to string
                      rowKey={(r) => `${r.id}-${r.variant_id ?? 'none'}`}
                      pagination={false}
                    />
                </Card>
            </Col>
            <Col xs={24} lg={8}>
                <Card style={{ borderRadius: 8, position: 'sticky', top: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                        <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                        <Text type="danger" strong style={{ fontSize: 24 }}>
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
                        </Text>
                    </div>
                    <Button type="primary" size="large" block icon={<ArrowRightOutlined />} loading={loading} onClick={handleCheckout}>
                        THANH TOÁN
                    </Button>
                </Card>
            </Col>
        </Row>
      </div>
    </div>
  );
};

export default CartPage;