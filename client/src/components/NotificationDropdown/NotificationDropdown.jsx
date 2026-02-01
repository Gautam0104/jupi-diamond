import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GoBellFill, GoDotFill } from "react-icons/go";
import { useGlobalAdminNotifications } from "../../Hooks/globalNotificationHook";
import { Link, useNavigate } from "react-router-dom";
import { deleteNotification } from "../../api/Public/publicApi";
import { toast } from "sonner";
import { format } from "date-fns";

const NotificationItem = ({ notification, markAsRead, closeDropdown }) => {
  const navigate = useNavigate(); 

     
  const handleClick = async (e) => {
    e.preventDefault();
    if (notification.status === "UNREAD") {
      await markAsRead(notification.id);
    }
    closeDropdown();
     if (!notification.referenceId) {
    toast.error('No referenceId found in notification');
    return;
  } 
  
  if(notification?.referenceType ==="ORDER"){
           navigate(`/admin/orders/order-details/${notification.referenceId}`);
  }else{
        navigate(`/admin/product/product-details/${notification.referenceId}`);
  }
      
 
  };

  return (
    <div
      className={`p-3 border-b border-gray-100 hover:bg-lime-50 bg-slate-50 `}
    >
      <div
        onClick={handleClick}
        className="flex justify-between items-start cursor-pointer"
      >
        <div className="flex-1">
          <h4 className="font-semibold text-xs lg:text-xs xl:text-sm text-gray-800">
            {notification.title}
          </h4>
          <p className="text-[10px] lg:text-[10px] xl:text-[12px] text-gray-600 mt-1">
            {notification.message}
          </p>
        </div>
        {notification.status === "UNREAD" && (
          <GoDotFill className="text-blue-500 ml-2 mt-1 flex-shrink-0" />
        )}
      </div>
      <p className="text-[10px] lg:text-[10px] xl:text-[11px] text-gray-900 font-medium mt-1 sm:mt-2">
        {format(notification.createdAt,"MMM dd, yyyy 'at' hh:mm a")}
      </p>
    </div>
  );
};

const NotificationDropdown = () => {
  const { notifications, isLoading, refreshNotifications, setNotifications } =
    useGlobalAdminNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  

  // Update unread count when notifications change
  useEffect(() => {
    const count = notifications.filter((n) => n.status === "UNREAD").length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
      );
      await deleteNotification(id);
      await refreshNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (
      !e.target.closest(".notification-dropdown-trigger") &&
      !e.target.closest(".notification-dropdown-content")
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);


  

  return (
    <div className="relative">
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50"
          onClick={closeDropdown}
        />
      )}

      <button
        onClick={toggleDropdown}
        className="notification-dropdown-trigger relative flex items-center justify-center"
      >
        <div className="w-8 h-8 md:w-6 md:h-6 xl:w-8 xl:h-8 z-50 flex items-center justify-center cp bg-Lime rounded-full relative">
          <GoBellFill
            className={`${
              isOpen ? "rotate-12" : "group-hover:rotate-12 "
            } text-black size-5 md:size-4 xl:size-5`}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="notification-dropdown-content fixed md:absolute right-4 md:-right-14 lg:right-0 mt-2 w-72 md:w-96 lg:w-80 xl:w-96 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-3 border-b bg-Lime rounded-md border-gray-200">
            <h3 className="font-semibold text-black">Notifications</h3>
            {notifications.length > 0 && (
              <p className="text-[10px] sm:text-xs text-gray-500">
                {notifications.length} unread notification
                {notifications.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div
            className="max-h-80 cp overflow-y-auto scrollbarWidthThinAdmin"
            key={`notifications-list-${notifications.length}`}
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  markAsRead={markAsRead}
                  closeDropdown={closeDropdown}

                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
