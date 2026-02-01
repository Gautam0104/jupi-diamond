import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "../ui/dialog";
import { TableCell } from "../ui/table";
import { Button } from "../ui/button";
import {
  FiTrash2,
  FiPlus,
  FiX,
  FiImage,
  FiVideo,
  FiMove,
} from "react-icons/fi";
import { toast } from "sonner";

import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  removeProductVariantImage,
  addProductVariantImage,
  updateProductVariantImageOrder,
} from "../../api/Admin/ProductApi";

// Draggable Image Component
const DraggableImage = memo(function DraggableImage({
  item,
  index,
  moveImage,
  handleDeleteMedia,
  isDeleting,
}) {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE",
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "IMAGE",
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;
      if (draggedItem.index === index) return;

      // Get bounding rectangle and mouse position
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      // Calculate mouse position relative to the hovered item
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the item's width/height
      // For horizontal movement (columns)
      if (draggedItem.index < index && hoverClientX < hoverMiddleX) return;
      if (draggedItem.index > index && hoverClientX > hoverMiddleX) return;

      // For vertical movement (rows)
      if (draggedItem.index < index && hoverClientY < hoverMiddleY) return;
      if (draggedItem.index > index && hoverClientY > hoverMiddleY) return;

      // Time to actually perform the action
      moveImage(draggedItem.index, index);
      draggedItem.index = index;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Combine drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`aspect-square relative group ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${isOver ? "ring-2 ring-blue-500" : ""}`}
    >
      {item.type === "video" ? (
        <video
          controls
          className="w-full h-full object-cover rounded-lg bg-gray-100"
        >
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={item.url}
          alt={`Preview ${index + 1}`}
          loading="lazy"
          className="w-full h-full object-cover rounded-lg bg-gray-100"
        />
      )}
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8 rounded-full bg-gray-700  text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiMove className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleDeleteMedia(item.id)}
          disabled={isDeleting}
        >
          <FiTrash2 className="h-4 w-4" />
        </Button>
      </div>
      {item.displayOrder !== undefined && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {item.displayOrder + 1}
        </div>
      )}
    </div>
  );
});

