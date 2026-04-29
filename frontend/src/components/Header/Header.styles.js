import styled from 'styled-components';

export const HeaderContainer = styled.header`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const BannerWrapper = styled.div`
  position: relative;
  height: 120px;
  overflow: hidden;
`;

export const BannerSlider = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const BannerSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  opacity: ${(props) => (props.$active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.7) 0%,
    rgba(118, 75, 162, 0.7) 100%
  );
`;

export const BannerContent = styled.div`
  position: relative;
  z-index: 5;
  text-align: center;
  color: white;
`;

export const BannerText = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
`;

export const ShopName = styled.div`
  font-size: 18px;
  font-weight: 500;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

export const BannerIndicators = styled.div`
  position: absolute;
  bottom: 5px;  // Move indicators lower to avoid overlap
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
`;

export const BannerIndicator = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  background: ${(props) => (props.$active ? 'white' : 'transparent')};
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

// User bar styles for authenticated users - overlay on banner (no background)
export const UserBar = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  z-index: 10;
  pointer-events: none;  // Allow clicks to pass through to banner
`;

export const UserInfo = styled.span`
  color: white;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);  // Add subtle background to text only
  padding: 8px 12px;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  
  strong {
    margin-left: 4px;
    font-weight: 600;
  }
`;

export const AdminBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: #ff6b6b;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  pointer-events: auto;  // Enable button clicks
  
  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.45);
  }
`;
