import React, { useEffect, useState } from "react";
import { Table, Button, Card, Empty, Spin, Tag, Popconfirm, message, Modal, Descriptions } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUserOrderHistoryApi, cancelOrderApi, getOrderDetailApi } from "../../unti/api";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getUserOrderHistoryApi();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      message.error("Không tải được lịch sử đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      setLoading(true);
      await cancelOrderApi(orderId);
      message.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (err) {
      message.error(err.response?.data?.message || err.message || "Hủy đơn thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      setDetailLoading(true);
      const res = await getOrderDetailApi(orderId);
      setSelectedOrder(res);
      setDetailModalVisible(true);
    } catch (err) {
      message.error("Không tải được chi tiết đơn hàng");
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "gold",
      processing: "blue",
      shipped: "cyan",
      completed: "green",
      cancelled: "red"
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Chờ duyệt",
      processing: "Đang xử lý",
      shipped: "Đã gửi",
      completed: "Hoàn thành",
      cancelled: "Đã hủy"
    };
    return texts[status] || status;
  };

  const canCancel = (order) => {
    return order.status !== 'shipped' && order.status !== 'completed' && order.status !== 'cancelled';
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      width: 80,
      render: (id) => `#${id}`
    },
    {
      title: "Tổng tiền",
      dataIndex: "final_amount",
      width: 120,
      render: (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      width: 180,
      render: (date) => new Date(date).toLocaleString('vi-VN')
    },
    {
      title: "Hành động",
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            Chi tiết
          </Button>
          {canCancel(record) && (
            <Popconfirm
              title="Hủy đơn hàng?"
              description="Bạn chắc chắn muốn hủy đơn hàng này?"
              onConfirm={() => handleCancel(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger size="small" icon={<DeleteOutlined />}>Hủy</Button>
            </Popconfirm>
          )}
        </div>
      )
    }
  ];

  if (loading && orders.length === 0) {
    return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử đơn hàng</h2>
      
      <Card>
        {orders.length === 0 ? (
          <Empty description="Chưa có đơn hàng nào" />
        ) : (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        )}
      </Card>

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {detailLoading ? (
          <Spin />
        ) : selectedOrder ? (
          <div>
            <Descriptions column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="Thành tiền">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.final_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(selectedOrder.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            <h4>Chi tiết sản phẩm</h4>
            <Table
              dataSource={selectedOrder.items || []}
              columns={[
                {
                  title: "Sản phẩm",
                  dataIndex: "item_name",
                  width: 200
                },
                {
                  title: "SL",
                  dataIndex: "quantity",
                  width: 50
                },
                {
                  title: "Giá",
                  dataIndex: "price",
                  width: 100,
                  render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
                },
                {
                  title: "Thành tiền",
                  dataIndex: "subtotal",
                  width: 120,
                  render: (subtotal) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)
                }
              ]}
              rowKey="id"
              pagination={false}
            />

            {canCancel(selectedOrder) && (
              <Popconfirm
                title="Hủy đơn hàng?"
                description="Bạn chắc chắn muốn hủy đơn hàng này?"
                onConfirm={() => {
                  handleCancel(selectedOrder.id);
                  setDetailModalVisible(false);
                }}
                okText="Có"
                cancelText="Không"
              >
                <Button danger style={{ marginTop: 16 }} icon={<DeleteOutlined />}>
                  Hủy đơn hàng
                </Button>
              </Popconfirm>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default OrderHistory;