const ImageGalleryDialog = ({
  images: initialImages,
  productName,
  variantId,
  refreshData,
}) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [previewItems, setPreviewItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Initialize media items with proper display order
  useEffect(() => {
    const mappedItems = initialImages
      .map((item) => ({
        ...item,
        url: item.imageUrl,
        type: item.imageUrl.match(/\.(mp4|mov|avi|webm)$/i) ? "video" : "image",
        displayOrder: item.displayOrder || 0,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder);
    setMediaItems(mappedItems);
  }, [initialImages]);

  const handleDeleteMedia = async (mediaId) => {
    try {
      const response = await removeProductVariantImage(mediaId);
      if (response.status === 200) {
        toast.success(response.data.message || "Media deleted successfully");
        setMediaItems(mediaItems.filter((item) => item.id !== mediaId));
      } else {
        toast.error(response.data.message || "Failed to delete media");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete media");
    }
  };

  const handleAddMedia = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newItems = files.map((file) => {
      const isVideo = file.type.startsWith("video/");
      return {
        file,
        url: URL.createObjectURL(file),
        type: isVideo ? "video" : "image",
        isNew: true,
      };
    });

    setNewMedia((prev) => [...prev, ...files]);
    setPreviewItems((prev) => [...prev, ...newItems]);
  };

  const removePreviewItem = (index) => {
    const updatedFiles = [...newMedia];
    updatedFiles.splice(index, 1);
    setNewMedia(updatedFiles);

    const updatedPreviews = [...previewItems];
    URL.revokeObjectURL(updatedPreviews[index].url);
    updatedPreviews.splice(index, 1);
    setPreviewItems(updatedPreviews);
  };

  const uploadMedia = async () => {
    if (newMedia.length === 0) {
      toast.warning("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      newMedia.forEach((file) => {
        formData.append("files", file);
      });

      const response = await addProductVariantImage(variantId, formData);

      if (response.status === 200) {
        toast.success(response.data.message || "Media added successfully");
        setNewMedia([]);
        setPreviewItems([]);
        if (response.data.media) {
          setMediaItems(
            response.data.media
              .map((item) => ({
                ...item,
                url: item.imageUrl,
                type: item.imageUrl.match(/\.(mp4|mov|avi|webm)$/i)
                  ? "video"
                  : "image",
                displayOrder: item.displayOrder || 0,
              }))
              .sort((a, b) => a.displayOrder - b.displayOrder)
          );
        } else {
          setTimeout(refreshData, 1000);
        }
      } else {
        toast.error(response.data.message || "Failed to add media");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to add media");
    } finally {
      setIsUploading(false);
    }
  };

  const moveImage = useCallback((dragIndex, hoverIndex) => {
    setMediaItems((prevItems) => {
      const newItems = [...prevItems];
      const draggedItem = newItems[dragIndex];

      // Remove the dragged item
      newItems.splice(dragIndex, 1);
      // Insert the dragged item at the new position
      newItems.splice(hoverIndex, 0, draggedItem);

      // Update displayOrder based on new position
      return newItems.map((item, index) => ({
        ...item,
        displayOrder: index,
      }));
    });
  }, []);

  const saveImageOrder = async () => {
    if (mediaItems.length === 0) return;

    setIsUpdatingOrder(true);
    try {
      const imagesToUpdate = mediaItems.map((item) => ({
        id: item.id,
        displayOrder: item.displayOrder,
      }));
      const requestData = {
        images: imagesToUpdate, // Make sure this matches what your API expects
      };

      const response = await updateProductVariantImageOrder(
        variantId,
        requestData
      );

      if (response.status === 200) {
        toast.success("Image order saved successfully");
      } else {
        toast.error("Failed to save image order");
        const originalOrder = initialImages
          .map((item) => ({
            ...item,
            url: item.imageUrl,
            type: item.imageUrl.match(/\.(mp4|mov|avi|webm)$/i)
              ? "video"
              : "image",
            displayOrder: item.displayOrder || 0,
          }))
          .sort((a, b) => a.displayOrder - b.displayOrder);
        setMediaItems(originalOrder);
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(
        error.response?.data?.message || "Failed to save image order"
      );
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <DialogHeader>
          <DialogTitle className="tracking-wider leading-normal">
            Manage Media for {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="my-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <label className="cursor-pointer">
              <span className="inline-flex items-center text-xs px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                <FiPlus className="mr-2" /> Select Media
              </span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleAddMedia}
              />
            </label>

            <div className="flex gap-2">
              {mediaItems.length > 0 && (
                <Button
                  variant="outline"
                  onClick={saveImageOrder}
                  disabled={isUpdatingOrder}
                >
                  {isUpdatingOrder ? "Saving..." : "Save Order"}
                </Button>
              )}
              {(previewItems.length > 0 || mediaItems.length === 0) && (
                <Button
                  variant="edit"
                  className="text-[10px] rounded border-2"
                  onClick={uploadMedia}
                  disabled={isUploading || previewItems.length === 0}
                >
                  {isUploading
                    ? "Uploading..."
                    : `Upload ${previewItems.length} File(s)`}
                </Button>
              )}
            </div>
          </div>

          {previewItems.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {previewItems.map((item, index) => (
                <div key={index} className="aspect-square relative group">
                  {item.type === "video" ? (
                    <video
                      controls
                      className="w-full h-full object-cover rounded-lg bg-gray-100"
                    >
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Preview ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-lg bg-gray-100"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => removePreviewItem(index)}
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {mediaItems.length === 0 && previewItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
              <div className="flex gap-2 mb-4">
                <FiImage className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">
                No media available for this variant
              </p>
              <label className="cursor-pointer">
                <span className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  <FiPlus className="mr-2" /> Add Media
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleAddMedia}
                />
              </label>
            </div>
          )}
        </div>

        {/* Existing media with drag and drop */}
        {mediaItems.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {mediaItems.map((item, index) => (
              <DraggableImage
                key={item.id}
                item={item}
                index={index}
                moveImage={moveImage}
                handleDeleteMedia={handleDeleteMedia}
                isDeleting={isUpdatingOrder}
              />
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

// ProductImageCell remains the same as in your original code
const ProductImageCell = ({ item, refreshData }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasMedia = item?.productVariantImage?.length > 0;

  const firstMedia = hasMedia ? item.productVariantImage[0] : null;
  const isVideo = firstMedia?.imageUrl?.match(/\.(mp4|mov|avi|webm)$/i);

  return (
    <TableCell className="min-w-[80px]">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {hasMedia ? (
          <div className="relative aspect-square w-16">
            {isVideo ? (
              <video className="w-full h-full object-cover rounded bg-gray-100">
                <source src={firstMedia.imageUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={firstMedia.imageUrl}
                alt={item.products?.name}
                loading="lazy"
                className="w-full h-full object-cover rounded bg-gray-100"
              />
            )}
            {item.productVariantImage.length > 0 && (
              <DialogTrigger asChild>
                <button
                  className="absolute bottom-0 right-0 bg-black bg-opacity-70 hover:bg-opacity-90 text-white text-xs rounded size-5 flex items-center justify-center cursor-pointer transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  +{item.productVariantImage.length - 1}
                </button>
              </DialogTrigger>
            )}
          </div>
        ) : (
          <DialogTrigger asChild>
            <div className="relative aspect-square w-16 border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <div className="flex gap-1">
                <FiImage className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </DialogTrigger>
        )}

        <DialogContent className="sm:max-w-[625px] max-h-[73vh] overflow-y-auto">
          <ImageGalleryDialog
            images={item.productVariantImage || []}
            productName={item.products?.name}
            variantId={item.id}
            refreshData={refreshData}
          />
        </DialogContent>
      </Dialog>
    </TableCell>
  );
};

export default ProductImageCell;
