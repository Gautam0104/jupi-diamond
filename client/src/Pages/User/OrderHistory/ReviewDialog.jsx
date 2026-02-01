import React, { useState, useCallback, use } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { addProductReview } from "../../../api/Public/publicApi";
import { IoStar } from "react-icons/io5";
import useAuth from "../../../Hooks/useAuth";

const ReviewDialog = ({
  open,
  onOpenChange,
  orderItemId,
  customerId,
  productVariantId,
  onSuccess
}) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const validationSchema = Yup.object({
    rating: Yup.number()
      .required("Rating is required")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    reviewTitle: Yup.string()
      .required("Review title is required")
      .max(100, "Title is too long"),
    reviewBody: Yup.string()
      .required("Review content is required")
      .max(1000, "Review is too long"),
  });

  const formik = useFormik({
    initialValues: {
      rating: 0,
      reviewTitle: "",
      reviewBody: "",
      images: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("orderItemId", orderItemId);
        formData.append("customerId", user?.id);
        formData.append("productVariantId", productVariantId);
        formData.append("rating", values.rating);
        formData.append("reviewTitle", values.reviewTitle);
        formData.append("reviewBody", values.reviewBody);

        // Append each image file
        values.images.forEach((file) => {
          formData.append("images", file);
        });

        await addProductReview(formData);

        toast.success("Review submitted successfully!");
        onOpenChange(false);
         if (onSuccess) {
        onSuccess(); 
      }
        formik.resetForm();
        setImagePreviews([]);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to submit review");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("Please upload only image files");
      return;
    }

    const newImages = [...formik.values.images];
    const newPreviews = [...imagePreviews];

    validFiles.forEach((file) => {
      if (newImages.length >= 5) {
        toast.warning("Maximum of 5 images allowed");
        return;
      }
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    formik.setFieldValue("images", newImages);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...formik.values.images];
    const newPreviews = [...imagePreviews];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    formik.setFieldValue("images", newImages);
    setImagePreviews(newPreviews);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]  rounded-none">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 ">
          <div>
            <Label htmlFor="rating" className="text-xs sm:text-sm">Rating</Label>
            <div className="flex items-center mt-1 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => formik.setFieldValue("rating", star)}
                  className="focus:outline-none"
                >
                  <IoStar
                    className={`h-4 sm:h-7 w-4 sm:w-7 ${
                      star <= formik.values.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {formik.touched.rating && formik.errors.rating ? (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.rating}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="reviewTitle" className="text-xs sm:text-sm">Review Title</Label>
            <Input
              id="reviewTitle"
              name="reviewTitle"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reviewTitle}
              placeholder="Summarize your experience"
              className="mt-1 text-xs sm:text-sm"
            />
            {formik.touched.reviewTitle && formik.errors.reviewTitle ? (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.reviewTitle}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="reviewBody" className="text-xs sm:text-sm">Review Content</Label>
            <Textarea
              id="reviewBody"
              name="reviewBody"
              rows={4}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reviewBody}
              placeholder="Share details about your experience with this product"
              className="mt-1 focus:outline-none focus:ring-0 text-xs sm:text-sm"
            />
            {formik.touched.reviewBody && formik.errors.reviewBody ? (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.reviewBody}
              </p>
            ) : null}
          </div>

          <div>
            <Label className={"mb-2 text-xs sm:text-sm"} >Upload Images (Optional, max 5)</Label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden text-xs sm:text-sm"
              onChange={handleFileChange}
            />

            {imagePreviews.length === 0 ? (
              <div
                onClick={() => document.getElementById("images").click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "hover:border-primary"
                }`}
              >
                <ImageIcon className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  PNG, JPG (Max. 5MB each)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square border rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {imagePreviews.length < 5 && (
                  <button
                    type="button"
                    onClick={() => document.getElementById("images").click()}
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Add more images ({5 - imagePreviews.length} remaining)
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                formik.resetForm();
                setImagePreviews([]);
              }}
              disabled={isSubmitting}
              className={"rounded-none text-xs sm:text-sm bg-white text-brown hover:bg-gray-100"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-none bg-brown text-xs sm:text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
