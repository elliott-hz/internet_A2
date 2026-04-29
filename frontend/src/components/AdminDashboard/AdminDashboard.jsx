import { useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import * as S from './AdminDashboard.styles';

const AdminDashboard = () => {
  const { userCarts, loading, error, fetchAllUserCarts } = useAdmin();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.is_admin) {
      fetchAllUserCarts();
    }
  }, [user]);

  if (!user?.is_admin) {
    return <S.AccessDenied>Admin access required</S.AccessDenied>;
  }

  if (loading) {
    return <S.Loading>Loading admin dashboard...</S.Loading>;
  }

  if (error) {
    return <S.Error>{error}</S.Error>;
  }

  if (!userCarts || userCarts.total_users_with_carts === 0) {
    return <S.Empty>No active shopping carts</S.Empty>;
  }

  return (
    <S.Container>
      <S.Header>
        <h2>Admin Dashboard - All User Carts</h2>
        <S.Stats>
          <div>Users with Carts: {userCarts.total_users_with_carts}</div>
          <div>Total Items: {userCarts.total_cart_items}</div>
          <div>Grand Total: ${userCarts.grand_total_value.toFixed(2)}</div>
        </S.Stats>
      </S.Header>

      <S.UserCartsList>
        {userCarts.user_carts.map((userCart) => (
          <S.UserCartCard key={userCart.user_id}>
            <S.UserHeader>
              <h3>{userCart.username}</h3>
              <span>{userCart.email}</span>
              <S.CartSummary>
                Items: {userCart.cart_items_count} | 
                Total: ${userCart.total_value.toFixed(2)}
              </S.CartSummary>
            </S.UserHeader>
            
            <S.ItemsList>
              {userCart.items.map((item) => (
                <S.CartItem key={item.cart_item_id}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.product_name} />
                  )}
                  <S.ItemDetails>
                    <div className="name">{item.product_name}</div>
                    <div className="quantity">Qty: {item.quantity}</div>
                    <div className="price">${item.price.toFixed(2)} each</div>
                    <div className="subtotal">Subtotal: ${item.subtotal.toFixed(2)}</div>
                  </S.ItemDetails>
                </S.CartItem>
              ))}
            </S.ItemsList>
          </S.UserCartCard>
        ))}
      </S.UserCartsList>
    </S.Container>
  );
};

export default AdminDashboard;
