// src/pages/seller/ProductList.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Image, Popconfirm, notification, Empty, Tag, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, AppstoreAddOutlined } from "@ant-design/icons"; // Thêm icon
import { useNavigate } from "react-router-dom";
import { getItemsByStoreApi, deleteItemApi } from "../../unti/api_seller";

// Import Component Modal quản lý biến thể (Đảm bảo bạn đã tạo file này ở bước trước)
import VariantManager from "./VariantManager";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- STATE CHO MODAL BIẾN THỂ ---
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("store"));
  const storeId = store?.id;

  useEffect(() => {
    if (!storeId) {
      notification.warning({ message: "Vui lòng đăng ký cửa hàng trước." });
      navigate("/Seller/registerStore");
    } else {
      fetchProducts();
    }
  }, [storeId, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getItemsByStoreApi(storeId);
      // Backend (itemService) cần trả về kèm mảng 'variants'
      setProducts(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      notification.error({ message: "Lỗi tải danh sách sản phẩm" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemApi(id);
      notification.success({ message: "Đã xóa sản phẩm" });
      fetchProducts();
    } catch (err) {
      notification.error({ message: "Xóa thất bại (Có thể do ràng buộc dữ liệu)" });
    }
  };

  // --- HÀM MỞ MODAL BIẾN THỂ ---
  const openVariantModal = (product) => {
      setSelectedProduct(product);
      setIsVariantModalOpen(true);
  };

  const columns = [
    { 
        title: "Ảnh", 
        dataIndex: "image", 
        width: 80, 
        render: (image) => image ? <Image width={50} height={50} src={image} style={{objectFit: 'cover', borderRadius: '4px'}} /> : "N/A"
    },
    { title: "ID", dataIndex: "id", width: 60 },
    { 
        title: "Tên sản phẩm", dataIndex: "name", width: 200,
        render: (text) => <strong>{text}</strong>
    },
    { 
        title: "Giá", dataIndex: "price", width: 120,
        render: (price) => <span style={{color: 'green', fontWeight: 'bold'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
    },
    { title: "Tồn kho", dataIndex: "stock", width: 90 },
    {
      title: "Hành động",
      width: 200,
      render: (_, record) => (
        <div style={{display:'flex', gap: 8}}>
            {/* Nút Sửa */}
            <Tooltip title="Sửa thông tin chung">
                <Button 
                    icon={<EditOutlined />} 
                    size="small" 
                    type="primary"
                    onClick={() => navigate(`/Seller/products/edit/${record.id}`)}
                />
            </Tooltip>

            {/* Nút Quản lý Biến thể (Mới tích hợp) */}
            <Tooltip title="Quản lý Size/Màu">
                <Button 
                    type="default"
                    style={{ borderColor: '#faad14', color: '#faad14' }}
                    icon={<AppstoreAddOutlined />} 
                    size="small"
                    onClick={() => openVariantModal(record)}
                />
            </Tooltip>

            {/* Nút Xóa */}
            <Popconfirm 
                title="Xóa sản phẩm này?" 
                description="Lưu ý: Tất cả biến thể cũng sẽ bị xóa!"
                onConfirm={() => handleDelete(record.id)} 
                okText="Có" 
                cancelText="Không"
            >
                <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
        </div>
      ),
    },
  ];
  
  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>Danh sách sản phẩm</h2>
        <Button type="primary" onClick={() => navigate("/Seller/products/create")}>
          + Thêm Sản Phẩm Mới
        </Button>
      </div>

      <Table 
        dataSource={products} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        locale={{ emptyText: <Empty description="Chưa có sản phẩm nào" /> }}
        
        // --- TÍNH NĂNG MỞ RỘNG (EXPANDABLE) ---
        // Cho phép bấm dấu + để xem nhanh các biến thể
        expandable={{
            expandedRowRender: (record) => (
                <div style={{ paddingLeft: 60 }}>
                    <div style={{ marginBottom: 5, fontWeight: 'bold', fontSize: 12, color: '#888' }}>Danh sách biến thể:</div>
                    {record.variants && record.variants.length > 0 ? (
                        record.variants.map(v => (
                            <Tag key={v.id} color="geekblue" style={{ marginRight: 8, marginBottom: 5 }}>
                                {v.size} - {v.color} (Kho: {v.stock})
                            </Tag>
                        ))
                    ) : (
                        <span style={{ fontStyle: 'italic', color: '#ccc' }}>Chưa có biến thể nào (Sản phẩm đơn)</span>
                    )}
                </div>
            ),
            // Chỉ hiện dấu + nếu mảng variants tồn tại (để giao diện gọn gàng)
            rowExpandable: (record) => true, 
        }}
      />

      {/* --- MODAL QUẢN LÝ BIẾN THỂ --- */}
      <VariantManager 
        visible={isVariantModalOpen}
        product={selectedProduct}
        onClose={() => setIsVariantModalOpen(false)}
        onRefresh={fetchProducts} // Refresh lại bảng sau khi thêm/xóa biến thể xong
      />
    </div>
  );
};

export default ProductList;