// src/pages/user/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Typography, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProductsApi, getAllCategoriesApi } from "../unti/api";
import { recommenderApi } from "../unti/recommender";

// COMPONENTS
import HomeBanner from "../component/HomeBanner.jsx";
import HomeCategories from "../component/HomeCategories.jsx";
import HomeRecommended from "../component/HomeRecommended.jsx";
import HomeProducts from "../component/HomeProducts.jsx";
import ProductVariantModal from "../models/ProductVariantModal.jsx"

const { Title } = Typography;

const HomePage = () => {
  /** STATE **/
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommend, setLoadingRecommend] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // Modal ADD-TO-CART
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  /** CHECK LOGIN **/
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || null);

      if (token && user) setUserRole(user.role);
      else setUserRole(null);
    };
    checkLogin();

    window.addEventListener("storageUpdate", checkLogin);
    return () => window.removeEventListener("storageUpdate", checkLogin);
  }, [location]);

  /** FETCH DATA **/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getAllProductsApi(),
          getAllCategoriesApi(),
        ]);

        const prodList = Array.isArray(prodRes) ? prodRes : [];
        setProducts(prodList);
        setFilteredProducts(prodList);
        setCategories(Array.isArray(catRes) ? catRes : []);

        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (user && user.id) {
          setLoadingRecommend(true);
          const rec = await recommenderApi(user.id);
          setRecommended(Array.isArray(rec) ? rec : []);
        }
      } catch (err) {
        console.warn("Không lấy được gợi ý:", err);
      } finally {
        setLoadingRecommend(false);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "15px" }}>
        
        {/* BANNER */}
        <div style={{ marginBottom: "25px" }}>
          <HomeBanner userRole={userRole} />
        </div>

        {/* CATEGORY */}
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "14px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
            marginBottom: "25px",
          }}
        >
          <HomeCategories
            products={products}
            onFilter={(list) => setFilteredProducts(list)}
          />
        </div>

        {/* RECOMMENDED */}
        {recommended.length > 0 && (
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
              marginBottom: "25px",
            }}
          >
            <HomeRecommended recommended={recommended} loading={loadingRecommend} />
          </div>
        )}

        {/* PRODUCTS */}
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "14px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
            marginBottom: "25px",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: 50 }}>
              <Spin size="large" />
            </div>
          ) : (
            <HomeProducts
              products={filteredProducts}
              onOpenModal={(product) => {
                setSelectedProduct(product);
                setIsModalVisible(true);
              }}
            />
          )}
        </div>

        {/* MODAL ADD TO CART */}
        <ProductVariantModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          product={selectedProduct}
        />

      </div>
    </div>
  );
};

export default HomePage;
