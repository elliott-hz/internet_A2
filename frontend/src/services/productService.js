import api from './api';

/**
 * Product Service
 * Handles all product-related API calls including search
 */

// Fetch all products
export const getAllProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Search products by query
export const searchProducts = async (query) => {
  const response = await api.get('/products/search', {
    params: { query }
  });
  return response.data;
};

// Fetch single product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Create new product (admin function - placeholder)
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Update product (admin function - placeholder)
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product (admin function - placeholder)
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
