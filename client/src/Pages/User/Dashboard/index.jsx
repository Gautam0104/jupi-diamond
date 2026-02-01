import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const UserDashboard = () => {
  return (
    <div className="flex sm:py-5 max-w-[1400px] mx-auto">
      <div className="flex flex-col flex-1 w-screen mt-5">
        <h1 className="px-6 md:px-12 font-medium text-black text-xl sm:text-2xl">My Account</h1>
        <div className="px-6 md:px-12 py-4   overflow-x-hidden z-0">
          <Outlet />
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default UserDashboard;
