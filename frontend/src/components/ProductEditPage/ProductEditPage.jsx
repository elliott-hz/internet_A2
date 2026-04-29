import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useAuth } from '../../context/AuthContext';
import * as S from './ProductEditPage.styles';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, updateProduct, loading, error } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    is_available: true
  });
  
  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load product data
  useEffect(() => {
    if (products && id) {
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock_quantity: product.stock_quantity?.toString() || '',
          is_available: product.is_available ?? true
        });
      }
    }
  }, [products, id]);

  // Check if user is admin
  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear validation error when user types
    if (validationError) setValidationError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('Product name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setValidationError('Price must be greater than 0');
      return false;
    }
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      setValidationError('Stock quantity cannot be negative');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setValidationError('');

    try {
      await updateProduct(parseInt(id), {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        is_available: formData.is_available
      });
      
      // Success - navigate back to product list
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to update product';
      setValidationError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!user?.is_admin) {
    return <S.AccessDenied>Admin access required</S.AccessDenied>;
  }

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={handleCancel}>
          ← Back to Product List
        </S.BackButton>
        <h2>Edit Product #{id}</h2>
      </S.Header>

      <S.Form>
        {validationError && (
          <S.ErrorMessage>{validationError}</S.ErrorMessage>
        )}

        <S.FormGroup>
          <S.Label htmlFor="name">Product Name *</S.Label>
          <S.Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="description">Description</S.Label>
          <S.TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="4"
          />
        </S.FormGroup>

        <S.FormRow>
          <S.FormGroup>
            <S.Label htmlFor="price">Price ($) *</S.Label>
            <S.Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label htmlFor="stock_quantity">Stock Quantity *</S.Label>
            <S.Input
              type="number"
              id="stock_quantity"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              required
            />
          </S.FormGroup>
        </S.FormRow>

        <S.FormGroup>
          <S.CheckboxLabel>
            <S.Checkbox
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleInputChange}
            />
            <span>Product is available for purchase</span>
          </S.CheckboxLabel>
        </S.FormGroup>

        <S.ButtonGroup>
          <S.CancelButton onClick={handleCancel} disabled={isSaving}>
            Cancel
          </S.CancelButton>
          <S.SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </S.SaveButton>
        </S.ButtonGroup>
      </S.Form>
    </S.Container>
  );
};

export default ProductEditPage;
