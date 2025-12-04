import React, { useEffect, useState } from "react";
import { Table, Button, Image, Popconfirm, notification, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { getItemsByStoreApi, deleteItemApi } from "../../unti/api_seller";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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
      notification.error({ message: "Xóa thất bại" });
    }
  };

  const columns = [
    { 
        title: "Ảnh", 
        dataIndex: "image", 
        width: 100, 
        render: (image) => image ? <Image width={60} height={60} src={image} style={{objectFit: 'cover', borderRadius: '4px'}} /> : "N/A"
    },
    { title: "ID", dataIndex: "id", width: 70 },
    { 
        title: "Tên sản phẩm", dataIndex: "name", width: 250,
        render: (text) => <strong>{text}</strong>
    },
    { 
        title: "Giá", dataIndex: "price", 
        render: (price) => <span style={{color: 'green', fontWeight: 'bold'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
    },
    { title: "Tồn kho", dataIndex: "stock" },
    {
      title: "Hành động",
      render: (_, record) => (
        <div style={{display:'flex', gap: 10}}>
            {/* Nút Sửa: Chuyển hướng sang trang Edit kèm ID */}
            <Button 
                type="primary" 
                size="small" 
                onClick={() => navigate(`/Seller/products/edit/${record.id}`)}
            >
                Sửa
            </Button>
            
            {/* Nút Xóa: Có xác nhận Popconfirm */}
            <Popconfirm 
                title="Xóa sản phẩm này?" 
                onConfirm={() => handleDelete(record.id)} 
                okText="Có" 
                cancelText="Không"
            >
                <Button danger size="small">Xóa</Button>
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
      />
    </div>
  );
};

export default ProductList;