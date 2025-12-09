// src/unti/cart.js
import { notification } from "antd";

const CART_KEY = "myshop_cart";

export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Notify app about cart changes
  window.dispatchEvent(new Event("storageUpdate"));
};

// 3. Thêm sản phẩm (ĐÃ NÂNG CẤP check variant_id)
export const addToCart = (product, quantity = 1) => {
  let cart = getCart();
  
  // Kiểm tra trùng: Cùng ID sản phẩm VÀ cùng variant_id
  const index = cart.findIndex((item) => 
      item.id === product.id && item.variant_id === product.variant_id
  );

  if (index > -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      store_name: product.store_name,
      stock: product.stock, 
      // Lưu thêm thông tin biến thể
      variant_id: product.variant_id || null,
      size: product.size || null,
      color: product.color || null,
      quantity: quantity,
    });
  }

  saveCart(cart);
  notification.success({ message: "Đã thêm vào giỏ hàng!" });
};

// 4. Cập nhật số lượng (Cần truyền variant_id)
export const updateCartQuantity = (productId, variantId, newQuantity) => {
  let cart = getCart();
  const index = cart.findIndex((item) => item.id === productId && item.variant_id === variantId);
  
  if (index > -1) {
    if (newQuantity <= 0) return removeFromCart(productId, variantId);
    cart[index].quantity = newQuantity;
    saveCart(cart);
  }
  return cart;
};

// 5. Xóa sản phẩm (Cần truyền variant_id)
export const removeFromCart = (productId, variantId) => {
  let cart = getCart();
  // Lọc bỏ item khớp cả ID và VariantID
  const newCart = cart.filter((item) => !(item.id === productId && item.variant_id === variantId));
  saveCart(newCart);
  return newCart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("storageUpdate"));
};