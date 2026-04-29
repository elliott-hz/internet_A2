-- Sample Data for Internet A2 E-commerce Shopping Cart
-- Includes: Users and Products
-- Compatible with SQLite

-- Insert default users (passwords are hashed using bcrypt)
-- Admin user: username='admin', password='admin123'
-- Test user: username='kuanlong.li', password='kuanlong.li'
-- Note: These are pre-hashed passwords. In production, use AuthService.hash_password()
INSERT OR IGNORE INTO users (username, email, hashed_password, is_admin) VALUES
('admin', 'admin@example.com', '$2b$12$6iG2cxytZTC6LDAKgMMQ/uTHYzA9LHOPXMRpOyLbMAuwBPwwwRYrW', 1),
('kuanlong.li', 'kuanlong.li@example.com', '$2b$12$YpwUbZpQiNDUUBVw/Z2B..mnh66c86nnek5ZUBdTnx3T/VW8QLfXK', 0);

-- Insert sample products
INSERT OR IGNORE INTO products (name, description, price, image_url, stock_quantity, is_available) VALUES
('Wireless Bluetooth Headphones', 'Premium noise-cancelling over-ear headphones with 30-hour battery life and superior sound quality', 79.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 50, 1),
('Smart Watch Pro', 'Feature-rich smartwatch with heart rate monitor, GPS, fitness tracking, and 7-day battery life', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 30, 1),
('Portable Power Bank', '20000mAh high-capacity portable charger with fast charging and dual USB ports', 39.99, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', 100, 1),
('Mechanical Keyboard', 'RGB backlit mechanical gaming keyboard with blue switches and aluminum frame', 89.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 45, 1),
('Wireless Mouse', 'Ergonomic wireless mouse with adjustable DPI, silent clicks, and long battery life', 29.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 75, 1),
('USB-C Hub Adapter', '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery', 49.99, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500', 60, 1),
('Laptop Stand', 'Adjustable aluminum laptop stand with ergonomic design and heat dissipation', 44.99, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500', 40, 1),
('Webcam HD 1080p', 'Full HD webcam with autofocus, built-in microphone, and wide-angle lens', 59.99, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500', 35, 1),
('External SSD 1TB', 'Portable solid-state drive with ultra-fast transfer speeds and durable design', 129.99, 'https://picsum.photos/seed/ssd-drive/500/500.jpg', 25, 1),
('Phone Stand Holder', 'Adjustable cell phone stand compatible with all smartphones, perfect for desk', 14.99, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500', 120, 1),
('LED Desk Lamp', 'Dimmable LED desk lamp with touch control, USB charging port, and eye-care technology', 34.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 55, 1),
('Bluetooth Speaker', 'Portable waterproof Bluetooth speaker with 360° sound and 12-hour playtime', 54.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 65, 1);

-- Verify insertion
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;
