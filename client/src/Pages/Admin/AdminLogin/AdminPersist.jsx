import {  Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";

const AdminPersist = () => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    // If admin is logged in, redirect to dashboard page
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminPersist;
