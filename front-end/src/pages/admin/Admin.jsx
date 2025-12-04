// import { Outlet } from "react-router-dom";
// import AdminSidebar from "../../component/Admin_Sidebar.jsx";

// export default function AdminLayout() {
//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       <AdminSidebar />
//       <div style={{ flex: 1, padding: "20px" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout, Menu, Badge, Avatar, Typography } from "antd";
import { 
  AppstoreOutlined, 
  UserOutlined, 
  ShopOutlined, 
  ShoppingCartOutlined, 
  BarChartOutlined, 
  LogoutOutlined, 
  BellOutlined 
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout() { // Đổi tên thành AdminLayout nếu cần
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard"); 
  // Lưu ý: Cần kết nối state này với routing thực tế nếu bạn có nhiều trang con

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR Ant Design (Lấy từ Admin_Dashboard cũ) */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div
          style={{ 
            height: 50, margin: 16, color: "#fff", 
            textAlign: "center", lineHeight: "50px", fontWeight: "bold" 
          }}
        >
          {collapsed ? "A" : "Admin Panel"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)} // Tạm thời
          items={[
            { key: "dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
            { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
          ]}
        />
      </Sider>

      {/* Main Content Layout */}
      <Layout>
        {/* HEADER Ant Design (Lấy từ Admin_Dashboard cũ) */}
        <Header
          style={{ 
            background: "#fff", padding: "0 24px", display: "flex", 
            justifyContent: "space-between", alignItems: "center", 
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)" 
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Admin Dashboard
          </Title>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Badge count={5}><BellOutlined style={{ fontSize: 22 }} /></Badge>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>

        {/* CONTENT chính - Nơi các trang con (Dashboard, Users) được render */}
        <Content style={{ margin: 24 }}>
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  );
}