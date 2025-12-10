// src/pages/user/components/HomeRecommended.jsx
import React from "react";
import { Row, Col, Card, Spin, Button, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title } = Typography;

const HomeRecommended = ({ recommended, loading }) => {
  return (
    <div style={{ marginBottom: 30, background: "#fff", padding: 20, borderRadius: 8 }}>
      <Title level={3}>Gợi ý sản phẩm</Title>

      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}><Spin /></div>
      ) : recommended?.length > 0 ? (
        <Row gutter={[16, 16]}>
          {recommended.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
              <Card hoverable cover={
                <img src={item.image || "https://placehold.co/300x200"} style={{ height: 200, objectFit: "cover" }} />
              }>
                <Meta title={item.name} />
                <div style={{ marginTop: 10 }}>
                  <Button type="primary" block icon={<ShoppingCartOutlined />}>
                    Thêm vào giỏ
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: "center", color: "#666" }}>Không có gợi ý</div>
      )}
    </div>
  );
};

export default HomeRecommended;
