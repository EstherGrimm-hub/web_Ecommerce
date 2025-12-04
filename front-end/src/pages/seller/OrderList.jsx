import React, { useEffect, useState } from "react";
import { Table, Tag, Select, notification, Button } from "antd";
import { getOrdersByStoreApi, updateOrderStatusApi } from "../../unti/api_seller";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const store = JSON.parse(localStorage.getItem("store"));
  const storeId = store?.id;

  useEffect(() => {
    if (storeId) fetchOrders();
  }, [storeId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrdersByStoreApi(storeId);
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      notification.error({ message: "Lỗi tải đơn hàng" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      notification.success({ message: "Cập nhật trạng thái thành công" });
      fetchOrders(); // Load lại bảng
    } catch (err) {
      notification.error({ message: "Cập nhật thất bại" });
    }
  };

  const columns = [
    { title: "ID Đơn", dataIndex: "id", width: 80 },
    { title: "Khách hàng", dataIndex: "user_name" },
    { 
      title: "Tổng tiền", 
      dataIndex: "total_amount",
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
    },
    { title: "Ngày đặt", dataIndex: "createdAt", render: (date) => new Date(date).toLocaleString() },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = "blue";
        if (status === "completed") color = "green";
        if (status === "cancelled") color = "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 140 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          disabled={record.status === 'cancelled' || record.status === 'completed'} // Không cho sửa nếu đã xong/hủy
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="shipped">Shipped</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý Đơn hàng</h2>
        <Button onClick={fetchOrders}>Làm mới</Button>
      </div>
      <Table 
        dataSource={orders} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
      />
    </div>
  );
};

export default OrderList;