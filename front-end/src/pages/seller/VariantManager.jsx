import React, { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, Table, message, Popconfirm, Upload } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { addVariantApi, deleteVariantApi, updateVariantApi } from "../../unti/api_seller";

const VariantManager = ({ visible, onClose, product, onRefresh }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Load danh sách biến thể từ props product
  useEffect(() => {
    if (product && product.variants) {
      setVariants(product.variants);
    } else {
      setVariants([]);
    }
  }, [product]);

  // Xử lý thêm biến thể
  const handleAdd = async (values) => {
    try {
      setLoading(true);
      const data = {
        item_id: product.id,
        size: values.size,
        color: values.color,
        stock: values.stock,
        image: values.image || null, // Nếu có upload ảnh thì xử lý ở đây
        pattern: "" // Tùy chọn
      };

      await addVariantApi(data);
      message.success("Thêm biến thể thành công!");
      form.resetFields();
      onRefresh(); // Gọi hàm refresh để load lại danh sách ở bảng cha
      onClose();   // Đóng modal (hoặc giữ lại tùy bạn)
    } catch (err) {
      message.error("Lỗi thêm biến thể: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa biến thể
  const handleDelete = async (id) => {
    try {
      await deleteVariantApi(id);
      message.success("Đã xóa biến thể");
      onRefresh(); // Refresh lại dữ liệu
      
      // Cập nhật giao diện tạm thời
      setVariants(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    { title: "Size", dataIndex: "size" },
    { title: "Màu", dataIndex: "color" },
    { title: "Kho", dataIndex: "stock" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Popconfirm title="Xóa biến thể này?" onConfirm={() => handleDelete(record.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <Modal
      title={`Quản lý biến thể: ${product?.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {/* 1. Form Thêm Mới */}
      <Form form={form} layout="inline" onFinish={handleAdd} style={{ marginBottom: 20 }}>
        <Form.Item name="size" rules={[{ required: true, message: "Nhập Size" }]}>
          <Input placeholder="Size (S, M, L...)" style={{ width: 100 }} />
        </Form.Item>
        <Form.Item name="color" rules={[{ required: true, message: "Nhập Màu" }]}>
          <Input placeholder="Màu sắc" style={{ width: 100 }} />
        </Form.Item>
        <Form.Item name="stock" rules={[{ required: true, message: "Nhập SL" }]}>
          <InputNumber placeholder="Tồn kho" min={0} style={{ width: 100 }} />
        </Form.Item>
        <Form.Item name="image">
           <Input placeholder="Link ảnh (tùy chọn)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
            Thêm
          </Button>
        </Form.Item>
      </Form>

      {/* 2. Danh sách hiện có */}
      <Table 
        dataSource={variants} 
        columns={columns} 
        rowKey="id" 
        pagination={false} 
        size="small" 
        locale={{ emptyText: "Chưa có biến thể nào" }}
      />
    </Modal>
  );
};

export default VariantManager;