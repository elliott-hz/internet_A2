# Internet A2 - E-commerce Shopping Cart

## Quick Start

### 1. Checking Prerequisites and Setting Up.
```bash
git --version
node -v
npm -v
python3 --version
```

### 2. Install dependences and Run the project with scripts.
```bash
# Make sure [chmod +x] is set for all scripts (cleanup.sh, install.sh, restart.sh)
chmod +x cleanup.sh install.sh restart.sh

# Cleanup dependencies
./cleanup.sh

# Install dependencies (backend, frontend, database)
./install.sh

# Run services(backend and frontend)
./restart.sh

# NOTE: Using control C to stop services
```
### 3. Verify the system and database
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check if frontend is running
curl http://localhost:5173
# or open http://localhost:5173 in your browser
# login with (username: kuanlong.li, password: kuanlong.li)

# Test database (cd root_path/database)
sqlite3 internet_a1.db "SELECT * FROM products;"
# or see root_path/database/README.md for more details
```


## Project Summary
This is a single-page e-commerce shopping cart application that allows users to browse products, add items to cart, modify quantities, and remove items. The application demonstrates full CRUD operations with a MySQL database, built with React frontend and FastAPI backend.

## 1. Tech Stack

### 1.1 Frontend
- **Framework**: React 18.x
- **Language**: JavaScript (ES6+)
- **Styling**: Styled Components
- **State Management**: React Hooks (useState, useEffect, Context API)
- **HTTP Client**: Axios
- **Build Tool**: Vite (with hot reload)

### 1.2 Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database ORM**: SQLAlchemy
- **Database**: SQLite (default, python built-in light database, no further libriariesinstallation required)
- **CORS**: FastAPI CORS middleware

**Note**: The application uses SQLite by default for easy setup. MySQL support is available but optional - see [Database README](database/README.md) for details.

### 1.3 Development Tools
- **Code Quality**: ESLint + Prettier (frontend)
- **Code Quality**: Black + Flake8 (backend)
- **Hot Reload**: Vite HMR (frontend) + Uvicorn auto-reload (backend)

## 2. Features

- ✅ **Product Catalog**: Display all available products with dynamic data loading
- ✅ **Shopping Cart Management**: Add/remove items, adjust quantities
- ✅ **CRUD Operations**: 
  - **Create**: Add new products to cart
  - **Read**: View products and cart items
  - **Update**: Modify item quantities
  - **Delete**: Remove items from cart
- ✅ **Single Page Application**: Dynamic component rendering without page reloads
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Real-time Updates**: Instant UI feedback on all operations
- ✅ **Error Handling**: User-friendly error messages and fallback UI

**Note:** Configuration files are organized within their respective directories:
- Frontend configs (`.eslintrc.json`, `.prettierrc`, `vite.config.js`) are in `frontend/`
- Backend configs (`requirements.txt`, `pyproject.toml`) are in `backend/`

## 3. Folder Structure

```
internet_A2/
├── README.md                    # Project documentation (this file)
├── Allocation.md                # Task allocation document
├── cleanup.sh                   # Cleanup script
├── restart.sh                   # Restart script
├── install.sh                   # Install script
└── .gitignore                   # Git ignore rules
│
├── assignment/                  # Assignment requirements and documentation
│   ├── A2_Complete_Documentation.md
│   ├── Assignment1-requirement.md
│   └── Assignment2-requirement.md
│
├── frontend/                    # React Frontend Application
│   ├── index.html              # Single HTML entry point
│   ├── package.json            # Node.js dependencies & scripts
│   ├── vite.config.js          # Vite build configuration
│   │
│   ├── src/                    # Source code
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main application component
│   │   │
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ProductList/    # Product listing component
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── ProductList.styles.js
│   │   │   ├── ProductCard/    # Individual product card
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   └── ProductCard.styles.js
│   │   │   ├── ShoppingCart/   # Shopping cart container
│   │   │   │   ├── ShoppingCart.jsx
│   │   │   │   └── ShoppingCart.styles.js
│   │   │   ├── CartItem/       # Individual cart item with +/- controls
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartItem.styles.js
│   │   │   ├── Header/         # Navigation header
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Header.styles.js
│   │   │   ├── Login/          # Login form component
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.styles.js
│   │   │   ├── Register/       # Registration form component
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Register.styles.js
│   │   │   ├── SearchBar/      # Real-time search bar
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── SearchBar.styles.js
│   │   │   ├── AdminDashboard/ # Admin dashboard for viewing all carts
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminDashboard.styles.js
│   │   │   ├── ProductEditPage/# Product editing page for admins
│   │   │   │   ├── ProductEditPage.jsx
│   │   │   │   └── ProductEditPage.styles.js
│   │   │   └── Modal/          # Confirmation modal and Toast
│   │   │       ├── Modal.jsx       # Confirmation dialog
│   │   │       ├── Modal.styles.js
│   │   │       ├── Toast.jsx       # Toast notification component
│   │   │       └── Toast.styles.js
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useCart.js      # Cart operations hook (uses CartContext)
│   │   │   ├── useProducts.js  # Products fetching hook
│   │   │   └── useApi.js       # Generic API calls hook
│   │   │
│   │   ├── services/           # API integration layer
│   │   │   ├── api.js          # Axios instance configuration
│   │   │   ├── productService.js # Product-related API calls
│   │   │   ├── cartService.js  # Cart-related API calls
│   │   │   ├── authService.js  # Authentication API calls
│   │   │   └── adminService.js # Admin operations API calls
│   │   │
│   │   ├── context/            # React Context providers
│   │   │   ├── CartContext.jsx # Global cart state management with optimistic updates
│   │   │   ├── ProductsContext.jsx # Global products state sharing
│   │   │   ├── AuthContext.jsx # Authentication state management
│   │   │   └── AdminContext.jsx # Admin dashboard state management
│   │   │
│   │   ├── utils/              # Helper functions
│   │   │   ├── formatters.js   # Price/date formatting
│   │   │   └── validators.js   # Input validation
│   │   │
│   │   ├── assets/             # Static resources
│   │   │   ├── styles/         # Global styles
│   │   │   │   ├── global.js   # Global styled components
│   │   │   │   └── variables.js # CSS variables (colors, spacing)
│   │   │   └── README.md       # Assets documentation
│   │   │
│   │   └── constants/          # Application constants
│   │       └── index.js        # API endpoints, config values
│   │
│   └── public/                 # Public assets
│       └── favicon.ico
│
├── backend/                     # FastAPI Backend Application
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration settings
│   ├── pyproject.toml          # Black & Flake8 configuration
│   └── .gitignore              # Python git ignore rules
│   │
│   ├── models/                 # Database models
│   │   ├── __init__.py
│   │   ├── database.py         # Database connection
│   │   ├── product.py          # Product model
│   │   ├── cart_item.py        # Cart item model
│   │   └── user.py             # User model
│   │
│   ├── schemas/                # Pydantic schemas (data validation)
│   │   ├── __init__.py
│   │   ├── product.py          # Product schemas
│   │   ├── cart_item.py        # Cart item schemas
│   │   └── user.py             # User schemas (A2)
│   │
│   ├── routers/                # API route handlers
│   │   ├── __init__.py
│   │   ├── products.py         # Product endpoints
│   │   ├── cart.py             # Cart endpoints
│   │   ├── auth.py             # Authentication endpoints
│   │   └── admin.py            # Admin endpoints
│   │
│   ├── services/               # Business logic layer
│   │   ├── __init__.py
│   │   ├── product_service.py  # Product operations
│   │   ├── cart_service.py     # Cart operations
│   │   └── auth_service.py     # Authentication service
│   │
│   └── utils/                  # Backend utilities
│       ├── __init__.py
│       ├── exceptions.py       # Custom exception handlers
│       └── session_store.py    # Session storage utility
│
└── database/                    # Database Setup Scripts
    ├── init.sql                # SQLite schema initialization (SQL method)
    ├── seed_data.sql           # Sample product data (SQL method)
    ├── init_db.py              # Database initialization script
    ├── migration_a2.sql        # A2 database migrations (users table)
    └── README.md               # Database setup instructions
```