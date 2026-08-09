CREATE DATABASE mini_qr_db;
USE mini_qr_db;

CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('Appetizer', 'Entree', 'Dessert', 'Beverage', 'Sides', 'Specials', 'Salads') NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_products_category(category),
    INDEX idx_products_is_available(is_available)

);

CREATE TABLE orders(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) DEFAULT NULL,
    table_number VARCHAR(20) NOT NULL,
    items JSON NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status ENUM('Pending', 'Paid', 'Failed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_orders_status(status),
    INDEX idx_orders_table_number(table_number)

);

-- seed data for products
INSERT INTO products (name, description, price, category, is_available) VALUES
('Garlic Butter Shrimp', 'Succulent shrimp sauteed in garlic and butter', 200.00, 'Appetizer', TRUE),
('Lasagna', 'Layers of pasta, cheese, and meat sauce baked to perfection', 300.00, 'Entree', TRUE),
('Mango Float', 'Layers of Graham crackers, whipped cream, and mangoes', 150.00, 'Dessert', TRUE),
('Iced Tea', 'Refreshing iced tea with a slice of lemon', 50.00, 'Beverage', TRUE),
('French Fries', 'Crispy crunchy fries served with ketchup', 100.00, 'Sides', TRUE),
('Signature Special Pasta', 'Fettucine pasta with a special cream sauce', 300.00, 'Specials', TRUE),
('Caesar Salad', 'Crisp romaine Lettuce with Caesar dressing', 150.00, 'Salads', TRUE);