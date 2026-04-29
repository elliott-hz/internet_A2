"""
Database Initialization Script for SQLite (Assignment A2)
Uses SQL files to initialize database and seed data.

Files used:
- init.sql: Creates database schema (tables, indexes)
- seed_data.sql: Inserts sample data (users, products)
- migration_a2.sql: Migration script (if upgrading from A1)

Usage:
    python init_db.py              # Initialize database using SQL files
    python init_db.py --force      # Force re-initialization (drops existing database)
"""

import sys
import os
import argparse
import sqlite3


def get_db_path():
    """Get the database file path"""
    return os.path.join(os.path.dirname(__file__), 'internet_a2.db')


def check_database_exists():
    """Check if database file exists"""
    db_path = get_db_path()
    return os.path.exists(db_path)


def check_schema_version():
    """
    Check if database is A1 or A2 schema
    Returns: 'a1' (needs migration), 'a2' (up to date), or 'empty' (new database)
    """
    db_path = get_db_path()
    
    if not os.path.exists(db_path):
        return 'empty'
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        has_users = cursor.fetchone() is not None
        
        # Check if cart_items has user_id column
        has_user_id = False
        if has_users:
            cursor.execute("PRAGMA table_info(cart_items)")
            columns = [row[1] for row in cursor.fetchall()]
            has_user_id = 'user_id' in columns
        
        conn.close()
        
        if has_users and has_user_id:
            return 'a2'
        elif has_users or not has_user_id:
            return 'a1'
        else:
            return 'empty'
            
    except Exception as e:
        print(f"Warning: Could not check schema version: {e}")
        return 'empty'


def execute_sql_file(sql_file_path):
    """
    Execute a SQL file against the database
    """
    db_path = get_db_path()
    
    if not os.path.exists(sql_file_path):
        raise FileNotFoundError(f"SQL file not found: {sql_file_path}")
    
    print(f"  Executing: {os.path.basename(sql_file_path)}")
    
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        sql_script = f.read()
    
    # Remove SQL comments (lines starting with --)
    lines = sql_script.split('\n')
    cleaned_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith('--'):
            cleaned_lines.append(line)
    
    cleaned_script = '\n'.join(cleaned_lines)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Split SQL script into individual statements
        statements = [stmt.strip() for stmt in cleaned_script.split(';') if stmt.strip()]
        
        executed_count = 0
        skipped_count = 0
        for statement in statements:
            if statement:
                try:
                    cursor.execute(statement)
                    executed_count += 1
                except sqlite3.Error as e:
                    error_msg = str(e).lower()
                    # Ignore common idempotency errors
                    if 'already exists' in error_msg or 'no such table' in error_msg:
                        # These are expected for DROP TABLE IF EXISTS and CREATE TABLE IF NOT EXISTS
                        skipped_count += 1
                    else:
                        print(f"    ⚠️  Warning: {e}")
        
        conn.commit()
        print(f"  ✅ Executed {executed_count} statements successfully")
        if skipped_count > 0:
            print(f"  ℹ️  Skipped {skipped_count} statements (expected for idempotent operations)")
        
    except Exception as e:
        conn.rollback()
        print(f"  ❌ Error executing SQL: {e}")
        raise
    finally:
        conn.close()


def run_migration():
    """Run A2 migration if needed"""
    print("\n🔄 Checking if migration is needed...")
    
    schema_version = check_schema_version()
    
    if schema_version == 'a1':
        print("  Detected A1 schema, running migration...")
        migration_file = os.path.join(os.path.dirname(__file__), 'migration_a2.sql')
        
        if os.path.exists(migration_file):
            execute_sql_file(migration_file)
            print("  ✅ Migration completed")
        else:
            print("  ⚠️  Migration file not found, skipping")
    elif schema_version == 'a2':
        print("  ✅ Database is already A2 schema, skipping migration")
    else:
        print("  ℹ️  New database, no migration needed")


def create_tables():
    """Create database tables using init.sql"""
    print("\n📦 Creating database tables...")
    
    sql_file = os.path.join(os.path.dirname(__file__), 'init.sql')
    
    if not os.path.exists(sql_file):
        raise FileNotFoundError(f"init.sql not found: {sql_file}")
    
    execute_sql_file(sql_file)
    print("✅ Tables created successfully")


