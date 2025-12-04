import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, notification, Card, Switch, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
// Import API mới
import { createArticleApi, getItemsByStoreApi, getArticleDetailApi, updateArticleApi } from "../../unti/api_seller";

const AddArticle = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID bài viết
  
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const store = JSON.parse(localStorage.getItem("store"));
  const isEditMode = !!id;

  useEffect(() => {
    if (!store?.id) return;

    const initData = async () => {
        try {
            // Load danh sách sản phẩm để chọn tag
            const itemsRes = await getItemsByStoreApi(store.id);
            setItems(Array.isArray(itemsRes) ? itemsRes : []);

            // Nếu Edit -> Load bài viết cũ
            if (isEditMode) {
                setFetching(true);
                const article = await getArticleDetailApi(id);
                form.setFieldsValue({
                    title: article.title,
                    item_id: article.item_id,
                    description: article.description,
                    image: article.image,
                    isPublished: article.isPublished // Boolean hoặc 0/1
                });
            }
        } catch (err) {
            notification.error({ message: "Lỗi tải dữ liệu" });
        } finally {
            setFetching(false);
        }
    }
    initData();
  }, [store?.id, id, isEditMode, form]);

  const onFinish = async (values) => {
    try {
      const payload = { 
          ...values, 
          store_id: store.id,
          isPublished: values.isPublished ? 1 : 0 
      };

      if (isEditMode) {
          await updateArticleApi(id, payload); // Gọi hàm update chưa có trong api_seller.js (Bạn cần thêm vào)
          // Lưu ý: Cần thêm updateArticleApi vào file api_seller.js nếu chưa có
          // const updateArticleApi = (id, data) => instance.put(`/api/articles/${id}`, data);
          notification.success({ message: "Cập nhật bài viết thành công!" });
      } else {
          await createArticleApi(payload);
          notification.success({ message: "Đăng bài thành công!" });
      }
      navigate("/Seller/articles");
    } catch (err) {
      notification.error({ message: "Lỗi xử lý" });
    }
  };

  if (fetching) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card title={isEditMode ? "Sửa Bài Viết" : "Viết Bài Mới"} style={{ width: 800, marginTop: 20 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isPublished: true }}>
          
          <Form.Item label="Tiêu đề bài viết" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Gắn thẻ sản phẩm" name="item_id" rules={[{ required: false }]}>
            <Select placeholder="Chọn sản phẩm trong shop">
              {items.map(i => <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Nội dung" name="description">
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item label="Link Ảnh (URL)" name="image">
            <Input />
          </Form.Item>

          <Form.Item label="Trạng thái" name="isPublished" valuePropName="checked">
            <Switch checkedChildren="Công khai" unCheckedChildren="Ẩn" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            {isEditMode ? "Lưu Thay Đổi" : "Đăng Bài"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AddArticle;