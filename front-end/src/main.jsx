import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'antd/dist/reset.css';

// Components & Layout
import App from './App.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';

// User Pages
import HomePage from './pages/Home.jsx';
import UserPage from './pages/user/User.jsx';
import RegisterPage from './pages/user/Register.jsx';
import LoginPage from './pages/user/Login.jsx';
import CartPage from './pages/user/CartPage.jsx';
import BlogPage from './pages/user/BlogPage.jsx';
import ArticleDetail from './pages/user/ArticleDetail.jsx';
import UserStoreDetail from './pages/user/StoreDetail.jsx';
// Admin Pages
import Admin from './pages/admin/Admin.jsx';
import Admin_Dashboard from './pages/admin/Admin_DashBoard.jsx';
import GetAllUsers from './pages/admin/getalluser.jsx';
import GetallSellers from './pages/admin/getallseller.jsx';
import GetAllProducts from './pages/admin/getAllProducts.jsx';
import GetAllOrders from './pages/admin/getAllOrders.jsx';
import GetAllItems from './pages/admin/getAllItems.jsx';
import GetAllStores from './pages/admin/getAllStores.jsx';

// Seller Pages
import Seller from './pages/seller/Seller.jsx';
import RegisterStore from './pages/seller/StoreRegister.jsx';
import StorePage from './pages/seller/StorePage.jsx';
import ProductList from './pages/seller/ProductList.jsx'; 
import AddProduct from './pages/seller/AddProduct.jsx';
import OrderList from './pages/seller/OrderList.jsx';
import Dashboard from './pages/seller/Dashboard.jsx';
import ArticleList from './pages/seller/ArticleList.jsx';
import AddArticle from './pages/seller/AddArticle.jsx';

const router = createBrowserRouter([

  // ====================== Public / User Routes ======================
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:id', element: <ArticleDetail /> },
      { path: 'store/:id', element: <UserStoreDetail /> }
    ]
  },

  // ====================== Auth Routes ======================
  { path: '/register', element: <RegisterPage /> },
  { path: '/login', element: <LoginPage /> },

  // ====================== Admin Routes (Protected) ======================
  {
    path: '/Admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Admin_Dashboard /> },
      { path: 'dashboard', element: <Admin_Dashboard /> },
      { path: 'users', element: <GetAllUsers /> },
      { path: 'sellers', element: <GetallSellers /> },
      { path: 'products', element: <GetAllProducts /> },
      { path: 'orders', element: <GetAllOrders /> },
      { path: 'stores', element: <GetAllStores /> },
      { path: 'items', element: <GetAllItems /> }
    ]
  },

  // ====================== Seller Routes (Protected) ======================
  {
    path: '/Seller',
    element: (
      <ProtectedRoute roles={['seller']}>
        <Seller />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'store', element: <StorePage /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/create', element: <AddProduct /> },
      { path: 'products/edit/:id', element: <AddProduct /> },
      { path: 'registerStore', element: <RegisterStore /> },
      { path: 'orders', element: <OrderList /> },
      { path: 'articles', element: <ArticleList /> },
      { path: 'articles/create', element: <AddArticle /> },
      { path: 'articles/edit/:id', element: <AddArticle /> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
