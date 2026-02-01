// src/components/common/LoggedInRedirect/LoggedInRedirect.js
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { PersistLoader } from '../../../components/common/PersistLoader/PersistLoader';
import useAuth from '../../../Hooks/useAuth';

const LoggedInRedirect = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user && user?.role === 'CUSTOMER') {
    // If user is logged in, redirect to home page
    return  <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default LoggedInRedirect;