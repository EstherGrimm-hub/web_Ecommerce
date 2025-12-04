import React, { useEffect, useState } from "react";
import { 
  Card, Row, Col, Typography, Button, Spin, message, Tabs 
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom"; // 1. Thêm useLocation
import { getAllProductsApi, getAllCategoriesApi } from "../unti/api";

const { Meta } = Card;
const { Title } = Typography;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 2. Thêm state lưu role (từ Code 1)
  const [userRole, setUserRole] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation(); // 3. Khai báo location

  // 4. Logic từ Code 1: Kiểm tra Login & Role
  useEffect(() => {
    const checkLogin = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const user = JSON.parse(
        localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          null
      );

      if (token && user) {
        setUserRole(user.role);
      } else {
        setUserRole(null);
      }
    };

    checkLogin();
    window.addEventListener("storageUpdate", checkLogin);

    return () => window.removeEventListener("storageUpdate", checkLogin);
  }, [location]);

  // Logic cũ: Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getAllProductsApi(),
          getAllCategoriesApi()
        ]);
        
        const prodList = Array.isArray(prodRes) ? prodRes : [];
        setProducts(prodList);
        setFilteredProducts(prodList);
        setCategories(Array.isArray(catRes) ? catRes : []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (key) => {
    setActiveCategory(key);
    if (key === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => p.category_id === parseInt(key));
      setFilteredProducts(filtered);
    }
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Kiểm tra sản phẩm đã có chưa
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1; // Tăng số lượng
    } else {
      // Thêm mới (Lưu ý: Mặc định quantity = 1)
      cart.push({ ...product, quantity: 1 });
    }

    // Lưu ngược lại LocalStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Bắn sự kiện để Header cập nhật số lượng badge
    window.dispatchEvent(new Event("storageUpdate"));
    
    message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Cấu trúc Tabs danh mục
  const itemsTab = [
    { key: "all", label: "Tất cả" },
    ...categories.map(c => ({ key: String(c.id), label: c.name }))
  ];

  return (
    <div style={{ padding: "20px 50px", background: "#f0f2f5", minHeight: "100vh" }}>
      
      {/* Banner Quảng Cáo */}
      <div style={{ 
        background: 'linear-gradient(90deg, #1677ff 0%, #00b96b 100%)', 
        height: 200, 
        borderRadius: 8, 
        marginBottom: 30, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#fff',
        flexDirection: 'column' // Để xếp dọc nội dung nếu cần
      }}>
        <h1>Siêu Sale Tháng 12 - Giảm giá đến 50%</h1>
        
        {/* Ví dụ: Hiển thị lời chào nếu đã đăng nhập */}
        {userRole && <p style={{marginTop: 10, fontSize: 16}}>Chào mừng bạn quay trở lại!</p>}
      </div>

      {/* Danh mục */}
      <div style={{ background: '#fff', padding: '10px 20px', borderRadius: 8, marginBottom: 20 }}>
        <Tabs defaultActiveKey="all" items={itemsTab} onChange={handleTabChange} />
      </div>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
              <Card
                hoverable
                style={{ borderRadius: 8, overflow: 'hidden' }}
                cover={
                  <img 
                    alt={item.name} 
                    src={item.image || "https://via.placeholder.com/300"} 
                    style={{ height: 200, objectFit: "cover", cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                }
              >
                <Meta
                  title={<span style={{ color: '#333' }}>{item.name}</span>}
                  description={
                    <div>
                      <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16, margin: '5px 0' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </div>
                      <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />} 
                        block
                        onClick={() => handleAddToCart(item)}
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
    </div>
  );
};

export default HomePage;