def seed_data():
    """Insert sample data using seed_data.sql"""
    print("\n🌱 Seeding sample data...")
    
    sql_file = os.path.join(os.path.dirname(__file__), 'seed_data.sql')
    
    if not os.path.exists(sql_file):
        raise FileNotFoundError(f"seed_data.sql not found: {sql_file}")
    
    execute_sql_file(sql_file)
    
    # Verify data was inserted
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM products")
        product_count = cursor.fetchone()[0]
        
        print(f"\n✅ Data seeded successfully:")
        print(f"   - Users: {user_count}")
        print(f"   - Products: {product_count}")
        
    except Exception as e:
        print(f"  ⚠️  Could not verify data: {e}")
    finally:
        conn.close()


def verify_database():
    """Verify database was initialized correctly"""
    print("\n🔍 Verifying database...")
    
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = [row[0] for row in cursor.fetchall()]
        
        required_tables = ['users', 'products', 'cart_items']
        missing_tables = [t for t in required_tables if t not in tables]
        
        if missing_tables:
            print(f"  ❌ Missing tables: {missing_tables}")
            return False
        
        print(f"  ✅ All required tables exist: {', '.join(required_tables)}")
        
        # Check data
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM products")
        product_count = cursor.fetchone()[0]
        
        if user_count == 0:
            print(f"  ⚠️  No users found")
        else:
            print(f"  ✅ Users: {user_count}")
        
        if product_count == 0:
            print(f"  ⚠️  No products found")
        else:
            print(f"  ✅ Products: {product_count}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Verification failed: {e}")
        return False
    finally:
        conn.close()


def init_database(force=False):
    """
    Main initialization function using SQL files
    """
    print("=" * 70)
    print("  Internet A2 Shopping Cart - Database Initialization (SQL)")
    print("=" * 70)
    
    db_path = get_db_path()
    
    try:
        # Handle force mode
        if force:
            print("\n⚠️  FORCE mode: Removing existing database...")
            if os.path.exists(db_path):
                os.remove(db_path)
                print("  ✅ Database removed")
        
        # Check current state
        schema_version = check_schema_version()
        print(f"\n📊 Current schema version: {schema_version.upper()}")
        
        # Run migration if needed
        if schema_version != 'empty':
            run_migration()
        
        # Create tables (idempotent - uses CREATE TABLE IF NOT EXISTS)
        create_tables()
        
        # Seed data (idempotent - uses INSERT OR IGNORE)
        seed_data()
        
        # Verify
        if verify_database():
            print("\n" + "=" * 70)
            print("✅ Database initialization completed successfully!")
            print("=" * 70)
            print("\n📝 Next steps:")
            print("   - Start the application: ./restart.sh")
            print("   - Login as admin: username='admin', password='admin123'")
            print("   - Login as user: username='kuanlong.li', password='kuanlong.li'")
            print()
        else:
            print("\n" + "=" * 70)
            print("⚠️  Database initialization completed with warnings")
            print("=" * 70)
            print()
        
    except Exception as e:
        print("\n" + "=" * 70)
        print(f"❌ Database initialization failed: {e}")
        print("=" * 70)
        print("\nTroubleshooting:")
        print("   - Check if database file is locked by another process")
        print("   - Try: rm database/internet_a2.db && python init_db.py")
        print("   - Run with --force flag to reset: python init_db.py --force")
        print()
        sys.exit(1)


def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description='Initialize the Internet A2 database using SQL files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python init_db.py              # Normal initialization (auto-detects schema)
  python init_db.py --force      # Force re-initialization (drops all tables)

SQL Files Used:
  - init.sql: Database schema
  - seed_data.sql: Sample data
  - migration_a2.sql: A1 to A2 migration (if needed)
        """
    )
    
    parser.add_argument(
        '--force',
        action='store_true',
        help='Force re-initialization by removing existing database'
    )
    
    args = parser.parse_args()
    init_database(force=args.force)


if __name__ == "__main__":
    main()
