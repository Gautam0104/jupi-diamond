import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { getJewelleryTypeById, updateJewelleryType } from "../../../api/Admin/JewelleryApi";

const EditJewelleryTypeForm = ({ jewelId, fetchData }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (open && jewelId) {
      fetchJewelleryType();
    }
  }, [open, jewelId]);

  const fetchJewelleryType = async () => {
    setIsLoading(true);
    try {
      const response = await getJewelleryTypeById(jewelId);
      const data = response.data.data;
      setValue("name", data.name);
      setExistingImage(data.imageUrl);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jewellery type:", error);
      toast.error("Failed to fetch jewellery type details");
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('image/')) {
      toast.warning("Please select an image file");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setExistingImage(null); // Clear existing image when new file is selected
  };

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    fileInputRef.current.value = "";
    setExistingImage(null);
  };

  const onSubmit = async (data) => {
    if (!existingImage && !file) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    if (file) {
      formData.append("files", file);
    }

    try {
      const response = await updateJewelleryType(jewelId, formData);
      if (response.data.success) {
        toast.success("Jewellery type updated successfully");
        reset();
        removeFile();
        setOpen(false);
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to update jewellery type");
      }
    } catch (error) {
      console.error("Error updating jewellery type:", error);
      toast.error(error.response?.data?.message || "Failed to update jewellery type");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="edit" size="sm" className="text-xs md:text-sm px-6">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Jewellery Type</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div>
              <Label htmlFor="name" className="block mb-2 font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter jewellery type name"
                className="w-full text-xs sm:text-sm xl:text-base"
                {...register("name", { 
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  }
                })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label className="block mb-2 font-medium">
                Image {!existingImage && <span className="text-red-500">*</span>}
              </Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {preview ? (
                <div className="relative group">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      loading="lazy"
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {file.name}
                  </p>
                </div>
              ) : existingImage ? (
                <div className="relative group">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={existingImage}
                      alt="Existing"
                      loading="lazy"
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExistingImage(null);
                      triggerFileInput();
                    }}
                    className="absolute top-2 right-2 bg-primary text-white rounded-full p-1.5 hover:bg-primary-dark transition-colors"
                  >
                    <FiUpload className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Current image (click to change)
                  </p>
                </div>
              ) : (
                <div 
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors"
                >
                  <FiImage className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG (Max. 5MB)</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  reset();
                  removeFile();
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : "Update"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditJewelleryTypeForm;