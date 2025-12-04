import React, { useState } from "react";
import { Table, Button, Card, Typography, Tag, Input, Space, Popconfirm, message } from "antd";
import { 
    SearchOutlined, 
    EyeOutlined, 
    LockOutlined, 
    UnlockOutlined,
    ShopOutlined 
} from "@ant-design/icons";

const { Title } = Typography;

// Dữ liệu giả định người dùng (Đã bao gồm Sellers)
const dummyUsers = [
    { id: 101, name: "Nguyễn Văn A" }, // Admin (Không có Store)
    { id: 102, name: "Trần Thị B" }, // Seller 1
    { id: 104, name: "Phạm Thu D" }, // Seller 2
];

// Dữ liệu giả định Cửa hàng (Stores)
const initialStoresData = [
    { 
        key: 1, 
        id: 1, 
        name: "Fashion Zone 24/7", 
        owner_id: 102, 
        owner_name: "Trần Thị B", 
        status: "Active",
        total_items: 250, 
        createdAt: "2024-01-15"
    },
    { 
        key: 2, 
        id: 2, 
        name: "Tech Global", 
        owner_id: 104, 
        owner_name: "Phạm Thu D", 
        status: "Pending",
        total_items: 50, 
        createdAt: "2024-11-20"
    },
    { 
        key: 3, 
        id: 3, 
        name: "Sách Cũ Vintage", 
        owner_id: 102, 
        owner_name: "Trần Thị B", 
        status: "Locked",
        total_items: 10, 
        createdAt: "2024-10-01"
    },
];

// Hàm lấy màu cho tag Status
const getStatusColor = (status) => {
    switch (status) {
        case 'Active': return 'green';
        case 'Pending': return 'volcano';
        case 'Locked': return 'red';
        default: return 'default';
    }
};

const GetAllStores = () => {
    const [stores, setStores] = useState(initialStoresData);
    const [searchText, setSearchText] = useState('');

    // Khóa / Mở khóa Store
    const toggleStoreStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Locked' : 'Active';
        setStores(stores.map(store => 
            store.id === id ? { ...store, status: newStatus } : store
        ));
        message.success(`${newStatus === 'Active' ? 'Mở khóa' : 'Khóa'} Store ID: ${id} thành công.`);
    };

    // Xem chi tiết Store
    const handleViewDetails = (record) => {
        alert(`Xem chi tiết Store: ${record.name}. Chuyển hướng đến /admin/stores/${record.id}`);
    };

    // Định nghĩa cột
    const storeColumns = [
        { title: "ID", dataIndex: "id", sorter: (a, b) => a.id - b.id, width: 80 },
        { title: "Tên Cửa hàng", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
        { 
            title: "Chủ sở hữu", 
            dataIndex: "owner_name", 
            filters: dummyUsers.map(u => ({ text: u.name, value: u.name })),
            onFilter: (value, record) => record.owner_name.includes(value)
        },
        { 
            title: "Tình trạng", 
            dataIndex: "status",
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Pending', value: 'Pending' },
                { text: 'Locked', value: 'Locked' },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (status) => (
                <Tag icon={<ShopOutlined />} color={getStatusColor(status)} key={status}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        { title: "Sản phẩm", dataIndex: "total_items", sorter: (a, b) => a.total_items - b.total_items, width: 100 },
        { title: "Ngày tạo", dataIndex: "createdAt", width: 120 },
        { 
            title: "Thao tác", 
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {/* Xem chi tiết */}
                    <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => handleViewDetails(record)}
                        type="primary"
                        ghost
                    />
                    
                    {/* Khóa / Mở khóa */}
                    <Popconfirm
                        title={`Bạn có chắc muốn ${record.status === 'Active' ? 'KHÓA' : 'MỞ KHÓA'} cửa hàng này?`}
                        description={`Hành động này sẽ ${record.status === 'Active' ? 'ngăn' : 'cho phép'} Store ${record.name} bán hàng.`}
                        onConfirm={() => toggleStoreStatus(record.id, record.status)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button 
                            icon={record.status === 'Active' ? <LockOutlined /> : <UnlockOutlined />} 
                            danger={record.status === 'Active'}
                            type={record.status !== 'Active' ? 'primary' : 'default'}
                        />
                    </Popconfirm>
                </Space>
            ),
            width: 150
        },
    ];

    // Tìm kiếm
    const filteredStores = stores.filter(store => 
        store.name.toLowerCase().includes(searchText.toLowerCase()) || 
        store.owner_name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Card 
            title={<Title level={4} style={{margin: 0}}>Quản Lý Cửa Hàng ({stores.length})</Title>} 
            extra={
                <Space>
                    <Input 
                        placeholder="Tìm kiếm theo Tên Store/Owner..." 
                        prefix={<SearchOutlined />} 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button type="primary">Thêm Cửa hàng</Button>
                </Space>
            }
            style={{ borderRadius: 8, marginTop: 20 }}
        >
            <Table 
                columns={storeColumns} 
                dataSource={filteredStores}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />
        </Card>
    );
};

export default GetAllStores;
