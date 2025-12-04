import React, { useState } from "react";
import { Table, Button, Card, Typography, Tag, Input, Space, Popconfirm, Image, message } from "antd";
import { 
    SearchOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    EyeOutlined 
} from "@ant-design/icons";

const { Title } = Typography;

// Dữ liệu giả định Sản phẩm
const initialItemsData = [
    { key: 1, id: 1001, name: "Áo Thun Unisex Cotton", store_id: 1, store_name: "Fashion Zone 24/7", category: "Thời Trang", price: 150000, stock: 50, status: "Pending", imageUrl: "placeholder_ao.jpg" },
    { key: 2, id: 1002, name: "iPhone 15 Pro Max 256GB", store_id: 2, store_name: "Tech Global", category: "Điện Thoại", price: 29990000, stock: 10, status: "Active", imageUrl: "placeholder_iphone.jpg" },
    { key: 3, id: 1003, name: "Sách: Đắc Nhân Tâm", store_id: 3, store_name: "Sách Cũ Vintage", category: "Sách", price: 85000, stock: 5, status: "Pending", imageUrl: "placeholder_sach.jpg" },
    { key: 4, id: 1004, name: "Quần Jeans Rách", store_id: 1, store_name: "Fashion Zone 24/7", category: "Thời Trang", price: 350000, stock: 20, status: "Rejected", imageUrl: "placeholder_quan.jpg" },
];

// Hàm lấy màu cho tag Status
const getStatusColor = (status) => {
    switch (status) {
        case 'Active': return 'green';
        case 'Pending': return 'volcano';
        case 'Rejected': return 'red';
        default: return 'default';
    }
};

const GetAllItems = () => {
    const [items, setItems] = useState(initialItemsData);
    const [searchText, setSearchText] = useState('');

    // --- Hàm xử lý Duyệt sản phẩm ---
    const updateItemStatus = (id, newStatus) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, status: newStatus } : item
        ));
        message.success(`${newStatus === 'Active' ? 'Duyệt' : 'Từ chối'} sản phẩm ID: ${id} thành công.`);
    };

    // --- Hàm xử lý Xem chi tiết (Demo) ---
    const handleViewDetails = (record) => {
        console.log("Xem chi tiết Sản phẩm:", record);
        alert(`Xem chi tiết và Mô tả sản phẩm: ${record.name}`);
    };
    
    // --- Định nghĩa Cột Bảng ---
    const itemColumns = [
        { 
            title: "Ảnh", 
            dataIndex: "imageUrl", 
            key: "image",
            render: (url) => <Image width={50} src={url} alt="Sản phẩm" fallback="no_image.png" style={{ borderRadius: 4 }} />,
            width: 70
        },
        { title: "ID", dataIndex: "id", sorter: (a, b) => a.id - b.id, width: 80 },
        { 
            title: "Tên Sản phẩm", 
            dataIndex: "name", 
            sorter: (a, b) => a.name.localeCompare(b.name) 
        },
        { 
            title: "Cửa hàng", 
            dataIndex: "store_name", 
            sorter: (a, b) => a.store_name.localeCompare(b.store_name),
            filters: Array.from(new Set(items.map(i => i.store_name))).map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.store_name.indexOf(value) === 0,
        },
        { title: "Giá", dataIndex: "price", render: (price) => price.toLocaleString('vi-VN') + '₫', sorter: (a, b) => a.price - b.price, width: 120 },
        { title: "Kho", dataIndex: "stock", sorter: (a, b) => a.stock - b.stock, width: 80 },
        { 
            title: "Trạng thái", 
            dataIndex: "status",
            filters: [
                { text: 'Pending (Chờ duyệt)', value: 'Pending' },
                { text: 'Active (Đang bán)', value: 'Active' },
                { text: 'Rejected (Từ chối)', value: 'Rejected' },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (status) => (
                <Tag color={getStatusColor(status)} key={status}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        { 
            title: "Thao tác", 
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    {/* Xem chi tiết */}
                    <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => handleViewDetails(record)}
                        type="default"
                    />

                    {/* Nút Duyệt */}
                    {record.status === 'Pending' && (
                        <Popconfirm
                            title={`Duyệt Sản phẩm: ${record.name}`}
                            description="Bạn có chắc chắn muốn DUYỆT sản phẩm này?"
                            onConfirm={() => updateItemStatus(record.id, 'Active')}
                            okText="Duyệt"
                            cancelText="Hủy"
                        >
                            <Button icon={<CheckCircleOutlined />} type="primary" success />
                        </Popconfirm>
                    )}

                    {/* Nút Từ chối/Khóa */}
                    {record.status !== 'Rejected' && (
                        <Popconfirm
                            title={`Từ chối/Khóa Sản phẩm: ${record.name}`}
                            description="Bạn có chắc chắn muốn TỪ CHỐI/KHÓA sản phẩm này? Nó sẽ không hiển thị trên sàn."
                            onConfirm={() => updateItemStatus(record.id, 'Rejected')}
                            okText="Từ chối/Khóa"
                            cancelText="Hủy"
                        >
                            <Button icon={<CloseCircleOutlined />} danger />
                        </Popconfirm>
                    )}
                </Space>
            ),
            width: 150
        },
    ];

    // --- Chức năng Tìm kiếm ---
    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) || 
        item.store_name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Card 
            title={<Title level={4} style={{margin: 0}}>Quản Lý Sản Phẩm Toàn Cầu</Title>} 
            extra={
                <Space>
                    <Input 
                        placeholder="Tìm kiếm theo Tên Sản phẩm/Store..." 
                        prefix={<SearchOutlined />} 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 350 }}
                    />
                </Space>
            }
            style={{ borderRadius: 8, marginTop: 20 }}
        >
            <Table 
                columns={itemColumns} 
                dataSource={filteredItems}
                pagination={{ pageSize: 10 }} 
                scroll={{ x: 'max-content' }}
            />
        </Card>
    );
};

export default GetAllItems;
