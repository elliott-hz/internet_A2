import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import ProductList from './components/ProductList/ProductList';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import Login from './components/Login/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import ProductEditPage from './components/ProductEditPage/ProductEditPage';
import ChangePassword from './components/ChangePassword/ChangePassword';
import styled from 'styled-components';

const MainContainer = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 30px 30px 0 30px;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  /* ≥900px: item and cart in the same row */
  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 350px);
  }

  /* ≥1200px: adjust spacing */
  @media (min-width: 1200px) {
    gap: 40px;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 380px);
  }

  /* ≥1600px: cart wider */
  @media (min-width: 1600px) {
    grid-template-columns: minmax(0, 1fr) minmax(350px, 400px);
  }
`;

// Main content component with auth check
function AppContent() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <MainContainer>
        <div>Loading...</div>
      </MainContainer>
    );
  }

  // Show ChangePassword page if on that route
  if (location.pathname === '/change-password') {
    return (
      <MainContainer>
        <ChangePassword />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <ContentWrapper>
        <ProductList />
        {/* Show different components based on auth status and role */}
        {isAuthenticated ? (
          isAdmin ? (
            <AdminDashboard />  // Admin sees dashboard instead of personal cart
          ) : (
            <ShoppingCart />    // Regular users see their cart
          )
        ) : (
          <Login />
        )}
      </ContentWrapper>
    </MainContainer>
  );
}

// Admin view with toggle between dashboard and product list
function AdminView({ showProductList, onToggleView }) {
  return (
    <MainContainer>
      {showProductList ? (
        <ProductList />
      ) : (
        <AdminDashboard />
      )}
    </MainContainer>
  );
}

// Router wrapper component to provide navigation context
function AppWithRouter() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [showProductList, setShowProductList] = useState(false);

  const handleNavigation = (page) => {
    if (page === 'change-password') {
      navigate('/change-password');
    }
  };

  const handleToggleAdminView = () => {
    setShowProductList(!showProductList);
  };

  return (
    <>
      <Header 
        onNavigate={handleNavigation} 
        onToggleAdminView={isAdmin ? handleToggleAdminView : undefined}
        showProductList={isAdmin ? showProductList : undefined}
      />
      <Routes>
        <Route path="/" element={
          isAdmin && isAuthenticated ? (
            <AdminView showProductList={showProductList} onToggleView={handleToggleAdminView} />
          ) : (
            <AppContent />
          )
        } />
        <Route path="/product/:id/edit" element={<ProductEditPage />} />
        <Route path="/change-password" element={<AppContent />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

export default App;
