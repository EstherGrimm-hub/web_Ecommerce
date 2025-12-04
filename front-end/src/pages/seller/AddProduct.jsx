import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Select, notification, Card, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Thêm useParams
import { createItemApi, updateItemApi, getCategoriesByStoreApi, getItemDetailApi } from "../../unti/api_seller";

const AddProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL (nếu có)
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // Loading khi tải dữ liệu cũ

  const store = JSON.parse(localStorage.getItem("store"));
  const storeId = store?.id;
  const isEditMode = !!id; // Nếu có ID => Đang là chế độ Sửa

  // 1. Load danh mục & Load dữ liệu cũ (nếu Edit)
  useEffect(() => {
    if (!storeId) return;

    const initData = async () => {
      try {
        // Load danh mục trước
        const catRes = await getCategoriesByStoreApi(storeId);
        setCategories(Array.isArray(catRes) ? catRes : []);

        // Nếu là Edit -> Load thông tin sản phẩm
        if (isEditMode) {
          setFetching(true);
          const product = await getItemDetailApi(id);
          // Điền dữ liệu vào form
          form.setFieldsValue({
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            stock: product.stock,
            description: product.description,
            image: product.image
          });
        }
      } catch (err) {
        notification.error({ message: "Lỗi tải dữ liệu" });
      } finally {
        setFetching(false);
      }
    };

    initData();
  }, [storeId, id, isEditMode, form]);

  // 2. Xử lý Submit (Phân biệt Tạo mới / Cập nhật)
  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isEditMode) {
        // Gọi API Update
        await updateItemApi(id, values);
        notification.success({ message: "Cập nhật thành công!" });
      } else {
        // Gọi API Create
        const payload = { ...values, store_id: storeId };
        await createItemApi(payload);
        notification.success({ message: "Thêm mới thành công!" });
      }
      navigate("/Seller/products");
    } catch (err) {
      notification.error({ message: "Có lỗi xảy ra: " + (err.response?.data?.message || err.message) });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{textAlign:'center', marginTop: 50}}><Spin size="large" /></div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card title={isEditMode ? "Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Mới"} style={{ width: 800, marginTop: 20 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item label="Tên sản phẩm" name="name" style={{ flex: 2 }} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            
            <Form.Item label="Danh mục" name="category_id" style={{ flex: 1 }} rules={[{ required: true }]}>
              <Select placeholder="Chọn danh mục">
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item label="Giá (VNĐ)" name="price" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>

            <Form.Item label="Tồn kho" name="stock" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả sản phẩm" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Link Hình ảnh" name="image"> 
             <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              {isEditMode ? "Lưu Thay Đổi" : "Tạo Sản Phẩm"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProduct;