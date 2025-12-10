import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Button, Spin } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { addToCart } from "../unti/cart";
import ProductVariantModal from "../models/ProductVariantModal.jsx";
import { elasticSearchApi } from "../unti/elasticSearch";

const { Meta } = Card;

export default function SearchPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      if (!query) return;
      setLoading(true);

      const res = await elasticSearchApi(query);
      console.log("Elastic result:", res);

      // API có thể trả array hoặc object.data
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
        ? res.data
        : [];

      setResults(list);
      setLoading(false);
    };

    fetch();
  }, [query]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    if (!product) return;
    // open modal which will fetch product details and handle variants/add
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  return (
    <div style={{ padding: "20px 50px", minHeight: "100vh", background: "#f0f2f5" }}>
      <h2 style={{ marginBottom: 20 }}>
        Kết quả tìm kiếm cho: <span style={{ color: "#1677ff" }}>"{query}"</span>
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : results.length === 0 ? (
        <h3>Không tìm thấy sản phẩm nào.</h3>
      ) : (
        <Row gutter={[16, 16]}>
          {results.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
              <Card
                hoverable
                style={{ borderRadius: 8, overflow: "hidden" }}
                cover={
                  <img
                    alt={item.name}
                    src={item.image || "https://via.placeholder.com/300"}
                    style={{ height: 200, objectFit: "cover", cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                }
              >
                <Meta
                  title={<span style={{ color: "#333" }}>{item.name}</span>}
                  description={
                    <div>
                      <div
                        style={{
                          color: "#ff4d4f",
                          fontWeight: "bold",
                          fontSize: 16,
                          margin: "5px 0",
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
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
      <ProductVariantModal
        visible={isModalVisible}
        product={selectedProduct}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
}
