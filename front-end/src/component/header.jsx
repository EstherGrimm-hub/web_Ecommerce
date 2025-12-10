// import React, { useState, useEffect } from "react";
// import { Menu, Badge } from "antd";
// import {
//   ShoppingCartOutlined,
//   LogoutOutlined,
//   UserOutlined,
//   LoginOutlined,
//   UserAddOutlined,
//   ReadOutlined,
// } from "@ant-design/icons";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import HeaderSearch from "./search.jsx";

// const Header = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [current, setCurrent] = useState(location.pathname);
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     const checkLogin = () => {
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");
//       const user = JSON.parse(
//         localStorage.getItem("user") ||
//           sessionStorage.getItem("user") ||
//           null
//       );

//       if (token && user) {
//         setUserRole(user.role);
//       } else {
//         setUserRole(null);
//       }
//     };

//     checkLogin();
//     window.addEventListener("storageUpdate", checkLogin);

//     return () => window.removeEventListener("storageUpdate", checkLogin);
//   }, [location]);


//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("user");

//     window.dispatchEvent(new Event("storageUpdate"));
//     navigate("/login");
//   };


//   const handleSearchSelect = (product) => {
//     if (product.isSearchText) {
//       // Enter để tìm kiếm theo text
//       navigate(`/search?query=${product.name}`);
//     } else {
//       // Chọn product trong dropdown
//       navigate(`/product/${product.id}`);
//     }
//   };

//   // Guest (chưa login)
//   const guestItems = [
//     { label: <Link to="/blog">Blog</Link>, key: "blog", icon: <ReadOutlined /> },

//     {
//       label: "Account",
//       key: "account",
//       icon: <UserOutlined />,
//       children: [
//         {
//           label: <Link to="/login">Login</Link>,
//           key: "/login",
//           icon: <LoginOutlined />,
//         },
//         {
//           label: <Link to="/register">Register</Link>,
//           key: "/register",
//           icon: <UserAddOutlined />,
//         },
//       ],
//     },
//   ];

//   // User đã login
//   const userItems = [
//     { label: <Link to="/blog">Blog</Link>, key: "blog", icon: <ReadOutlined /> },

//     {
//       label: <span onClick={logout}>Sign Out</span>,
//       key: "logout",
//       icon: <LogoutOutlined />,
//       danger: true,
//     },
//   ];

//   const menuItems = userRole ? userItems : guestItems;


//   const headerStyle = {
//     position: "sticky",
//     top: 0,
//     zIndex: 1000,
//     width: "100%",
//     background: "#fff",
//     padding: "0 50px",
//     height: "64px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//   };

//   return (
//     <div style={headerStyle}>
//       {/* LOGO */}
//       <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "24px" }}>
//         <Link to="/" style={{ color: "#1677ff", textDecoration: "none" }}>
//           MyShop
//         </Link>
//       </h2>

//       {/* SEARCH BAR */}
//       <HeaderSearch
//             onSelectResult={(item) => {
//               if (item?.isSearchText) {
//                 navigate(`/search?q=${item.name}`);
//               } else {
//                 navigate(`/product/${item.id}`);
//               }
//             }}
//        />


//       {/* RIGHT SIDE */}
//       <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//         {/* CART */}
//         <Link
//           to="/cart"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             color: "inherit",
//           }}
//         >
//           <Badge count={0} size="small" showZero>
//             <ShoppingCartOutlined style={{ fontSize: "22px", color: "#555" }} />
//           </Badge>
//         </Link>

//         {/* MENU ACCOUNT */}
//         <Menu
//           onClick={(e) => setCurrent(e.key)}
//           selectedKeys={[current]}
//           mode="horizontal"
//           items={menuItems}
//           style={{
//             background: "transparent",
//             borderBottom: "none",
//             minWidth: "100px",
//             justifyContent: "flex-end",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Header;



import React, { useState, useEffect } from "react";
import { Menu, Badge } from "antd";
import {
  ShoppingCartOutlined,
  LogoutOutlined,
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderSearch from "./search.jsx";
import { getCart } from "../unti/cart";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(location.pathname);
  const [userRole, setUserRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // ======================
  // 1. CHECK LOGIN & CART
  // ======================
  useEffect(() => {
    const checkLogin = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const user = JSON.parse(
        localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          null
      );

      setUserRole(token && user ? user.role : null);
    };

    const checkCart = () => {
      try {
        const cart = getCart();
        const qty = Array.isArray(cart)
          ? cart.reduce((s, item) => s + (item.quantity || 0), 0)
          : 0;
        setCartCount(qty);
      } catch {
        setCartCount(0);
      }
    };

    checkLogin();
    checkCart();

    window.addEventListener("storageUpdate", checkLogin);
    window.addEventListener("storageUpdate", checkCart);

    return () => {
      window.removeEventListener("storageUpdate", checkLogin);
      window.removeEventListener("storageUpdate", checkCart);
    };
  }, [location]);

  // ======================
  // 2. LOGOUT
  // ======================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.dispatchEvent(new Event("storageUpdate"));
    navigate("/login");
  };

  // ======================
  // 3. SEARCH → CLICK PRODUCT / ENTER SEARCH
  // ======================
  const handleSearchSelect = (item) => {
    if (item?.isSearchText) {
      navigate(`/search?q=${item.name}`);
    } else {
      navigate(`/product/${item.id}`);
    }
  };

  // ======================
  // 4. MENU ITEMS
  // ======================
  const guestItems = [
    { label: <Link to="/blog">Blog</Link>, key: "blog", icon: <ReadOutlined /> },
    {
      label: "Account",
      key: "account",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/login">Login</Link>,
          key: "/login",
          icon: <LoginOutlined />,
        },
        {
          label: <Link to="/register">Register</Link>,
          key: "/register",
          icon: <UserAddOutlined />,
        },
      ],
    },
  ];

  const userItems = [
    { label: <Link to="/blog">Blog</Link>, key: "blog", icon: <ReadOutlined /> },

    {
      label: <Link to="/orders">Lịch sử đơn hàng</Link>,
      key: "orders",
      icon: <ShoppingCartOutlined />,
    },

    {
      label: <span onClick={logout}>Sign Out</span>,
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const menuItems = userRole ? userItems : guestItems;

  // ======================
  // 5. UI STYLE
  // ======================
  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    background: "#fff",
    padding: "0 50px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  };

  return (
    <div style={headerStyle}>
      {/* LOGO */}
      <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "24px" }}>
        <Link to="/" style={{ color: "#1677ff", textDecoration: "none" }}>
          MyShop
        </Link>
      </h2>

      {/* SEARCH BAR */}
      <div style={{ flex: 1, padding: "0 40px", maxWidth: "600px" }}>
        <HeaderSearch onSelectResult={handleSearchSelect} />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* CART */}
        <Link
          to="/cart"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
          }}
        >
          <Badge count={cartCount} size="small" showZero>
            <ShoppingCartOutlined style={{ fontSize: "22px", color: "#555" }} />
          </Badge>
        </Link>

        {/* ACCOUNT MENU */}
        <Menu
          onClick={(e) => setCurrent(e.key)}
          selectedKeys={[current]}
          mode="horizontal"
          items={menuItems}
          style={{
            background: "transparent",
            borderBottom: "none",
            minWidth: "100px",
            justifyContent: "flex-end",
          }}
        />
      </div>
    </div>
  );
};

export default Header;
