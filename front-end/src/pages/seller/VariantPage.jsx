import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Table, Form, Input, InputNumber, message, Popconfirm, Space } from "antd";
import { getItemDetailApi, addVariantApi, deleteVariantApi, updateVariantApi } from "../../unti/api_seller";
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";

const VariantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await getItemDetailApi(id);
      setItem(res);
    } catch (err) {
      message.error("Không tải được thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values) => {
    try {
      setLoading(true);
      const payload = {
        item_id: parseInt(id, 10),
        size: values.size,
        color: values.color,
        stock: values.stock || 0,
        image: values.image || null,
        pattern: values.pattern || ""
      };
      await addVariantApi(payload);
      message.success("Thêm biến thể thành công");
      form.resetFields();
      fetchItem();
    } catch (err) {
      message.error(err.response?.data?.message || err.message || "Lỗi thêm biến thể");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (variantId) => {
    try {
      setLoading(true);
      await deleteVariantApi(variantId);
      message.success("Xóa biến thể thành công");
      fetchItem();
    } catch (err) {
      message.error(err.response?.data?.message || err.message || "Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (v) => {
    setEditingId(v.id);
    form.setFieldsValue({ size: v.size, color: v.color, stock: v.stock, image: v.image });
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateVariantApi(editingId, values);
      message.success("Cập nhật biến thể thành công");
      setEditingId(null);
      form.resetFields();
      fetchItem();
    } catch (err) {
      message.error(err.response?.data?.message || err.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Size", dataIndex: "size" },
    { title: "Màu", dataIndex: "color" },
    { title: "Kho", dataIndex: "stock" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleStartEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa biến thể này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
          <h2 style={{ margin: 0 }}>{item?.name || 'Quản lý biến thể'}</h2>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={editingId ? handleSaveEdit : handleAdd} initialValues={{ stock: 0 }}>
          <Form.Item name="size" rules={[{ required: true, message: 'Nhập size' }]}> 
            <Input placeholder="Size (S, M, L)" />
          </Form.Item>

          <Form.Item name="color" rules={[{ required: true, message: 'Nhập màu' }]}> 
            <Input placeholder="Màu" />
          </Form.Item>

          <Form.Item name="stock" rules={[{ required: true, message: 'Nhập tồn kho' }]}> 
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item name="image"> 
            <Input placeholder="Link ảnh (tùy chọn)" />
          </Form.Item>

          <Form.Item>
            {editingId ? (
              <Space>
                <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>Lưu</Button>
                <Button onClick={() => { setEditingId(null); form.resetFields(); }}>Hủy</Button>
              </Space>
            ) : (
              <Button type="primary" icon={<PlusOutlined />} htmlType="submit" loading={loading}>Thêm biến thể</Button>
            )}
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table dataSource={item?.variants || []} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default VariantPage;
