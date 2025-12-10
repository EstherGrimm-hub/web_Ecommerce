import React, { useState } from 'react';
import api from '../../unti/axios.cusomize';
import { useNavigate } from 'react-router-dom';

const StoreRegister = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')); 
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        store_address: '',
        store_phone: '',
        owner_id: user?.id 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kiểm tra đăng nhập
        if (!user || !user.id) {
            alert("Vui lòng đăng nhập trước khi tạo cửa hàng!");
            navigate('/login');
            return;
        }

        try {
            await api.post('/api/stores', formData);
            alert("Đăng ký cửa hàng thành công!");
            navigate('/Seller/store'); 
        } catch (error) {
            const msg = error.response?.data?.message || "Không thể tạo shop";
            alert("Lỗi: " + msg);
        }
    };

    return (
        // Card trắng bao quanh Form
        <div style={{ 
            maxWidth: "600px", 
            margin: "0 auto", // Căn giữa
            backgroundColor: "#fff", 
            padding: "40px", 
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)" // Đổ bóng nhẹ
        }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>Đăng ký mở gian hàng</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Tên Shop:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ width: "100%", padding: "10px", border: "1px solid #d9d9d9", borderRadius: "4px" }} 
                        required
                        placeholder="Nhập tên cửa hàng của bạn"
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>

                <div className="mb-3" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Mô tả:</label>
                    <textarea 
                        className="form-control" 
                        rows="3" 
                        style={{ width: "100%", padding: "10px", border: "1px solid #d9d9d9", borderRadius: "4px" }}
                        placeholder="Giới thiệu ngắn gọn về cửa hàng..."
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                    />
                </div>

                <div className="mb-3" style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Địa chỉ kho:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ width: "100%", padding: "10px", border: "1px solid #d9d9d9", borderRadius: "4px" }} 
                        required
                        placeholder="Địa chỉ lấy hàng"
                        onChange={e => setFormData({...formData, store_address: e.target.value})} 
                    />
                </div>

                <div className="mb-4" style={{ marginBottom: "30px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Số điện thoại Shop:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        style={{ width: "100%", padding: "10px", border: "1px solid #d9d9d9", borderRadius: "4px" }} 
                        required
                        placeholder="Số điện thoại liên hệ"
                        onChange={e => setFormData({...formData, store_phone: e.target.value})} 
                    />
                </div>

                <button type="submit" style={{ 
                    width: "100%", 
                    padding: "12px", 
                    backgroundColor: "#1677ff", // Màu xanh Ant Design
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "4px", 
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "background 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#4096ff"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#1677ff"}
                >
                    Đăng Ký Ngay
                </button>
            </form>
        </div>
    );
};

export default StoreRegister;