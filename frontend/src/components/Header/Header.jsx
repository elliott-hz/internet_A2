import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as S from './Header.styles';

// Professional commercial banner images (Lorem Picsum - stable placeholder service)
const BANNER_IMAGES = [
  {
    url: 'https://picsum.photos/seed/shopping1/1600/400',
    alt: 'Shopping mall',
    text: 'Premium Quality Products',
  },
  {
    url: 'https://picsum.photos/seed/shopping2/1600/400',
    alt: 'Fashion store',
    text: 'Exclusive Deals & Offers',
  },
  {
    url: 'https://picsum.photos/seed/shopping3/1600/400',
    alt: 'E-commerce',
    text: 'Fast & Free Shipping',
  },
  {
    url: 'https://picsum.photos/seed/shopping4/1600/400',
    alt: 'Products showcase',
    text: 'New Arrivals Every Week',
  },
];

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <S.HeaderContainer>
      <S.BannerWrapper>
        <S.BannerSlider>
          {BANNER_IMAGES.map((image, index) => (
            <S.BannerSlide
              key={index}
              $active={index === currentSlide}
              $backgroundImage={image.url}
            >
              <S.BannerOverlay />
              <S.BannerContent>
                <S.BannerText>{image.text}</S.BannerText>
                <S.ShopName>Internet A2 Shop</S.ShopName>
              </S.BannerContent>
            </S.BannerSlide>
          ))}
        </S.BannerSlider>

        <S.BannerIndicators>
          {BANNER_IMAGES.map((_, index) => (
            <S.BannerIndicator
              key={index}
              $active={index === currentSlide}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </S.BannerIndicators>

        {/* User Info and Logout Button - Overlay on banner */}
        {isAuthenticated && (
          <S.UserBar>
            <S.UserInfo>
              Welcome, <strong>{user?.username}</strong>
              {isAdmin && <S.AdminBadge>ADMIN</S.AdminBadge>}
            </S.UserInfo>
            <S.LogoutButton onClick={logout}>
              Logout
            </S.LogoutButton>
          </S.UserBar>
        )}
      </S.BannerWrapper>
    </S.HeaderContainer>
  );
};

export default Header;
