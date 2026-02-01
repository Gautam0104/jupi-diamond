import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import { toast } from "sonner";
import { UserLogout } from "../api/User/AuthApi";

const userLogout = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();

  const logout = async () => {
    try {
      const res = await UserLogout();

      toast.success("Logout successful!", {
        description: "You have been logged out.",
      });

      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default userLogout;
