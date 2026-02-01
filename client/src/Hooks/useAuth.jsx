import { useContext } from "react";
import { AuthContext } from "../Context/Auth";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;