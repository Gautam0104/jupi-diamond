import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import { toast } from "sonner";
import { AdminLogout } from "../api/User/AuthApi";

const adminLogout = () => {
  const { setIsAdmin } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const logout = async () => {
    try {
      const res = await AdminLogout();

      toast.success("Logout successful!", {
        description: "You have been logged out.",
      });

      setIsAdmin(null);
      navigate("/admin/login");
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default adminLogout;
