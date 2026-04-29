import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import { GlobalStyles } from './assets/styles/global.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <AdminProvider>
            <GlobalStyles />
            <App />
          </AdminProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  </React.StrictMode>
);
