import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Spin, Button, Empty, Avatar, Tabs } from "antd";
import { ArrowLeftOutlined, ShopOutlined, EnvironmentOutlined, ShoppingCartOutlined } from "@ant-design/icons"; // Thêm ShoppingCartOutlined
import axios from "../../unti/axios.cusomize.js"; 
import { addToCart } from "../../unti/cart"; // <--- IMPORT HÀM CART

const { Title, Text } = Typography;
const { Meta } = Card;

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [allItems, setAllItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resItems = await axios.get(`/api/items/store/${id}`);
      
      let itemsData = [];
      if (Array.isArray(resItems)) {
          itemsData = resItems;
          if (resItems.length > 0) {
              setStoreInfo({
                  name: resItems[0].store_name,
                  address: resItems[0].store_address,
                  image: resItems[0].store_image
              });
          }
      } else if (resItems && resItems.data) {
          itemsData = resItems.data;
      }

      setAllItems(itemsData);
      setDisplayItems(itemsData);

        try {
          // Use the categories endpoint (backend exposes /api/categories/store/:storeId)
          const resCats = await axios.get(`/api/categories/store/${id}`);
          const cats = Array.isArray(resCats) ? resCats : (resCats && resCats.data) ? resCats.data : [];
          setCategories([{ id: 'all', name: 'Tất cả' }, ...cats]);
        } catch (err) {
          console.warn("Chưa lấy được danh mục", err);
        }

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
      if (key === 'all') {
          setDisplayItems(allItems);
      } else {
          const filtered = allItems.filter(item => item.category_id === parseInt(key));
          setDisplayItems(filtered);
      }
  };

  return (
    <div style={{ padding: "20px 50px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        Quay lại
      </Button>

      {/* 1. THÔNG TIN SHOP */}
      <Card style={{ marginBottom: 20, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Avatar size={80} icon={<ShopOutlined />} src={storeInfo?.image} />
            <div>
                <Title level={3} style={{ margin: 0 }}>{storeInfo?.name || "Cửa hàng"}</Title>
                <Text type="secondary"><EnvironmentOutlined /> {storeInfo?.address || "Đang cập nhật địa chỉ"}</Text>
            </div>
        </div>
      </Card>

      {/* 2. THANH DANH MỤC */}
      <div style={{ background: '#fff', padding: '0 20px', borderRadius: 8, marginBottom: 20 }}>
          <Tabs 
            defaultActiveKey="all" 
            onChange={handleTabChange}
            items={categories.map(cat => ({
                key: String(cat.id),
                label: cat.name,
            }))}
          />
      </div>

      {/* 3. DANH SÁCH SẢN PHẨM */}
      <Title level={4}>Sản phẩm ({displayItems.length})</Title>
      
      {loading ? <Spin size="large" /> : (
        displayItems.length === 0 ? <Empty description="Không có sản phẩm nào" /> : (
          <Row gutter={[16, 16]}>
            {displayItems.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  hoverable
                  // Logic click Card để xem chi tiết
                  onClick={() => navigate(`/product/${item.id}`)}
                  cover={
                    <img 
                        alt={item.name} 
                        src={item.image ? item.image : "https://placehold.co/200x200?text=No+Image"} 
                        style={{ height: 200, objectFit: "cover" }}
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src="https://placehold.co/200x200?text=Error"; 
                        }}
                    />
                  }
                >
                  <Meta 
                    title={item.name} 
                    description={
                        <div>
                            <Text type="danger" strong style={{ display: 'block', marginBottom: 10 }}>
                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0)}
                            </Text>
                            
                            {/* --- NÚT THÊM VÀO GIỎ --- */}
                            <Button 
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                block // Nút full chiều rộng
                                onClick={(e) => {
                                    e.stopPropagation(); // Quan trọng: Chặn không cho nhảy trang
                                    addToCart(item);     // Gọi hàm thêm vào giỏ
                                }}
                            >
                                Thêm vào giỏ
                            </Button>
                        </div>
                    } 
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )
      )}
    </div>
  );
};

export default StoreDetail;