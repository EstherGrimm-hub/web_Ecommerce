import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Image, Typography, Radio, Button, InputNumber, message, Spin, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "../../unti/axios.cusomize.js";
import { addToCart } from "../../unti/cart";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/items/${id}`);
      setDetail(res);
      if (res && (!res.variants || res.variants.length === 0)) setSelectedVariant(null);
    } catch (err) {
      message.error("Không tải được chi tiết sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!detail) return;
    if (detail.variants && detail.variants.length > 0 && !selectedVariant) {
      message.warning("Vui lòng chọn biến thể (size/màu)");
      return;
    }
    const stockAvailable = selectedVariant ? selectedVariant.stock : detail.stock;
    if (quantity > stockAvailable) {
      message.warning(`Kho chỉ còn ${stockAvailable} sản phẩm`);
      return;
    }

    const cartItem = {
      id: detail.id,
      name: detail.name,
      price: detail.price,
      image: selectedVariant?.image || detail.image,
      store_name: detail.store_name || "Cửa hàng",
      stock: stockAvailable,
      variant_id: selectedVariant?.id || null,
      size: selectedVariant?.size || null,
      color: selectedVariant?.color || null
    };

    addToCart(cartItem, quantity);
    message.success("Đã thêm vào giỏ hàng");
    navigate('/cart');
  };

  if (loading || !detail) return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={24}>
        <Col xs={24} sm={10}>
          <Image src={detail.image || "https://placehold.co/400x400?text=No+Img"} alt={detail.name} />
        </Col>
        <Col xs={24} sm={14}>
          <Title level={3}>{detail.name}</Title>
          <Title level={4} type="danger">{new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(detail.price)}</Title>
          <Text type="secondary">Shop: {detail.store_name}</Text>

          {detail.variants && detail.variants.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Chọn biến thể:</Text>
              <div style={{ marginTop: 8 }}>
                <Radio.Group onChange={(e) => setSelectedVariant(e.target.value)} value={selectedVariant}>
                  {detail.variants.map(v => (
                    <Radio.Button key={v.id} value={v} disabled={v.stock <= 0} style={{ margin: 6 }}>
                      {v.size} - {v.color} {v.stock <= 0 && <Tag color="red">Hết</Tag>}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Text>Số lượng</Text>
            <InputNumber min={1} max={selectedVariant ? selectedVariant.stock : detail.stock} value={quantity} onChange={setQuantity} />
            <Button type="primary" icon={<ShoppingCartOutlined />} onClick={handleAdd}>
              Thêm vào giỏ
            </Button>
          </div>

          <div style={{ marginTop: 24 }}>
            <Text strong>Mô tả:</Text>
            <div style={{ marginTop: 8 }}>{detail.description}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
