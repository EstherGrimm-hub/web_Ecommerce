import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + description */}
        <div>
          <h2 className="text-2xl font-bold mb-3">MyShop</h2>
          <p className="text-gray-300">
            Trang thương mại điện tử hiện đại – mua sắm dễ dàng, nhanh chóng và tiện lợi.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline">Trang chủ</Link></li>
            <li><Link to="/products" className="hover:underline">Sản phẩm</Link></li>
            <li><Link to="/about" className="hover:underline">Giới thiệu</Link></li>
            <li><Link to="/contact" className="hover:underline">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Liên hệ</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><Phone size={18}/> 0123 456 789</li>
            <li className="flex items-center gap-2"><Mail size={18}/> support@myshop.com</li>
            <li className="flex items-center gap-2"><Facebook size={18}/> Facebook</li>
            <li className="flex items-center gap-2"><Instagram size={18}/> Instagram</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-5 text-center text-gray-400">
        © {new Date().getFullYear()} MyShop • All rights reserved.
      </div>
    </footer>
  );
}

export { Footer };