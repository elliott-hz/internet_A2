import { createContext, useState, useContext } from 'react';
import adminService from '../services/adminService';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [userCarts, setUserCarts] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllUserCarts = async () => {
    setLoading(true);
    setError(null);
    
    const result = await adminService.getAllUserCarts();
    
    if (result.success) {
      setUserCarts(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    
    const result = await adminService.getAllUsers();
    
    if (result.success) {
      setAllUsers(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const value = {
    userCarts,
    allUsers,
    loading,
    error,
    fetchAllUserCarts,
    fetchAllUsers,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
