import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Typography, Image, Button, message, Skeleton, Divider, 
  Card, Avatar, Row, Col, Tag 
} from "antd";
import { 
  LikeOutlined, EyeOutlined, CalendarOutlined, 
  ArrowLeftOutlined, ShopOutlined, EnvironmentOutlined, 
  ShoppingCartOutlined 
} from "@ant-design/icons";
import { getArticleDetailApi, likeArticleApi } from "../../unti/api";

const { Title, Paragraph, Text } = Typography;

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [userRole, setUserRole] = useState(null);

  // Biến cờ hiệu để chặn gọi api 2 lần
  const hasFetched = useRef(false);

  // 1. Logic kiểm tra Login & Role
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user") || null
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

  // 2. Logic lấy chi tiết bài viết
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDetail = async () => {
      try {
        const res = await getArticleDetailApi(id);
        setArticle(res);
        setLikeCount(res.likes);
      } catch (err) {
        message.error("Không tìm thấy bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 3. Logic Like (Đã fix lỗi bắt đăng nhập lại)
  const handleLike = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
        message.warning("Vui lòng đăng nhập để Like bài viết!");
        navigate("/login"); 
        return;
    }

    try {
      await likeArticleApi(id); 
      setLikeCount(prev => prev + 1);
      message.success("Đã thích bài viết!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
         message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
         setUserRole(null);
         localStorage.removeItem("token");
         sessionStorage.removeItem("token");
         navigate("/login");
      } else {
         message.error(err.response?.data?.message || "Lỗi kết nối");
      }
    }
  };

  if (loading) return <div style={{ padding: 50 }}><Skeleton active /></div>;
  if (!article) return <div>Bài viết không tồn tại</div>;

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "20px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        
        {/* Nút quay lại */}
        <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/blog")} 
            style={{ marginBottom: 10, paddingLeft: 0 }}
        >
          Quay lại danh sách
        </Button>

        <Row gutter={[24, 24]}>
          
          {/* --- CỘT TRÁI: NỘI DUNG BÀI VIẾT (Chiếm 2/3 màn hình) --- */}
          <Col xs={24} lg={16}>
            <div style={{ background: "#fff", padding: 40, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Title level={2} style={{ marginTop: 0 }}>{article.title}</Title>
              
              <div style={{ display: "flex", gap: 20, color: "#888", marginBottom: 20, fontSize: 13 }}>
                  <span><CalendarOutlined /> {new Date(article.createdAt).toLocaleDateString()}</span>
                  <span><EyeOutlined /> {article.views} lượt xem</span>
              </div>

              {article.image && (
                  <Image 
                      src={article.image} 
                      width="100%" 
                      style={{ borderRadius: 8, marginBottom: 30, maxHeight: 400, objectFit: 'cover' }} 
                  />
              )}

              <Typography>
                  <Paragraph style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: 'pre-line', color: '#333' }}>
                      {article.description}
                  </Paragraph>
              </Typography>

              <Divider />
              
              <div style={{ textAlign: "center" }}>
                  <Button 
                      type={userRole ? "primary" : "default"}
                      shape="round" 
                      icon={<LikeOutlined />} 
                      size="large"
                      onClick={handleLike}
                  >
                      Thích bài viết ({likeCount})
                  </Button>
                  
                  {!userRole && (
                    <div style={{ marginTop: 10, fontSize: 12, color: '#999' }}>
                        (Đăng nhập để tương tác)
                    </div>
                  )}
              </div>
            </div>
          </Col>

          {/* --- CỘT PHẢI: THÔNG TIN SHOP & SẢN PHẨM (Chiếm 1/3 màn hình) --- */}
          <Col xs={24} lg={8}>
            
            {/* 1. THẺ THÔNG TIN SHOP */}
            <Card 
              title={<span><ShopOutlined /> Thông tin Shop</span>}
              style={{ marginBottom: 20, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Avatar 
                    size={80} 
                    src={article.store_image || "https://via.placeholder.com/150"} 
                    icon={<ShopOutlined />}
                    style={{ marginBottom: 10, border: '1px solid #ddd' }}
                />
                <Title level={4} style={{ margin: 0 }}>{article.store_name || "Tên Shop"}</Title>
                <div style={{ color: '#888', marginTop: 5 }}>
                    <EnvironmentOutlined /> {article.store_address || "Địa chỉ chưa cập nhật"}
                </div>
              </div>
              
              {/* Nút ghé thăm Store */}
              {article.store_id && (
                <Button 
                    type="primary" 
                    block 
                    onClick={() => navigate(`/store/${article.store_id}`)}
                >
                    Ghé thăm Cửa hàng
                </Button>
              )}
            </Card>

            {/* 2. THẺ SẢN PHẨM ĐƯỢC GẮN KÈM (Nếu có) */}
            {article.item_id && (
                <Card 
                  title={<span style={{color: '#ff4d4f'}}>🔥 Sản phẩm trong bài</span>} 
                  size="small"
                  style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                >
                  <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                    <img 
                        alt="product" 
                        src={article.item_image || "https://via.placeholder.com/100"} 
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} 
                    />
                    <div style={{ flex: 1 }}>
                        <Text strong style={{ display: 'block', marginBottom: 5, lineHeight: '1.2' }}>
                            {article.item_name || "Sản phẩm đề xuất"}
                        </Text>
                        <Text type="danger" strong style={{ fontSize: 16 }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(article.item_price || 0)}
                        </Text>
                        <div style={{ marginTop: 10 }}>
                            <Button 
                                type="primary" 
                                size="small" 
                                ghost
                                icon={<ShoppingCartOutlined />} 
                                onClick={() => navigate(`/product/${article.item_id}`)}
                            >
                                Xem chi tiết
                            </Button>
                        </div>
                    </div>
                  </div>
                </Card>
            )}

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ArticleDetail;