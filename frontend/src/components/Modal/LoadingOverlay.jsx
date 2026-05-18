import PropTypes from 'prop-types';
import * as S from './LoadingOverlay.styles';

const LoadingOverlay = ({ isVisible, message = 'Processing...' }) => {
  if (!isVisible) return null;

  return (
    <S.Overlay>
      <S.LoadingContainer>
        <S.Spinner />
        <S.Message>{message}</S.Message>
      </S.LoadingContainer>
    </S.Overlay>
  );
};

LoadingOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  message: PropTypes.string,
};

export default LoadingOverlay;
