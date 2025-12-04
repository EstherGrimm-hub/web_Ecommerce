// NavbarSeller.jsx
import React from "react";
import { Menu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const NavbarSeller = () => {
  const items = [
    {
      key: 'products',
      label: 'Products',
      icon: <AppstoreOutlined />,
      children: [
        { key: 'dashboard', label: <Link to="/Seller/dashboard">Dashboard</Link> },
        { key: 'list', label: <Link to="/Seller/products">Product List</Link> },
        { key: 'categories', label: <Link to="/Seller/store">Categories</Link> },
        { key: 'orders', label: <Link to="/Seller/orders">Orders</Link> },
        { key: 'articles', label: <Link to="/Seller/articles">Marketing Articles</Link>, },
      ],
    },
  ];

  return (
    <Menu
      mode="inline"            
      items={items}
      defaultOpenKeys={['products']}
      defaultSelectedKeys={['list']}
      style={{ height: '100vh', borderRight: 0 }}
    />
  );
};

export default NavbarSeller;
