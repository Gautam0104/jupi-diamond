import { useLocation, Outlet, Navigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import { PersistLoader } from "../../../components/common/PersistLoader/PersistLoader";

const UserRequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PersistLoader />; 
  }

  if (!user || user.role !== "CUSTOMER") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default UserRequireAuth;
