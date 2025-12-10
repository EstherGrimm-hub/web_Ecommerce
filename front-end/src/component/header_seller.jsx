import { Menu } from 'antd';
import { ShopOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getcheckStoreApi } from '../unti/api.js';

export default function SellerHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasStore, setHasStore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser?.role === "seller") {
      getcheckStoreApi(storedUser.id)
        .then(res => {
          const store = res.hasStore ?? null;

          if (store) {
            localStorage.setItem("store", JSON.stringify(store));
          }

          setHasStore(!!store);
        })
        .catch(err => {
          console.error("Error checking store:", err);
          setHasStore(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  if (loading || !user) return null;

  const menuItems = [
    { label: <Link to="store">Store</Link>, key: 'store', icon: <ShopOutlined /> },
    { label: <span onClick={logout}>Logout</span>, key: 'logout', icon: <LogoutOutlined /> },
  ];

  if (user.role === "seller" && !hasStore) {
    menuItems.splice(1, 0, {
      label: <Link to="registerStore">Register Store</Link>,
      key: 'storeRegister',
      icon: <ShopOutlined />
    });
  }

  return <Menu mode="horizontal" items={menuItems} />;
}
