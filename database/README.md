# Database Initialization Guide (Internet A2)

## Quick Start

### Initialize Database
```bash
python3 init_db.py
```

**Features:**
- Creates database schema (users, products, cart_items tables)
- Seeds sample data (2 users + 12 products)
- Idempotent operation (safe to run multiple times)

### Force Re-initialization
```bash
python3 init_db.py --force
```
This removes the existing database and creates a fresh one.

## Files

- `init_db.py` - Main initialization script
- `init.sql` - Database schema (SQLite compatible)
- `seed_data.sql` - Sample product and user data

## SQLite Command Line Usage Guide

### Opening the Database in Command Line

To interact with the SQLite database directly using SQL commands:

```bash
sqlite3 database/internet_a2.db
```

Or from the database directory:

```bash
cd database
sqlite3 internet_a2.db
```

Once inside, you'll see the `sqlite>` prompt where you can execute SQL commands.

### Useful SQLite Commands

#### Display Settings
```sql
.headers on          -- Show column headers
.mode column         -- Display results in column format
.width 5 20 10       -- Set column widths
.tables              -- List all tables
.schema products     -- View products table structure
.schema cart_items   -- View cart_items table structure
.schema users        -- View users table structure
.quit                -- Exit sqlite3
.exit                -- Exit sqlite3
```

### CRUD Operations

#### CREATE (Insert Data)
```sql
-- Insert a new product
INSERT INTO products (name, description, price, image_url, stock_quantity, is_available, created_at, updated_at)
VALUES ('New Product', 'Product description here', 99.99, 'https://example.com/image.jpg', 100, 1, datetime('now'), datetime('now'));
```

#### READ (Query Data)
```sql
-- Query all products
SELECT * FROM products;

-- Query specific columns
SELECT id, name FROM products;

-- Filter by price (products under $50)
SELECT * FROM products WHERE price < 50;

-- Sort by price (high to low)
SELECT * FROM products ORDER BY price DESC;

-- Search by name (contains "Wireless")
SELECT * FROM products WHERE name LIKE '%Wireless%';

-- Count total products
SELECT COUNT(*) as total FROM products;

-- Calculate average price
SELECT AVG(price) as average_price FROM products;

-- Group by availability
SELECT is_available, COUNT(*) as count, AVG(price) as avg_price FROM products GROUP BY is_available;

-- Query users
SELECT id, username, email, is_admin FROM users;

-- Query cart items for a specific user
SELECT ci.*, p.name as product_name 
FROM cart_items ci 
JOIN products p ON ci.product_id = p.id 
WHERE ci.user_id = 1;
```

#### UPDATE (Modify Data)
```sql
-- Update product price
UPDATE products SET price = 69.99 WHERE id = 1;

-- Bulk update (10% off all products)
UPDATE products SET price = price * 0.9;

-- Update user admin status
UPDATE users SET is_admin = 1 WHERE email = 'user@example.com';
```

#### DELETE (Remove Data)
```sql
-- Delete a specific product
DELETE FROM products WHERE id = 1;

-- Delete out-of-stock products
DELETE FROM products WHERE stock_quantity = 0;

-- Delete all products (careful!)
DELETE FROM products;

-- Delete cart items for a user
DELETE FROM cart_items WHERE user_id = 1;
```

### Quick One-Liner Commands

You can also execute single SQL commands without entering interactive mode:

```bash
# Query products with low stock
sqlite3 internet_a2.db "SELECT id, name, stock_quantity FROM products WHERE stock_quantity < 50;"

# Update product price
sqlite3 internet_a2.db "UPDATE products SET price = 75.99 WHERE id = 1;"

# Delete a product
sqlite3 internet_a2.db "DELETE FROM products WHERE id = 1;"

# Count total products
sqlite3 internet_a2.db "SELECT COUNT(*) FROM products;"

# Export query results to CSV
sqlite3 -header -csv internet_a2.db "SELECT id, name, price FROM products;" > products.csv
```

### Backup and Restore

#### Create Database Backup
```bash
# Create a backup copy
cp internet_a2.db internet_a2_backup.db

# Or use SQLite's backup command
sqlite3 internet_a2.db ".backup 'internet_a2_backup.db'"
```

#### Export to SQL File
```bash
sqlite3 internet_a2.db ".dump" > backup.sql
```

#### Import from SQL File
```bash
sqlite3 internet_a2.db < backup.sql
```

## Default Test Accounts

After running `python3 init_db.py`, these accounts are available:

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Administrator (can view all users' shopping carts)

### Regular User Account
- **Email**: kuanlong.li@example.com
- **Password**: kuanlong.li
- **Role**: Regular user (can only view own shopping cart)