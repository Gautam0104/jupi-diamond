import { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import { toast } from "sonner";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddress,
} from "../../../api/User/AddressApi";
import useAuth from "../../../Hooks/useAuth";
import { Button } from "@/components/ui/button";
import EditAddressModal from "./EditAddressModal";
import { Skeleton } from "../../../components/ui/skeleton";
import { ImHome3 } from "react-icons/im";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "../../../components/ui/alert-dialog";

export default function Address() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getUserAddress();
        if (response.data.data && user) {
          const formattedAddresses = response.data.data.map((address) => ({
            id: address.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            address: `${address.houseNo}, ${address.street}\n${address.landMark}\n${address.city}, ${address.postalCode}\n${address.state}, ${address.country}`,
            mobile: user.phone || "",
            tag: address.addressType || "",
            isDefault: address.isBilling,
            panNumber: address.panNumber || "",
            gstNumber: address.gstNumber || "",
          }));
          setAddresses(formattedAddresses);
        }
      } catch (error) {
        console.log("Error fetching addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleSaveAddress = async (newAddress) => {
    try {
      const isFirstAddress = addresses.length === 0;

      const payload = {
        houseNo: newAddress.houseNo,
        landMark: newAddress.landMark,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.stateDisplay,
        country: newAddress.countryDisplay,
        postalCode: newAddress.postalCode,
        phoneNumber: newAddress.mobile,
        isBilling: isFirstAddress ? true : newAddress.isBilling,
        addressType: newAddress.addressType || "N/A",
        panNumber: newAddress.panNumber || "",
        gstNumber: newAddress.gstNumber || "",
      };

      const response = await createUserAddress(payload);
      if (response.status === 201) {
        toast.success("Address saved successfully!");
        setIsModalOpen(false);
        const updatedResponse = await getUserAddress();

        const formattedAddresses = updatedResponse.data.data.map((address) => ({
          id: address.id,
          name: `${user.firstName} ${user.lastName}`,
          address: `${address.houseNo}, ${address.street}\n${address.landMark}\n${address.city}, ${address.postalCode}\n${address.state}, ${address.country}`,
          mobile: user.phone,
          tag: address.addressType,
          panNumber: address.panNumber,
          gstNumber: address.gstNumber,
          isDefault: address.isBilling,
        }));
        setAddresses(formattedAddresses);
      } else {
        toast.error(response.data.message || "Failed to save address");
      }
    } catch (error) {
      console.log("Error saving address:", error);
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      const response = await deleteUserAddress(addressToDelete);
      if (response.status === 200) {
        toast.success("Address deleted successfully!");
        setAddresses(
          addresses.filter((address) => address.id !== addressToDelete)
        );
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.log("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setAddressToDelete(null);
    }
  };

  const AddressCard = ({
    id,
    name,
    address,
    mobile,
    tag,
    isDefault,
    panNumber,
    gstNumber,
  }) => {
    return (
      <div className="bg-white shadow-md border p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{name}</p>
            <p className="mt-1 text-xs sm:text-sm whitespace-pre-line">
              {address}
            </p>

            <div className="mt-2 text-xs sm:text-sm font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-10">
              <p className="">
                Mobile: <span className="font-normal">{mobile}</span>
              </p>
              {panNumber && (
                <p className="">
                  PAN Number: <span className="font-normal">{panNumber}</span>
                </p>
              )}
              {gstNumber && (
                <p className="">
                  GST Number: <span className="font-normal">{gstNumber}</span>
                </p>
              )}
            </div>
          </div>
          {tag && (
            <span className="bg-gray-100 text-xs !capitalize text-gray-600 px-3 py-1 rounded-full mt-1">
              {tag}
            </span>
          )}
        </div>

        <div className="flex border-t mt-4 pt-3 text-xs sm:text-sm text-[#c98d73] font-medium">
          <button
            onClick={() => handleEditAddress(id)}
            className="w-1/2 text-center cp"
          >
            EDIT
          </button>
          <span className="w-px bg-gray-300 mx-1" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="w-1/2 text-center cp hover:text-red-600 transition-all duration-200 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddressToDelete(id);
                }}
              >
                REMOVE
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className={"text-base sm:text-lg"}>
                  Are you sure you want to delete this address?
                </AlertDialogTitle>
                <AlertDialogDescription className={"text-xs sm:text-sm"}>
                  This action cannot be undone. This will permanently remove the
                  address from your address book.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className={"w-1/2 sm:w-auto text-xs sm:text-sm"}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className={"w-1/2 sm:w-auto text-xs sm:text-sm"}
                  onClick={handleDeleteAddress}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-md border p-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-4 w-52 mb-2" />
            <Skeleton className="h-4 w-52 mt-2" />
            <Skeleton className="h-4 w-56 mt-4" />
          </div>
          <Skeleton className="h-6 w-16 rounded" />
        </div>

        <div className="flex border-t mt-4 pt-3 text-sm">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-9 w-px mx-1" />
          <Skeleton className="h-9 w-1/2" />
        </div>
      </div>
    );
  }

  const handleEditAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = async () => {
    const updatedResponse = await getUserAddress();

    const formattedAddresses = updatedResponse.data.data.map((address) => ({
      id: address.id,
      name: `${user.firstName} ${user.lastName}`,
      address: `${address.houseNo}, ${address.street}\n${address.landMark}\n${address.city}, ${address.postalCode}\n${address.state}, ${address.country}`,
      mobile: user.phone,
      tag: address.addressType,
      panNumber: address.panNumber,
      gstNumber: address.gstNumber,
      isDefault: address.isBilling,
    }));
    setAddresses(formattedAddresses);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Address Book</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#c98d73] cp text-white px-4 py-2 text-xs sm:text-sm"
        >
          + Add New Address
        </button>
      </div>

      <div>
        <h3 className="text-xs sm:text-sm text-gray-500 font-semibold mb-2">
          {addresses.filter((a) => a.isDefault).length > 0
            ? "Default Address"
            : ""}
        </h3>
        {addresses
          .filter((a) => a.isDefault)
          .map((address) => (
            <AddressCard key={address.id} {...address} />
          ))}
      </div>

      <div>
        <h3 className="text-xs sm:text-sm text-gray-500 font-semibold mb-2">
          {addresses.filter((a) => !a.isDefault).length > 0
            ? "Other Addresses"
            : ""}
        </h3>
        {addresses
          .filter((a) => !a.isDefault)
          .map((address) => (
            <AddressCard key={address.id} {...address} />
          ))}
        {addresses.length === 0 && (
          <p className="text-gray-500">No other addresses found</p>
        )}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        isFirstAddress={addresses.length === 0}
      />
      <EditAddressModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        addressId={selectedAddressId}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
