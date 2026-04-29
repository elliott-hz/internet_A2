import { memo } from 'react';
import { useCartOperations } from '../../hooks/useCart';
import SearchBar from '../SearchBar/SearchBar';
import ProductCard from '../ProductCard/ProductCard';
import * as S from './ProductList.styles';

const ProductList = () => {
  const { displayedProducts, loading, error } = useCartOperations();

  if (loading) {
    return <S.Container><SearchBar /><S.LoadingMessage>Loading products...</S.LoadingMessage></S.Container>;
  }

  if (error) {
    return <S.Container><SearchBar /><S.ErrorMessage>{error}</S.ErrorMessage></S.Container>;
  }

  if (!displayedProducts || displayedProducts.length === 0) {
    return (
      <S.Container>
        <SearchBar />
        <S.EmptyMessage>No products found</S.EmptyMessage>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <SearchBar />
      <S.ProductGrid>
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </S.ProductGrid>
    </S.Container>
  );
};

export default memo(ProductList);
