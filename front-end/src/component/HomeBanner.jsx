import React from "react";
import bannerImg from "../assets/categories/banner.jpg"; // dùng banner của bạn

export default function HomeBanner() {
  return (
    <div
      style={{
        width: "100%",
        height: "280px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={bannerImg}
        alt="banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
