CREATE DATABASE Ecommerce;
GO
USE Ecommerce;
GO
CREATE TABLE Users (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
	phone NVARCHAR(10),
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(10) CHECK (role IN ('user','admin','seller')) DEFAULT 'user',
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
CREATE TABLE Stores (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    store_address NVARCHAR(255),
    store_phone NVARCHAR(20),
    owner_id INT NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (owner_id) REFERENCES Users(id)
);
CREATE TABLE Categories (
    id INT IDENTITY PRIMARY KEY,
    store_id INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    parent_id INT NULL,
    image NVARCHAR(255),
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (store_id) REFERENCES Stores(id),
    FOREIGN KEY (parent_id) REFERENCES Categories(id)
);
CREATE TABLE Items (
    id INT IDENTITY PRIMARY KEY,
    store_id INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(18,2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (store_id) REFERENCES Stores(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

CREATE TABLE ItemVariants (
    id INT IDENTITY PRIMARY KEY,
    item_id INT NOT NULL,
    size NVARCHAR(50),
    color NVARCHAR(50),
    pattern NVARCHAR(50),
    stock INT DEFAULT 0,
    image NVARCHAR(255),
    FOREIGN KEY (item_id) REFERENCES Items(id)
);
CREATE TABLE ItemImages (
    id INT IDENTITY PRIMARY KEY,
    item_id INT NOT NULL,
    image NVARCHAR(255),
    FOREIGN KEY (item_id) REFERENCES Items(id)
);

CREATE TABLE Articles (
    id INT IDENTITY PRIMARY KEY,
	store_id int NOT NULL,
    item_id INT NOT NULL,
	title NVARCHAR(255) NOT NULL,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    isPublished BIT DEFAULT 0,
    image NVARCHAR(255),
	description NVARCHAR(255),
	createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (store_id) REFERENCES Stores(id)
);


CREATE TABLE Orders (
    id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending', -- pending, paid, shipped, completed, cancelled
    total_amount DECIMAL(18,2) NOT NULL,  -- tổng tiền chưa giảm giá/ship
    final_amount DECIMAL(18,2) NOT NULL,  -- tổng tiền phải trả
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
CREATE TABLE OrderItems (
    id INT IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    variant_id INT NULL,  -- nếu có size/color
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(18,2) NOT NULL, -- giá tại thời điểm mua
    subtotal DECIMAL(18,2) NOT NULL, -- price * quantity
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(id),
    FOREIGN KEY (variant_id) REFERENCES ItemVariants(id)
);
CREATE TABLE Vouchers (
    id INT IDENTITY PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE, -- mã voucher VD: SALE10
    description NVARCHAR(255),

    discount_type NVARCHAR(10) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value DECIMAL(18,2) NOT NULL, -- nếu % thì nhập 10 -> 10%

    min_order_value DECIMAL(18,2) DEFAULT 0,  -- đơn tối thiểu

    quantity INT DEFAULT 1,  -- số lần sử dụng còn lại
    max_uses_per_user INT DEFAULT 1,  -- mỗi user chỉ dùng 1 lần

    start_date DATETIME DEFAULT GETDATE(),
    end_date DATETIME NOT NULL,

    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE()
);
CREATE TABLE OrderVouchers (
    id INT IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    voucher_id INT NOT NULL,
    discount_amount DECIMAL(18,2) NOT NULL, -- số tiền giảm thực tế

    createdAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (voucher_id) REFERENCES Vouchers(id)
);
 

 -- 1. Tạo 1 user đóng vai trò người bán
INSERT INTO Users (name, email, password, role) 
VALUES ('Seller One', 'seller@test.com', 'hashedpassword', 'seller');

-- 2. Lấy ID của user vừa tạo để tạo Store (Giả sử ID user là 1)
INSERT INTO Stores (name, description, owner_id) 
VALUES ('Tech Store', 'Ban do cong nghe', 1);
