import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, notification } from "antd";
import { DollarOutlined, ShoppingCartOutlined, SkinOutlined } from "@ant-design/icons";
import api from "../../unti/axios.cusomize"; 
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({ total_products: 0, total_orders: 0, total_revenue: 0 });
  const store = JSON.parse(localStorage.getItem("store"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!store?.id) {
        // Nếu không có thông tin shop -> không gọi API
        return;
    }

    const fetchStats = async () => {
        try {
            const res = await api.get(`/api/stores/dashboard/${store.id}`);
            setStats(res);
        } catch (error) {
            // Nếu lỗi 401 -> Đá về trang login
            if (error.response && error.response.status === 401) {
                notification.error({ message: "Phiên đăng nhập hết hạn", description: "Vui lòng đăng nhập lại" });
                navigate('/login');
            } else {
                notification.error({ message: "Lỗi tải thống kê" });
            }
        }
    };

    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store?.id]);

  return (
    <div>
      <h2>Tổng quan cửa hàng: <span style={{color: '#1677ff'}}>{store?.name}</span></h2>
      <br />
      <Row gutter={16}>
        <Col span={8}>
          {/* SỬA LỖI WARNING: Thay bordered={false} bằng variant="borderless" */}
          <Card variant="borderless" style={{ background: '#f6ffed' }}>
            <Statistic
              title="Tổng doanh thu"
              value={stats.total_revenue}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ background: '#e6f7ff' }}>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total_orders}
              valueStyle={{ color: '#1677ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card variant="borderless" style={{ background: '#fff7e6' }}>
            <Statistic
              title="Sản phẩm đang bán"
              value={stats.total_products}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<SkinOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;