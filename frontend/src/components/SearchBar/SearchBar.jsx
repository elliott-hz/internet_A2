import { useState, useCallback } from 'react';
import { debounce } from 'lodash-es';
import { useProducts } from '../../context/ProductsContext';
import * as S from './SearchBar.styles';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchProducts, clearSearch } = useProducts();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query || query.trim().length === 0) {
        clearSearch();
        return;
      }
      
      searchProducts(query);
    }, 300),
    [searchProducts, clearSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    clearSearch();
  };

  return (
    <S.SearchContainer>
      <S.SearchInput
        type="text"
        placeholder="🔍 Search products by name or description..."
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <S.ClearButton onClick={handleClear} title="Clear search">
          ×
        </S.ClearButton>
      )}
    </S.SearchContainer>
  );
};

export default SearchBar;
