import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../../Hooks/useAuth";
import { fetchStaffById } from "../../../api/Admin/AuthApi";
import { toast } from "sonner";
import { MailIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { gsap } from "gsap";
import { FaRegUser } from "react-icons/fa6";
import { LuCalendarDays } from "react-icons/lu";

const AdminProfile = () => {
  const { isAdmin } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);
  const avatarRef = useRef(null);
  const contentRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchStaffById(isAdmin.id);
      setAdmin(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && admin) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(
        avatarRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [loading, admin]);

  if (loading || !admin) {
    return (
      <div className="container mx-auto  bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className=" mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[220px]" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-7 w-28 rounded-full" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto  bg-[#F1F7FA] to-gray-100 ">
      <div className=" mx-auto pt-10">
        <Card ref={cardRef} className="relative  bg-white/90 backdrop-blur-sm">
          <CardHeader className="pt-8">
            <Avatar
              ref={avatarRef}
              className="absolute -top-10 h-20 w-20 border-4 border-white shadow-md"
            >
              <AvatarFallback className="bg-Lime text-lime-800 text-xl font-semibold">
                {admin.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {admin.name}
                </CardTitle>
                <CardDescription className="flex items-center text-gray-600 mt-1">
                  <MailIcon className="h-5 w-5 mr-2" />
                  {admin.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent ref={contentRef} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FaRegUser className="h-5 w-5 mr-2" />
                  Role
                </div>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {admin.role.name}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <LuCalendarDays className="h-5 w-5 mr-2" />
                  Joined On
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {format(new Date(admin.createdAt), "MMMM d, yyyy")}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  Status
                </div>
                <div className="text-sm font-medium">
                  {admin.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 transition-colors">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
              
            </div>
            {admin.extraPermissions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 font-semibold">
                  Extra Permissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {admin.extraPermissions.map((permission) => (
                    <Badge
                      key={permission.id}
                      className="bg-emerald-100 text-emerald-800 hover:bg-indigo-200 transition-colors"
                    >
                      {permission.label} ({permission.module})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
