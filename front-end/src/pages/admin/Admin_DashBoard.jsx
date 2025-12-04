import React from "react";
import { Card, Button, Typography, Table, Tag } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  DollarCircleOutlined,
  TruckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from 'react-router-dom'; // 👈 Import Hook chuyển hướng

const { Title, Text } = Typography;

// --- Dữ liệu giả định ---
const recentOrdersData = [
    { key: 1, orderId: "#0005", customer: "Đức Trọng", total: 550000, status: "Pending", date: "2025-12-03" },
    { key: 2, orderId: "#0004", customer: "Hồng Nhung", total: 1200000, status: "Processing", date: "2025-12-02" },
    { key: 3, orderId: "#0003", customer: "Văn Hải", total: 300000, status: "Shipped", date: "2025-12-01" },
];

// Hàm lấy thông tin status cho bảng
const getStatusInfo = (status) => {
    switch (status) {
        case 'Pending': return { color: 'orange', icon: <ClockCircleOutlined /> };
        case 'Processing': return { color: 'blue', icon: <DollarCircleOutlined /> };
        case 'Shipped': return { color: 'cyan', icon: <TruckOutlined /> };
        default: return { color: 'default', icon: null };
    }
};

const orderColumns = [
    { title: "Mã Đơn", dataIndex: "orderId" },
    { title: "Khách hàng", dataIndex: "customer" },
    { 
        title: "Tổng tiền", 
        dataIndex: "total", 
        render: (text) => `${text.toLocaleString('vi-VN')}₫` 
    },
    { title: "Ngày đặt", dataIndex: "date" },
    { 
        title: "Trạng thái", 
        dataIndex: "status", 
        render: (status) => {
            const info = getStatusInfo(status);
            return (
                <Tag color={info.color} icon={info.icon}>
                    {status.toUpperCase()}
                </Tag>
            );
        }
    },
    { 
        title: "Thao tác", 
        render: () => <Button size="small" type="link">Chi tiết</Button>
    },
];

// Dữ liệu cho Revenue Chart
const revenueData = [
    { month: "Thg 1", value: 3000 },
    { month: "Thg 2", value: 4500 },
    { month: "Thg 3", value: 5200 },
    { month: "Thg 4", value: 4800 },
    { month: "Thg 5", value: 7500 },
    { month: "Thg 6", value: 8100 },
];

// Dữ liệu và liên kết cho Quick Actions
const dashboardActions = [
    { label: "Quản lý Đơn hàng", path: "/admin/orders", icon: <ShoppingCartOutlined /> },
    { label: "Quản lý Người dùng", path: "/admin/users", icon: <UserOutlined /> },
    { label: "Quản lý Cửa hàng", path: "/admin/stores", icon: <ShopOutlined /> },
    { label: "Kiểm duyệt Sản phẩm", path: "/admin/items", icon: <DollarCircleOutlined /> },
];

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* KPI Cards */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                    { title: "Users", value: 12500, change: "+8%", color: "green" },
                    { title: "Orders", value: 3800, change: "-3%", color: "red" },
                    { title: "Revenue", value: "18.200.000₫", change: "+12%", color: "green" }, 
                    { title: "Products", value: 920, change: "+2%", color: "green" },
                ].map((item, index) => (
                    <Card key={index} style={{ flexGrow: 1, minWidth: 200, textAlign: "center", borderRadius: 8 }}>
                        <Text type="secondary">{item.title}</Text>
                        <Title level={3}>{item.value}</Title>
                        <Text style={{ color: item.color, fontWeight: 500 }}>
                            {item.change.startsWith("+") ? <RiseOutlined /> : <FallOutlined />} {item.change}
                        </Text>
                    </Card>
                ))}
            </div>

            {/* Revenue Chart */}
            <Card title={<Title level={4} style={{ margin: 0 }}>Xu hướng Doanh thu (VND)</Title>} style={{ marginTop: 20, borderRadius: 8 }}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value}M`} />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} Triệu ₫`, 'Doanh thu']} />
                        <Line type="monotone" dataKey="value" stroke="#1890ff" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Bảng Đơn hàng Gần đây */}
            <Card 
                title={<Title level={4} style={{ margin: 0 }}>Đơn Hàng Mới Nhất</Title>}
                extra={<Button type="link" onClick={() => navigate('/admin/orders')}>Xem tất cả</Button>}
                style={{ marginTop: 20, borderRadius: 8 }}
            >
                <Table
                    columns={orderColumns}
                    dataSource={recentOrdersData}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            {/* Quick Actions */}
            <Title level={5} style={{ marginTop: 20 }}>Truy cập Nhanh</Title>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {dashboardActions.map((action, index) => (
                    <Card key={index} style={{ width: 180, textAlign: "center", cursor: 'pointer' }}>
                        <Button 
                            type="primary" 
                            icon={action.icon}
                            onClick={() => navigate(action.path)}
                            style={{ width: '100%' }}
                        >
                            {action.label}
                        </Button>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default AdminDashboard;
