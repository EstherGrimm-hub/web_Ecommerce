import React from "react";
import { Table, Button, Card, Typography, Tag } from "antd";

const { Title } = Typography;

// Dữ liệu giả định sản phẩm
const productsData = [
    { key: 1, name: "Laptop Gaming A", price: 1200, stock: 50, category: "Electronics" },
    { key: 2, name: "Áo Thun Unisex", price: 35, stock: 200, category: "Fashion" },
    { key: 3, name: "Sách Kinh Tế", price: 15, stock: 120, category: "Books" },
    { key: 4, name: "Tai Nghe Bluetooth", price: 80, stock: 0, category: "Electronics" },
];

// Định nghĩa cột bảng
const productColumns = [
    { title: "Tên sản phẩm", dataIndex: "name" },
    { 
        title: "Danh mục",
        dataIndex: "category",
        render: (text) => <Tag color="blue">{text}</Tag>
    },
    { 
        title: "Giá",
        dataIndex: "price",
        render: (price) => `$${price}`
    },
    { 
        title: "Tồn kho",
        dataIndex: "stock",
        render: (stock) => (
            <Tag color={stock > 0 ? "green" : "red"}>
                {stock > 0 ? stock : "Hết hàng"}
            </Tag>
        )
    },
    { 
        title: "Thao tác",
        render: (_, record) => (
            <div>
                <Button type="link" size="small">Sửa</Button>
                <Button danger size="small">Xóa</Button>
            </div>
        )
    },
];

const GetAllProducts = () => {
  return (
    <Card
      title={<Title level={4} style={{ margin: 0 }}>Quản Lý Sản Phẩm</Title>}
      extra={<Button type="primary">Thêm Sản Phẩm</Button>}
      style={{ borderRadius: 8, marginTop: 20 }}
    >
      <Table
        columns={productColumns}
        dataSource={productsData}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default GetAllProducts;
