import React from "react";
import { Outlet } from "react-router-dom";
import SellerHeader from "../../component/Header_seller.jsx";
import NavbarSeller from "../../component/Navbar_seller.jsx";

export default function SellerLayout() {
  return (
    // 1. Container bao quanh toàn bộ màn hình
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      
      {/* 2. Sidebar bên trái (Cố định chiều rộng 256px) */}
      <div 
        style={{ 
          width: "256px", 
          flexShrink: 0, // Không cho co lại
          borderRight: "1px solid #e8e8e8",
          backgroundColor: "#fff",
          position: "sticky", // (Tuỳ chọn) Giữ sidebar khi cuộn
          top: 0,
          height: "100vh",
          overflowY: "auto"
        }}
      > 
        <NavbarSeller />
      </div>

      {/* 3. Phần nội dung bên phải (Tự giãn hết phần còn lại) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Header nằm trên cùng của phần bên phải */}
        <div style={{ borderBottom: "1px solid #e8e8e8", backgroundColor: "#fff" }}>
            <SellerHeader />
        </div>

        {/* Khu vực hiển thị nội dung con (Outlet - Nơi StoreRegister hiện ra) */}
        <div 
          style={{ 
            flex: 1, // Tự giãn chiều cao
            padding: "24px", 
            backgroundColor: "#f5f5f5", // Màu nền xám nhẹ cho nội dung nổi bật
            overflowY: "auto" // Cho phép cuộn nếu nội dung dài
          }}
        >
          <Outlet />
        </div>

      </div>
    </div>
  );
}




