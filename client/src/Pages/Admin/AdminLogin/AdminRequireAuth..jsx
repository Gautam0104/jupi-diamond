import { useLocation, Outlet, Navigate } from "react-router-dom";
import { PersistLoader } from "../../../components/common/PersistLoader/PersistLoader";
import useAuth from "../../../Hooks/useAuth";

const AdminRequireAuth = () => {
  const { isAdmin } = useAuth();

  const location = useLocation();

  if (!isAdmin) {
    return (
      <PersistLoader path={"/admin/login"} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default AdminRequireAuth;
