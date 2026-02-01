import React from "react";
import { Button } from "../../../../components/ui/button";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import {
  assignPermissionsToRole,
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../../../../api/Admin/RoleApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { getAllPermissions } from "../../../../api/Admin/PermissionApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Skeleton } from "../../../../components/ui/skeleton";

const Role = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [createRoleDialogOpen, setCreateRoleDialogOpen] = useState(false);
  const [assignPermissionDialogOpen, setAssignPermissionDialogOpen] =
    useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedPermissionDetails, setSelectedPermissionDetails] = useState(
    []
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      setRoles(response.data);

      const res = await getAllPermissions();
      setPermissions(res.data);
      console.log("Fetched permissions:", res.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const roleValidationSchema = Yup.object().shape({
    name: Yup.string().required("Role name is required"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: roleValidationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          await handleUpdateRole();
        } else {
          const response = await createRole(values);
          if (response.status === 201) {
            toast.success("Role created successfully");
            setSelectedRoleId(response.data.id);
            setCurrentStep(2);
          } else {
            toast.error(response.data.message || "Failed to create role");
          }
        }
      } catch (error) {
        console.log("Create role error:", error);
        toast.error(error.response?.data?.message || "Failed to create role");
      }
    },
  });

  const handlePermissionToggle = (permissionId) => {
    const permission = permissions.find((p) => p.id === permissionId);

    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );

    setSelectedPermissionDetails((prev) => {
      if (prev.some((p) => p.id === permissionId)) {
        return prev.filter((p) => p.id !== permissionId);
      } else {
        return [
          ...prev,
          {
            id: permissionId,
            label: permission?.label,
            module: permission?.module,
          },
        ];
      }
    });
  };

  const handleAssignPermissions = async () => {
    if (!selectedRoleId) {
      toast.error("Please select a role");
      return;
    }

    try {
      // If in edit mode and no permissions were explicitly selected/changed,
      // don't make the API call to avoid removing all permissions
      if (isEditMode && selectedPermissions.length === 0) {
        setCreateRoleDialogOpen(false);
        setCurrentStep(1);
        formik.resetForm();
        setIsEditMode(false);
        return;
      }
      console.log("Assigning permissions:", {
        roleId: selectedRoleId,
        permissionIds: selectedPermissions,
      });

      const response = await assignPermissionsToRole(
        selectedRoleId,
        selectedPermissions
      );

      if (!response || !response.data) {
        return;
      }

      if (response.data.success) {
        toast.success("Permissions updated successfully");
        setCreateRoleDialogOpen(false);
        setCurrentStep(1);
        formik.resetForm();
        setSelectedPermissions([]);
        setSelectedPermissionDetails([]);
        setIsEditMode(false);
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to update permissions");
      }
    } catch (error) {
      console.log("Assign permissions error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update permissions"
      );
    }
  };

  const handleEditRole = async (roleId) => {
    try {
      const response = await getRoleById(roleId);
      console.log("Fetched role data:", response.data);

      if (response.status === 200) {
        formik.setValues({
          name: response.data.name,
          description: response.data.description,
        });
        setSelectedRoleId(roleId);

        const rolePermissions = response.data.permissions;
        setSelectedPermissions(rolePermissions.map((p) => p.permissionId));
        setSelectedPermissionDetails(
          rolePermissions.map((p) => ({
            id: p.permissionId,
            label: p.permission?.label,
            module: p.permission?.module,
          }))
        );
        console.log("Selected permissions:", selectedPermissions);

        setIsEditMode(true);
        setCreateRoleDialogOpen(true);
      }
    } catch (error) {
      console.log("Fetch role error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch role");
    }
  };

  const handleUpdateRole = async () => {
    try {
      const response = await updateRole({
        id: selectedRoleId,
        ...formik.values,
      });
      if (response.status === 200) {
        toast.success("Role updated successfully");
        setCurrentStep(2);
      } else {
        toast.error(response.data.message || "Failed to update role");
      }
    } catch (error) {
      console.log("Update role error:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteClick = (id) => {
    setRoleToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      await handleDelete(roleToDelete);
      setDeleteConfirmOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteRole(id);
      if (response.status === 200) {
        toast.success("Role deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete Role");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Role");
    }
  };

  const ExpandableDescription = ({ description, maxLength = 70 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const needsTruncation = description?.length > maxLength;
    const truncatedText = needsTruncation
      ? description.substring(0, maxLength) + "..."
      : description;

    return (
      <p className="text-sm text-gray-500">
        <span className="font-medium text-black block">Description</span>
        {isExpanded || !needsTruncation ? description : truncatedText}
        {needsTruncation && (
          <span
            className="text-gray-500 underline text-xs cursor-pointer ml-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "See less" : "See more"}
          </span>
        )}
      </p>
    );
  };

  const getPermissionLabel = (id) => {
    const permission = permissions.find((p) => p.id === id);
    return permission ? `${permission.label} (${permission.module})` : id;
  };

  return (
    <>
      <div className="w-full poppins">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-4">RBAC</h2>
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="text-md font-semibold ">Roles</p>
            <div className="flex items-center gap-2">
              <Button
                className="addButton bg-Lime text-black"
                onClick={() => {
                  setCreateRoleDialogOpen(true);
                  setCurrentStep(1);
                  formik.resetForm();
                  setSelectedPermissions([]);
                  setIsEditMode(false);
                }}
              >
                <FiPlus />
                Add Roles
              </Button>
            </div>
          </div>
        </div>

        <div
          className="grid gap-4 bg-[#f0f6f9]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {" "}
          {loading ? (
            <>
              <div className="cardBG rounded-3xl shadow-md p-5 w-full relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-sm border border-[#979797]" />
                  <Skeleton className="h-8 w-8 rounded-sm border border-[#979797]" />
                </div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <div className="mb-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-1/4 mb-1" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="cardBG rounded-3xl shadow-md p-5 w-full relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-sm border border-[#979797]" />
                  <Skeleton className="h-8 w-8 rounded-sm border border-[#979797]" />
                </div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <div className="mb-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-1/4 mb-1" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="cardBG rounded-3xl shadow-md p-5 w-full relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-sm border border-[#979797]" />
                  <Skeleton className="h-8 w-8 rounded-sm border border-[#979797]" />
                </div>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <div className="mb-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
                <div>
                  <Skeleton className="h-4 w-1/4 mb-1" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            </>
          ) : roles.length > 0 ? (
            roles.map((role, index) => (
              <div
                key={index}
                className="cardBG rounded-3xl shadow-md p-5 w-full relative"
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    variant={"edit"}
                    className="p-1 border border-[#979797]"
                    onClick={() => handleEditRole(role.id)}
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    variant="edit"
                    className="text-[10px] md:text-sm px-2 rounded-sm hover:shadow-xl border border-[#979797]"
                    onClick={() => handleDeleteClick(role.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>

                <h2 className="text-lg font-semibold mb-2 capitalize truncate text-wrap">
                  {role.name}
                </h2>

                <div className="mb-3">
                  <ExpandableDescription description={role.description} />
                </div>

                <div>
                  <span className="font-medium text-black text-sm block mb-1">
                    Permissions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.length > 0 ? (
                      role.permissions.map((perm, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white px-3 py-1 rounded-full drop-shadow-md"
                        >
                          {perm.permission?.label}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs bg-white px-3 py-1 rounded-full drop-shadow-md">
                        No permissions assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-2xl py-10 text-gray-500">
              No data available
            </div>
          )}
        </div>

        <Dialog
          open={createRoleDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setCreateRoleDialogOpen(false);
              setCurrentStep(1);
              formik.resetForm();
              setSelectedPermissions([]);
              setIsEditMode(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            {currentStep === 1 ? (
              <>
                <DialogHeader>
                  <div className="flex items-center text-sm justify-center mb-4">
                    <div className="text-black font-semibold">
                      {isEditMode ? "Update Role" : "Create Role"}
                    </div>
                    <div className="mx-4 w-8 sm:w-16 border-t border-gray-300"></div>
                    <div className="text-gray-400">Assign Permissions</div>
                  </div>
                  <DialogTitle>
                    {isEditMode ? "Update Role" : "Create Role"}
                  </DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={formik.handleSubmit}
                  autoComplete="off"
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Role Name"
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-md InputShadow focus:outline-none"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-xs mt-1">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <textarea
                      name="description"
                      placeholder="Description..."
                      rows={4}
                      className="w-full px-4 py-3 text-xs sm:text-sm rounded-md InputShadow focus:outline-none resize-none"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCreateRoleDialogOpen(false);
                        formik.resetForm();
                        setIsEditMode(false);
                      }}
                      className={'text-xs sm:text-sm'}
                    >
                      Discard
                    </Button>
                    <Button className={'text-xs sm:text-sm'} type="submit">
                      {isEditMode ? "Update Role" : "Create Role"}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-gray-400">
                      {isEditMode ? "Update Role" : "Create Role"}
                    </div>
                    <div className="mx-4 w-8 sm:w-16 border-t border-gray-300"></div>
                    <div className="text-black font-semibold">
                      Assign Permissions
                    </div>
                  </div>
                  <DialogTitle>Assign Permissions</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Select Permissions
                      </label>

                      <Select
                        onValueChange={(value) => {
                          if (!selectedPermissions.includes(value)) {
                            setSelectedPermissions((prev) => [...prev, value]);
                            const selectedPerm = permissions.find(
                              (p) => p.id === value
                            );
                            if (selectedPerm) {
                              setSelectedPermissionDetails((prev) => [
                                ...prev,
                                selectedPerm,
                              ]);
                            }
                          }
                        }}
                        value="" // Reset after selection
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select a permission to add..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {permissions
                            .filter(
                              (permission) =>
                                !selectedPermissions.includes(permission.id)
                            )
                            .map((permission) => (
                              <SelectItem
                                key={permission.id}
                                value={permission.id}
                                className="text-sm"
                              >
                                {permission.label} ({permission.module})
                              </SelectItem>
                            ))}
                          {permissions.length ===
                            selectedPermissions.length && (
                            <div className="py-2 text-center text-sm text-gray-500">
                              All permissions selected
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">
                        Selected Permissions ({selectedPermissionDetails.length}
                        )
                      </label>

                      <div className="min-h-12 p-3 border rounded-md bg-gray-50">
                        {selectedPermissionDetails.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedPermissionDetails.map((permission) => (
                              <div
                                key={permission.id}
                                className="relative bg-white border rounded-full pl-3 pr-6 py-1 text-xs shadow-sm flex items-center"
                              >
                                {permission.label} ({permission.module})
                                <button
                                  type="button"
                                  aria-label={`Remove ${permission.label}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPermissions((prev) =>
                                      prev.filter((id) => id !== permission.id)
                                    );
                                    setSelectedPermissionDetails((prev) =>
                                      prev.filter((p) => p.id !== permission.id)
                                    );
                                  }}
                                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No permissions selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleAssignPermissions}
                      disabled={isEditMode && selectedPermissions.length === 0}
                    >
                      {isEditMode ? "Save Changes" : "Assign Permissions"}
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this role? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Role;
