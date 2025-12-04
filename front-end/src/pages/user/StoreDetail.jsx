// src/pages/user/StoreDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Spin, Button, Empty, Avatar, Tabs } from "antd"; // Thêm Tabs
import { ArrowLeftOutlined, ShopOutlined, EnvironmentOutlined } from "@ant-design/icons";
import axios from "../../unti/axios.cusomize.js"; 

const { Title, Text } = Typography;
const { Meta } = Card;

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [allItems, setAllItems] = useState([]); // Lưu tất cả sản phẩm
  const [displayItems, setDisplayItems] = useState([]); // Lưu sản phẩm đang hiển thị (theo filter)
  const [categories, setCategories] = useState([]); // Lưu danh mục
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Gọi API lấy Sản phẩm
      const resItems = await axios.get(`/api/items/store/${id}`);
      console.log("Check API Items:", resItems); // <--- BẬT F12 XEM LOG NÀY

      let itemsData = [];
      if (Array.isArray(resItems)) {
          itemsData = resItems;
          // Lấy info shop từ item đầu tiên nếu có
          if (resItems.length > 0) {
              setStoreInfo({
                  name: resItems[0].store_name,
                  address: resItems[0].store_address,
                  image: resItems[0].store_image
              });
          }
      } else if (resItems && resItems.data) {
          // Trường hợp axios chưa interceptor, dữ liệu nằm trong .data
          itemsData = resItems.data;
      }

      setAllItems(itemsData);
      setDisplayItems(itemsData); // Mặc định hiển thị tất cả

      // 2. Gọi API lấy Danh mục (Vừa tạo ở bước 1)
      try {
          const resCats = await axios.get(`/api/items/store/${id}/categories`);
          if (Array.isArray(resCats)) {
              // Thêm mục "Tất cả" vào đầu
              setCategories([{ id: 'all', name: 'Tất cả' }, ...resCats]);
          }
      } catch (err) {
          console.warn("Chưa lấy được danh mục hoặc chưa có API category", err);
      }

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi bấm vào Tab Category
  const handleTabChange = (key) => {
      if (key === 'all') {
          setDisplayItems(allItems);
      } else {
          // Lọc sản phẩm theo category_id
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

      {/* 2. THANH DANH MỤC (TABS) */}
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
                        <Text type="danger" strong>
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0)}
                        </Text>
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