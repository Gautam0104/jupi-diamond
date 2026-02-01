import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-96 px-6 py-4 mt-2 border-r hidden md:block">
      <ul className="space-y-2">
        <li className=" pb-2">
          <Link
            to="/user/profile"
            className={`text-sm  block py-2 ${
              isActive("/user/profile")
                ? "font-medium text-black border-b-2 border-black pb-1"
                : "text-gray-400  border-b-2 hover:text-black"
            }`}
          >
            My Profile
          </Link>
        </li>
        <li className=" pb-2">
          <Link
            to="/user/address-book"
            className={`text-sm block py-2 ${
              isActive("/user/address-book")
                ? "font-medium text-black border-b-2 border-black pb-1"
                : "text-gray-400  border-b-2 hover:text-black"
            }`}
          >
            Address Book
          </Link>
        </li>
        <li className=" pb-2">
          <Link
            to="/user/order-history"
            className={`text-sm block py-2 ${
              isActive("/user/order-history")
                ? "font-medium text-black border-b-2 border-black pb-1"
                : "text-gray-400  border-b-2 hover:text-black"
            }`}
          >
            Order History
          </Link>
        </li>
        <li className=" pb-2">
          <Link
            to="/user/my-gifts"
            className={`text-sm block py-2 ${
              isActive("/user/my-gifts")
                ? "font-medium text-black border-b-2 border-black pb-1"
                : "text-gray-400  border-b-2 hover:text-black"
            }`}
          >
            My Gifts
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;