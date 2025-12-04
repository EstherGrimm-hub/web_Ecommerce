import React, { useEffect, useState } from "react";
import { Table, Button, Image, Popconfirm, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { getArticlesByStoreApi, deleteArticleApi } from "../../unti/api_seller";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("store"));

  // QUAN TRỌNG: Chỉ chạy lại khi store.id thay đổi
  useEffect(() => {
    if (store?.id) {
        fetchArticles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.id]);

  const fetchArticles = async () => {
    try {
      const res = await getArticlesByStoreApi(store.id);
      setArticles(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticleApi(id);
      notification.success({ message: "Đã xóa bài viết" });
      fetchArticles();
    } catch (err) {
      notification.error({ message: "Xóa thất bại" });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Ảnh", dataIndex: "image", render: src => src ? <Image src={src} width={50} /> : "N/A" },
    { title: "Tiêu đề", dataIndex: "title", width: 300 },
    { title: "Lượt xem", dataIndex: "views" },
    { 
        title: "Trạng thái", dataIndex: "isPublished", 
        render: (val) => val ? <span style={{color:'green'}}>Công khai</span> : <span style={{color:'orange'}}>Ẩn</span> 
    },
    // --- ĐÃ CẬP NHẬT PHẦN NÀY ---
    {
      title: "Hành động",
      render: (_, record) => (
        <div style={{display:'flex', gap: 10}}>
            <Button 
                type="primary" size="small"
                onClick={() => navigate(`/Seller/articles/edit/${record.id}`)}
            >
                Sửa
            </Button>
            <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
                <Button danger size="small">Xóa</Button>
            </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Danh sách bài viết</h2>
        <Button type="primary" onClick={() => navigate("/Seller/articles/create")}>+ Viết bài mới</Button>
      </div>
      <Table dataSource={articles} columns={columns} rowKey="id" />
    </div>
  );
};

export default ArticleList;