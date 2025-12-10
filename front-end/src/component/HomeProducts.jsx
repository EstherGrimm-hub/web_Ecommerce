// src/pages/user/components/HomeProducts.jsx
import React from "react";
import { Row, Col, Card, Typography, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title } = Typography;

const HomeProducts = ({ products }) => {

  const getImage = (product) => {
    if (!product) return "https://placehold.co/300x200";

    // Trường hợp API trả về itemImage: "/uploads/a.jpg"
    if (product.itemImage) {
      return product.itemImage.startsWith("http")
        ? product.itemImage
        : `http://localhost:5000${product.itemImage}`;
    }

    // Trường hợp API trả về ItemImages: [{ image: "/uploads/a.jpg" }]
    if (product.ItemImages?.length > 0) {
      const img = product.ItemImages[0].image;
      return img.startsWith("http")
        ? img
        : `http://localhost:5000${img}`;
    }

    // Trường hợp API trả về image
    if (product.image) {
      return product.image.startsWith("http")
        ? product.image
        : `http://localhost:5000${product.image}`;
    }

    return "https://placehold.co/300x200";
  };

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
      <Title level={3}>Tất cả sản phẩm</Title>

      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.id}>
            <Card
              hoverable
              cover={
                <img
                  src={getImage(product)}
                  style={{ height: 200, width: "100%", objectFit: "cover" }}
                  alt={product.name}
                />
              }
            >
              <Meta title={product.name} />
              <div style={{ marginTop: 10 }}>
                <Button type="primary" block icon={<ShoppingCartOutlined />}>
                  Thêm vào giỏ
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeProducts;
