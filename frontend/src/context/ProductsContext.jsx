import PropTypes from 'prop-types';
import { createContext, useState, useContext, useEffect } from 'react';
import { getAllProducts, searchProducts as searchProductsAPI, updateProduct as updateProductAPI } from '../services/productService';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults(null);
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchProductsAPI(query);
      setSearchResults(results);
      setError(null);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const updateProduct = async (productId, productData) => {
    try {
      const updatedProduct = await updateProductAPI(productId, productData);
      
      // Update the products list with the updated product
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? updatedProduct : p)
      );
      
      // Also update search results if they exist
      if (searchResults) {
        setSearchResults(prevResults =>
          prevResults.map(p => p.id === productId ? updatedProduct : p)
        );
      }
      
      setError(null);
      return updatedProduct;
    } catch (err) {
      console.error('Failed to update product:', err);
      setError(err.response?.data?.detail || 'Failed to update product');
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Display either search results or all products
  const displayedProducts = searchResults !== null ? searchResults : products;

  const value = {
    products,
    searchResults,
    displayedProducts,
    loading,
    error,
    searchProducts,
    clearSearch,
    refetch: fetchProducts,
    updateProduct,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

ProductsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
