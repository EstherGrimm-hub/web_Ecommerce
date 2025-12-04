import React, { useEffect, useState } from "react";
import { Modal, Button, Radio, Typography, Image, Tag, InputNumber, message, Spin } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "../unti/axios.cusomize"; // Import axios instance
import { addToCart } from "../unti/cart";

const { Text, Title } = Typography;

const ProductVariantModal = ({ product, visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null); // Lưu chi tiết SP + Variants
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Khi mở modal -> Gọi API lấy chi tiết để có danh sách variants mới nhất
  useEffect(() => {
    if (visible && product?.id) {
      fetchProductDetail(product.id);
      setSelectedVariant(null);
      setQuantity(1);
    }
  }, [visible, product]);

  const fetchProductDetail = async (id) => {
    try {
      setLoading(true);
      // Gọi API lấy chi tiết (API này bạn đã có: itemController.getItemDetail)
      const res = await axios.get(`/api/items/${id}`);
      setDetail(res);
      
      // Nếu sản phẩm không có biến thể, tự động chọn mặc định
      if (res && (!res.variants || res.variants.length === 0)) {
          setSelectedVariant(null); 
      }
    } catch (err) {
      message.error("Lỗi tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!detail) return;

    // 1. Kiểm tra: Nếu có variants mà chưa chọn -> Báo lỗi
    if (detail.variants && detail.variants.length > 0 && !selectedVariant) {
        message.warning("Vui lòng chọn loại hàng (Size/Màu)!");
        return;
    }

    // 2. Kiểm tra tồn kho
    const stockAvailable = selectedVariant ? selectedVariant.stock : detail.stock;
    if (quantity > stockAvailable) {
        message.warning(`Kho chỉ còn ${stockAvailable} sản phẩm`);
        return;
    }

    // 3. Chuẩn bị dữ liệu add vào cart
    const cartItem = {
        id: detail.id,
        name: detail.name,
        price: detail.price,
        store_name: detail.store_name || "Cửa hàng", // Cần đảm bảo API trả về tên store, nếu ko thì lấy từ props product
        
        // Nếu có chọn variant thì lấy ảnh variant, không thì lấy ảnh gốc
        image: selectedVariant?.image || detail.image,
        
        // Thông tin biến thể
        variant_id: selectedVariant?.id || null,
        size: selectedVariant?.size || null,
        color: selectedVariant?.color || null,
        stock: stockAvailable
    };

    // 4. Gọi hàm từ cart.js
    addToCart(cartItem, quantity);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
    >
      {loading ? <div style={{textAlign: 'center', padding: 20}}><Spin /></div> : (
        detail && (
            <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                {/* Ảnh sản phẩm (Thay đổi theo variant chọn) */}
                <Image 
                    width={200} 
                    src={selectedVariant?.image || detail.image || "https://placehold.co/200x200?text=No+Img"} 
                    style={{ borderRadius: 8 }}
                />

                <div style={{ flex: 1 }}>
                    <Title level={4}>{detail.name}</Title>
                    <Title level={3} type="danger">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.price)}
                    </Title>

                    {/* Danh sách biến thể (Nếu có) */}
                    {detail.variants && detail.variants.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <Text strong>Chọn loại hàng:</Text>
                            <div style={{ marginTop: 10, maxHeight: 150, overflowY: 'auto' }}>
                                <Radio.Group 
                                    onChange={(e) => setSelectedVariant(e.target.value)} 
                                    value={selectedVariant}
                                >
                                    {detail.variants.map(v => (
                                        <Radio.Button 
                                            key={v.id} 
                                            value={v}
                                            disabled={v.stock <= 0}
                                            style={{ margin: "0 10px 10px 0", borderRadius: 4 }}
                                        >
                                            {v.size} - {v.color} 
                                            {v.stock <= 0 && <span style={{color: 'red'}}> (Hết)</span>}
                                        </Radio.Button>
                                    ))}
                                </Radio.Group>
                            </div>
                        </div>
                    )}

                    {/* Chọn số lượng */}
                    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Text>Số lượng:</Text>
                        <InputNumber min={1} max={selectedVariant?.stock || detail.stock} value={quantity} onChange={setQuantity} />
                        <Text type="secondary">
                            (Còn {selectedVariant ? selectedVariant.stock : detail.stock} sản phẩm)
                        </Text>
                    </div>

                    <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />} 
                        size="large" 
                        block
                        onClick={handleAddToCart}
                        disabled={(selectedVariant ? selectedVariant.stock : detail.stock) <= 0}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>
        )
      )}
    </Modal>
  );
};

export default ProductVariantModal;