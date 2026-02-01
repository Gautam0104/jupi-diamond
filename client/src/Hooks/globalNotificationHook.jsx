import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { fetchGlobalNotifications } from "../api/Public/publicApi";
const audio = new Audio("/Sound/happy-pop.mp3");

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export function useGlobalAdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetchGlobalNotifications();    

      setNotifications(res.data?.data ?? []);
    } catch (err) {
      console.log("Failed to fetch notifications:", err);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      await refreshNotifications();
    };

    fetchNotifications();

    socket.on("admin-notification", (data) => {
      toast.warning(`${data.title}: ${data.message}`);
      setNotifications(prev => [data, ...(Array.isArray(prev) ? prev : [])]);

      audio.play().catch((error) => {
        console.warn("Audio playback failed:", error);
      });
    });

    return () => {
      socket.off("admin-notification");
    };
  }, []);

  return { notifications, isLoading, refreshNotifications,setNotifications };
}