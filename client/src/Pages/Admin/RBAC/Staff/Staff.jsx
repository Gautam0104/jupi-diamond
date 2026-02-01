import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Label } from "../../../../components/ui/label";
import DataLoading from "../../../../components/Loaders/DataLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { FiSearch, FiTrash2, FiX, FiImage, FiEdit } from "react-icons/fi";
import { Switch } from "../../../../components/ui/switch";
import { Input } from "../../../../components/ui/input";
import PaginationComponent from "../../../../components/PaginationComponent/PaginationComponent";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  adminRegister,
  fetchStaff,
  fetchStaffById,
  toggleStatus,
  updateAdminStaff,
} from "../../../../api/Admin/AuthApi";
import useFiltration from "../../../../Hooks/useFilteration";
import { getAllRoles } from "../../../../api/Admin/RoleApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllPermissions } from "../../../../api/Admin/PermissionApi";

const Staff = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();
  const [showPassword, setShowPassword] = useState(false);
  const [pagination, setPagination] = useState({});
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchStaff({
        search: debouncedSearch,
        page: page,
      });
      setStaff(response.data.data.staff);

      const res = await getAllRoles();
      setRoles(res.data);

      const per = await getAllPermissions();
      setPermissions(per.data);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page]);

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  // Handle edit staff member
  const handleEdit = async (id) => {
    setCurrentEditId(id);
    setIsEditMode(true);
    try {
      const response = await fetchStaffById(id);
      const staffData = response.data.data;

      // Set form values
      formik.setValues({
        name: staffData.name,
        email: staffData.email,
        password: "", // Password is optional in edit mode
        roleId: staffData.role?.id || "",
      });

      // Set selected permissions
      const initialPermissions = staffData.extraPermissions.map((p) => p.id);
      setSelectedPermissions(initialPermissions);

      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast.error("Failed to fetch staff details");
    }
  };

  // Handle permission selection
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      roleId: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .when("$isEditMode", (isEditMode, schema) => {
          return isEditMode ? schema : schema.required("Password is required");
        }),
      roleId: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let response;

        if (isEditMode) {
          // Prepare data for update
          const updateData = {
            id: currentEditId,
            name: values.name,
            email: values.email,
            roleId: values.roleId,
            extraPermissions: selectedPermissions,
            ...(values.password && { password: values.password }), // Only include password if provided
          };

          response = await updateAdminStaff(updateData);

          if (response.status === 200) {
            toast.success("Staff member updated successfully");
            fetchData();
          }
        } else {
          response = await adminRegister(values);

          if (response.status === 201) {
            toast.success("Staff member created successfully");
            fetchData();
          }
        }

        if (response.status === 201) {
          formik.resetForm();
          setIsDialogOpen(false);
          setIsEditMode(false);
          setCurrentEditId(null);
          setSelectedPermissions([]);
          fetchData();
        } else {
          toast.error(response.data.message || "Operation failed");
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(error.response?.data?.message || "Operation failed");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await toggleStatus(id);

      toast.success(res.data.data.message || "Staff Status Updated !!");
      setStaff((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    } catch (error) {
      console.log("Toggle failed:", error);
      toast.error("Failed to update status");
    } finally {
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">RBAC</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-md font-semibold">Staff</p>
          <div className="flex items-center gap-2">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  setIsDialogOpen(false);
                  setIsEditMode(false);
                  setCurrentEditId(null);
                  formik.resetForm();
                  setSelectedPermissions([]);
                } else {
                  setIsDialogOpen(true);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="addButton truncate">Create Staff</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit Staff Member" : "Add New Member"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the staff member details below."
                      : "Fill in the details to register a new member."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                          className={
                            formik.touched.name && formik.errors.name
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <div className="text-red-500 text-xs mt-1">
                            {formik.errors.name}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          disabled={isEditMode}
                          className={
                            formik.touched.email && formik.errors.email
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <div className="text-red-500 text-xs mt-1">
                            {formik.errors.email}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <div className="col-span-3">
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder={
                              isEditMode ? "Leave blank to keep unchanged" : ""
                            }
                            className={
                              formik.touched.password && formik.errors.password
                                ? "border-red-500 pr-10"
                                : "pr-10"
                            }
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <FaEyeSlash className="w-5 h-5" />
                            ) : (
                              <FaEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                          <div className="text-red-500 text-xs mt-1">
                            {formik.errors.password}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="roleId" className="text-right">
                        Role
                      </Label>
                      <div className="col-span-3">
                        <select
                          id="roleId"
                          name="roleId"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.roleId}
                          className={`w-full p-2 border text-xs sm:text-sm rounded-md capitalize ${
                            formik.touched.roleId && formik.errors.roleId
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select a role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        {formik.touched.roleId && formik.errors.roleId ? (
                          <div className="text-red-500 text-xs mt-1">
                            {formik.errors.roleId}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {isEditMode && (
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Permissions</Label>
                        <div className="col-span-3">
                          <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
                            {permissions.length > 0 ? (
                              permissions.map((permission) => (
                                <div
                                  key={permission.id}
                                  className="flex items-center mb-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={`perm-${permission.id}`}
                                    checked={selectedPermissions.includes(
                                      permission.id
                                    )}
                                    onChange={() =>
                                      handlePermissionChange(permission.id)
                                    }
                                    className="mr-2"
                                  />
                                  <label htmlFor={`perm-${permission.id}`}>
                                    {permission.label}
                                  </label>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">
                                No permissions available
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setIsEditMode(false);
                        setCurrentEditId(null);
                        formik.resetForm();
                        setSelectedPermissions([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : isEditMode
                        ? "Update Staff"
                        : "Create Staff"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="relative flex items-center w-full max-w-[250px]">
              <div className="absolute left-3 text-gray-400">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChangeHook}
                placeholder="Search ..."
                autoComplete="off"
                className="w-full py-2 pl-10 text-sm pr-10 text-gray-700 bg-white shadow-md rounded-full focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
              />
              {filters.search && (
                <button
                  onClick={clearFilters}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Name",
                  "Email",
                  "Role",
                  "Permissions",
                  "Created At",
                  "Status",
                  "Action",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="whitespace-nowrap text-center"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : staff?.length > 0 ? (
                staff.map((item, index) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px] text-left px-6">
                      {item.name}
                    </TableCell>
                    <TableCell className="min-w-[80px] max-w-[220px] text-left">
                      {item.email}
                    </TableCell>
                    <TableCell className="min-w-[80px] capitalize">
                      {item.role?.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {item.extraPermissions.length === 0 ? (
                          <span className="text-gray-500">No permissions</span>
                        ) : (
                          item.extraPermissions.map((perm, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {perm.label}
                            </span>
                          ))
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[140px]">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    <TableCell className="min-w-[80px]">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() =>
                          handleToggleStatus(item.id, item.isActive)
                        }
                        disabled={togglingIds[item.id]}
                      />
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          className="text-xs md:text-sm px-6"
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">
                        No staff members found
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-2 md:p-4 border-t">
          <PaginationComponent
            currentPage={Number(pagination.currentPage || filters.page)}
            totalPages={Number(pagination.totalPages)}
            onPageChange={handlePageChange}
            pageSize={Number(filters.pageSize)}
          />
        </div>
      </div>
    </div>
  );
};

export default Staff;
