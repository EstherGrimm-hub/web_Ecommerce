import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, Button, Modal, Form, Input, notification, Popconfirm, TreeSelect, Image, Empty
} from "antd";

// 1. Import trực tiếp từ file API cũ (không qua Service)
import {
  getCategoriesByStoreApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../unti/api_seller";

const StorePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  
  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("store"));
  const storeId = store?.id;

  // --- CHECK QUYỀN ---
  useEffect(() => {
    if (!storeId) {
      notification.warning({ message: "Please Register First." });
      navigate("/Seller/registerStore");
    }
  }, [storeId, navigate]);

  // --- GET DATA ---
  const handleFetchData = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await getCategoriesByStoreApi(storeId);
      // Xử lý dữ liệu ngay tại đây
      setCategories(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      notification.error({ message: "Fail loading data" });
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId) handleFetchData();
  }, [handleFetchData, storeId]);

  // --- HELPER: Build Tree (Viết trực tiếp trong component) ---
  const buildTree = (list) => {
    const safeList = editingCategory 
      ? list.filter(item => item.id !== editingCategory.id) 
      : list;

    return safeList.map(item => ({
       title: item.name,
       value: item.id,
       key: item.id
    }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (values) => {
    try {
      const payload = { ...values, store_id: storeId };

      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, payload);
        notification.success({ message: "Update Successful" });
      } else {
        await createCategoryApi(payload);
        notification.success({ message: "Create Successful" });
      }
      setModalVisible(false);
      handleFetchData(); 
    } catch (err) {
      console.error(err);
      // Lấy lỗi từ backend trả về (nếu có)
      const msg = err.response?.data?.message || "Fail to interact";
      notification.error({ message: msg });
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    try {
      await deleteCategoryApi(id);
      notification.success({ message: "Delete Successful" });
      handleFetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Fail To Delete";
      notification.error({ message: msg });
    }
  };

  const openModal = (category = null) => {
    setEditingCategory(category);
    form.resetFields();
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        image: category.image,
        parent_id: category.parent_id
      });
    }
    setModalVisible(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { 
        title: "Image", dataIndex: "image", key: "image",
        render: (src) => src ? <Image src={src} width={50} /> : "N/A"
    },
    { title: "Category", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Parent Category", dataIndex: "parent_id", key: "parent_id" },
    {
      title: "Action", key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm title="Are you sure want to delete?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (!storeId) return null;

  return (
    <div>
      <h2>Quản lý Danh mục: <span style={{color: '#1677ff'}}>{store?.name}</span></h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>+ Add Category</Button>

      <Table 
        dataSource={categories} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: <Empty description="Empty" /> }}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Category" name="name" rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="ImageLink" name="image">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
          <Form.Item label="Parent Category" name="parent_id">
            <TreeSelect
              treeData={buildTree(categories)}
              placeholder="Choose Parent Category"
              allowClear
              treeDefaultExpandAll
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingCategory ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StorePage;