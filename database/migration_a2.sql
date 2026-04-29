-- Database Migration Script for Assignment A2
-- Adds users table and updates cart_items with user_id

-- Step 1: Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_email ON users(email);

-- Step 2: Recreate cart_items table with user_id
-- Note: SQLite doesn't support ALTER TABLE ADD COLUMN with FOREIGN KEY properly
-- So we need to recreate the table

DROP TABLE IF EXISTS cart_items_new;

CREATE TABLE cart_items_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_id ON cart_items_new(user_id);
CREATE INDEX IF NOT EXISTS idx_product_id_new ON cart_items_new(product_id);

-- Step 3: Migrate existing data (if any) to default user
-- First, create a default admin user if not exists
-- Password hash for 'admin123' using bcrypt
INSERT OR IGNORE INTO users (id, username, email, hashed_password, is_admin) VALUES
(1, 'admin', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILp92S.0i', 1);

-- Insert a default test user
INSERT OR IGNORE INTO users (id, username, email, hashed_password, is_admin) VALUES
(2, 'kuanlong.li', 'kuanlong.li@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILp92S.0i', 0);

-- Copy existing cart items to new table with default user_id = 2 (kuanlong.li)
INSERT INTO cart_items_new (id, user_id, product_id, quantity, created_at, updated_at)
SELECT id, 2, product_id, quantity, created_at, updated_at
FROM cart_items;

-- Drop old table and rename new one
DROP TABLE IF EXISTS cart_items;
ALTER TABLE cart_items_new RENAME TO cart_items;
