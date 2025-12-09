// src/pages/user/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button, Spin, message, Tabs, Space } from "antd";
import { ShoppingCartOutlined, OrderedListOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom"; 
import { getAllProductsApi, getAllCategoriesApi } from "../unti/api";
import { addToCart } from "../unti/cart";
import ProductVariantModal from "../component/ProductVariantModal";

// Product variant modal removed — now handled by backend itemVariant endpoints

const { Meta } = Card;
const { Title } = Typography;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  
  // Modal removed; product variant selection handled via backend endpoints

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || null);
      if (token && user) setUserRole(user.role);
      else setUserRole(null);
    };
    checkLogin();
    window.addEventListener("storageUpdate", checkLogin);
    return () => window.removeEventListener("storageUpdate", checkLogin);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([getAllProductsApi(), getAllCategoriesApi()]);
        const prodList = Array.isArray(prodRes) ? prodRes : [];
        setProducts(prodList);
        setFilteredProducts(prodList);
        setCategories(Array.isArray(catRes) ? catRes : []);
      } catch (error) { console.error("Lỗi tải dữ liệu:", error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleTabChange = (key) => {
    setActiveCategory(key);
    if (key === "all") setFilteredProducts(products);
    else setFilteredProducts(products.filter(p => p.category_id === parseInt(key)));
  };

  // Add to cart: if product has variants, open modal to choose variant; otherwise add directly
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openAddToCartModal = (product) => {
    if (!product) return;
    // Always open modal; it will fetch full details and display variants if they exist
    // Modal handles both: products with variants (user chooses) and without (direct add option)
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const itemsTab = [{ key: "all", label: "Tất cả" }, ...categories.map(c => ({ key: String(c.id), label: c.name }))];

  return (
    <div style={{ padding: "20px 50px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ background: 'linear-gradient(90deg, #1677ff 0%, #00b96b 100%)', height: 200, borderRadius: 8, marginBottom: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 40, paddingRight: 40, color: '#fff', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <h1>Siêu Sale Tháng 12 - Giảm giá đến 50%</h1>
          {userRole && <p style={{marginTop: 10, fontSize: 16}}>Chào mừng bạn quay trở lại!</p>}
        </div>
        {userRole && (
          <Space direction="vertical" align="end">
            <Button type="primary" ghost icon={<OrderedListOutlined />} onClick={() => navigate('/orders')} size="large">
              Lịch sử đơn hàng
            </Button>
          </Space>
        )}
      </div>

      <div style={{ background: '#fff', padding: '10px 20px', borderRadius: 8, marginBottom: 20 }}>
        <Tabs defaultActiveKey="all" items={itemsTab} onChange={handleTabChange} />
      </div>

      {loading ? <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div> : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
              <Card
                hoverable
                style={{ borderRadius: 8, overflow: 'hidden' }}
                cover={
                  <img 
                    alt={item.name} 
                    src={item.image ? item.image : "https://placehold.co/300x200?text=No+Image"} 
                    style={{ height: 200, objectFit: "cover", cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${item.id}`)}
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200?text=Error"; }}
                  />
                }
              >
                <Meta
                  title={<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.name}>{item.name}</div>}
                  description={
                    <div>
                      <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16, margin: '5px 0' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </div>
                      
                      {/* 4. Nút gọi Modal */}
                      <Button 
                        type="primary" icon={<ShoppingCartOutlined />} block
                        onClick={(e) => {
                            e.stopPropagation(); 
                            openAddToCartModal(item); 
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
      )}

      <ProductVariantModal 
        visible={isModalVisible}
        product={selectedProduct}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default HomePage;