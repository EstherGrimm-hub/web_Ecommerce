import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Spin, Avatar, Tag } from "antd"; // Thêm Avatar, Tag
import { EyeOutlined, LikeOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllArticlesApi } from "../../unti/api";

const { Meta } = Card;
const { Title, Text } = Typography;

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Logic kiểm tra login
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

  // Logic lấy bài viết
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await getAllArticlesApi();
      setArticles(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px 50px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        Dạo tin tức & Shop
      </Title>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {articles.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                style={{ borderRadius: 8, overflow: 'hidden' }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                        alt={item.title}
                        src={item.image || "https://via.placeholder.com/300x200"}
                        style={{ height: 200, width: '100%', objectFit: "cover" }}
                    />
                    {/* Tag hiển thị giá nếu có sản phẩm đính kèm (Tuỳ chọn) */}
                    {/* <Tag color="red" style={{ position: 'absolute', top: 10, right: 10 }}>Hot</Tag> */}
                  </div>
                }
                onClick={() => navigate(`/blog/${item.id}`)}
                actions={[
                  <span key="view"><EyeOutlined /> {item.views}</span>,
                  <span key="like"><LikeOutlined /> {item.likes}</span>,
                ]}
              >
                {/* PHẦN HIỂN THỊ THÔNG TIN SHOP */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <Avatar 
                        size="small" 
                        src={item.store_image} 
                        icon={<ShopOutlined />} 
                        style={{ marginRight: 8 }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.store_name || "Hệ thống"}
                    </Text>
                </div>

                <Meta
                  title={<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>}
                  description={
                    <div
                      style={{
                        height: 44, // Giới hạn chiều cao description
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.description}
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

export default BlogPage;