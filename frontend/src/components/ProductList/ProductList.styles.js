import styled from 'styled-components';

export const Container = styled.div`
  padding: 0;
`;

export const ProductGrid = styled.div`
  display: grid;
  gap: 24px;

  /* Default: 1 column (extra small screens) */
  grid-template-columns: repeat(1, 1fr);

  /* ≥800px: 2 columns */
  @media (min-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* ≥1300px: 3 columns */
  @media (min-width: 1300px) {
    gap: 28px;
    grid-template-columns: repeat(3, 1fr);
  }

  /* ≥1700px: 4 columns */
  @media (min-width: 1700px) {
    grid-template-columns: repeat(4, 1fr);
  }

  /* ≥1920px: Adjust spacing */
  @media (min-width: 1920px) {
    gap: 32px;
  }

  /* ≥2200px: Larger spacing */
  @media (min-width: 2200px) {
    gap: 40px;
  }
`;

export const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 20px;
  text-align: center;
`;

export const LoadingMessage = styled.div`
  color: #666;
  padding: 40px;
  text-align: center;
  font-size: 16px;
`;

export const EmptyMessage = styled.div`
  color: #666;
  padding: 40px;
  text-align: center;
  font-size: 16px;
`;
