import { createContext, useCallback, useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { checkAdminSession } from "../api/Admin/AuthApi";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [name, setName] = useState("Anonymous");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [notification, setNotification] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const checkSessionAuth = async () => {
    setLoading(true);

    const checkCustomer = axiosPrivate
      .get("/auth/customer/check/session")
      .then((res) => {
        if (res.status === 200 && res.data.data?.user) {
          const userData = res.data.data.user;
          setUser(userData);
          setName(userData.firstName);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.log("Customer session check failed", err.message);
        setUser(null);
      });

    const checkAdmin = checkAdminSession()
      .then((res) => {
        if (res.status === 200) {
          const adminData = res.data.data.admin;
          setIsAdmin(adminData);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.log("Admin session check failed", err.message);
        setIsAdmin(null);
      });

    await Promise.allSettled([checkCustomer, checkAdmin]);

    setLoading(false);
  };

  const addToRecentlyViewed = useCallback(
    (product) => {
      setRecentlyViewed((prev) => {
        const updated = prev.filter((p) => p.id !== product.id);
        return [product, ...updated].slice(0, 4);
      });
    },
    [setRecentlyViewed]
  );

  useEffect(() => {
    checkSessionAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        name,
        navbar,
        loading,
        notification,
        isAuthenticated,
        sendNotification,
        recentlyViewed,
        addToRecentlyViewed,
        setUser,
        setIsAdmin,
        setNavbar,
        setNotification,
        setIsAuthenticated,
        setSendNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
