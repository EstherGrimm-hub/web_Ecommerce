import { Menu } from 'antd';
import { DashboardOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { label: <Link to="dashboard">Dashboard</Link>, key: '/admin/dashboard', icon: <DashboardOutlined /> },
    { label: <Link to="users">Users</Link>, key: '/admin/users', icon: <UserOutlined /> },
    { label: <Link to="sellers">Sellers</Link>, key: '/admin/sellers', icon: <UserOutlined /> },
    { label: <span onClick={logout}>Logout</span>, key: 'logout', icon: <LogoutOutlined /> },
  ];

  return (
    <div style={{ width: 200, height: "100vh", borderRight: "1px solid #f0f0f0" }}>
      <h3 style={{ padding: "16px" }}>Admin Panel</h3>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </div>
  );
}
