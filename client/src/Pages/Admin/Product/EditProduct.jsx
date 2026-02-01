import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { UploadCloud } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "../../../components/ui/button";
import { getMetalColor, getMetalVariant } from "../../../api/Admin/MetalApi";
import { getGemstoneVariant } from "../../../api/Admin/GemstoneApi";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  fetchAllMakingChargeWeightRanges,
  fetchGlobalMakingCharges,
} from "../../../api/Admin/MakingChargeApi";
import { getJewelleryType } from "../../../api/Admin/JewelleryApi";
import {
  addProductVariantImage,
  addScrewToVariant,
  deleteProductVariant,
  getKarigarDetails,
  getProductById,
  getProductSize,
  getProductStyle,
  removeProductVariantImage,
  removeScrewFromVariant,
  updateProduct,
  updateProductVariantImageOrder,
} from "../../../api/Admin/ProductApi";
import { getGlobalDiscounts } from "../../../api/Admin/GlobalDiscount";
import { getOccassion } from "../../../api/Admin/OccationAPi";
import { getCollection } from "../../../api/Admin/CollectionApi";
import { toast } from "sonner";
import AddMetalColorDialog from "./AddMetalColorDialog";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
import { Skeleton } from "../../../components/ui/skeleton";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import AddProductSizeDialog from "./AddProductSizeDialog";
import AddGemstoneVariantDialog from "./AddGemstoneVariantDialog";
import AddMetalVariantDialog from "./AddMetalVariantDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import AddMakingChargeWeightRangeDialog from "./AddMakingChargeWeightRangeDialog";

const DraggableImage = ({ id, url, type, index, moveImage, removeImage }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "image",
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative h-40 w-40 rounded-md overflow-hidden aspect-square bg-gray-200 shadow-md ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {type?.startsWith("video/") ? (
        <video controls className="h-full w-full object-cover">
          <source src={url} type={type} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={url}
          alt={`Media preview ${index + 1}`}
          className="h-full w-full object-cover"
        />
      )}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-1 right-1 p-1 rounded-full shadow-md h-6 w-6"
        onClick={() => removeImage(index)}
      >
        <FiTrash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [showKarigarSection, setShowKarigarSection] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isVariant, setIsVariant] = useState({ count: 0, isVariant: false });
  const [variantToDelete, setVariantToDelete] = useState({
    id: null,
    index: null,
  });
  const [formData, setFormData] = useState({
    title: "",
    productStyle: [],
    collection: [],
    description: "",
    occasion: [],
    jewelleryType: "",

    karigarName: "",
    karigarEmail: "",
    karigarPhone: "",
    karigarLocation: "",
    karigarExpertise: "",
    karigarBio: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [""],
    tags: [""],
    productVariantData: [
      {
        metal: "",
        gemstone: "",
        metalColor: "",
        gemstoneColor: "",
        productSize: [],
        makingChargeCategorySetId: "",
        makingChargeWeightRangeId: "",
        karigar: "",
        metalWeightGram: "",
        gemstoneWeightCarat: "",
        stock: "",
        gst: "",
        numberOfDiamonds: null,
        numberOfSideDiamonds: null,
        sideDiamondPriceCarat: null,
        sideDiamondWeight: null,
        sideDiamondQuality: null,
        // isFeatured: false,
        // isNewArrival: false,
        length: null,
        width: null,
        height: null,
        // newArrivalUntil: "",
        returnPolicy: "",
        note: "",
        screwOption: [
          {
            screwType: "",
            screwMaterial: "",
            notes: "",
          },
        ],
        continueSelling: false,
        images: [],
        imagePreviews: [],
      },
    ],
  });

  const [filterOptions, setFilterOptions] = useState({
    metalVariant: [],
    gemstoneVariant: [],
    makingCharge: [],
    jewelleryType: [],
    productSize: [],
    globalDiscounts: [],
    occasion: [],
    productStyle: [],
    collection: [],
    makingChargeWeightRangeOptions: [],
    globalMakingChargesOptions: [],
    karigarOptions: [],
    metalColor: [],
  });

  console.log("filterOptions:", filterOptions);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          metalVariantRes,
          gemstoneVariantRes,
          makingChargeRes,
          jewelleryTypeRes,
          productSizeRes,
          globalDiscountsRes,
          occasionRes,
          productStyleRes,
          collectionRes,
          makingChargeWeightRangesRes,
          karigarDetailsRes,
          metalColorRes,
        ] = await Promise.all([
          getMetalVariant(),
          getGemstoneVariant(),
          fetchGlobalMakingCharges(),
          getJewelleryType(),
          getProductSize(),
          getGlobalDiscounts(),
          getOccassion(),
          getProductStyle(),
          getCollection(),
          fetchAllMakingChargeWeightRanges(),
          getKarigarDetails(),
          getMetalColor(),
        ]);

        // Process each response and track empty fields
        const emptyFields = [];

        const metalVariant = metalVariantRes.data?.data?.metalVariant || [];
        if (metalVariant.length === 0) emptyFields.push("Metal Variant");

        const gemstoneVariant =
          gemstoneVariantRes.data?.data?.gemstoneVariant || [];
        if (gemstoneVariant.length === 0) emptyFields.push("Gemstone Variant");

        const makingCharge = makingChargeRes?.data?.data || [];
        if (makingCharge.length === 0) emptyFields.push("Making Charge");

        const jewelleryType = jewelleryTypeRes.data?.data?.jewelryType || [];
        if (jewelleryType.length === 0) emptyFields.push("Jewellery Type");

        const productSize = productSizeRes.data?.data?.result || [];
        if (productSize.length === 0) emptyFields.push("Product Size");

        const globalDiscounts = globalDiscountsRes.data?.data || [];
        if (globalDiscounts.length === 0) emptyFields.push("Global Discounts");

        const occasion = occasionRes.data?.data?.result || [];
        if (occasion.length === 0) emptyFields.push("Occasion");

        const productStyle = productStyleRes.data?.data?.result || [];
        if (productStyle.length === 0) emptyFields.push("Product Style");

        const collection = collectionRes.data?.data?.collection || [];
        if (collection.length === 0) emptyFields.push("Collection");

        const makingChargeWeightRangeOptions =
          makingChargeWeightRangesRes?.data?.data?.makingCharges || [];
        if (makingChargeWeightRangeOptions?.length === 0)
          emptyFields.push("Making Charge Weight Ranges");

        const karigarOptions = karigarDetailsRes.data?.data || [];
        if (karigarOptions.length === 0) emptyFields.push("Karigar Details");

        const metalColor = metalColorRes.data?.data || [];
        if (metalColor.length === 0) emptyFields.push("Metal Color");

        // Set all available data regardless of empty fields
        setFilterOptions({
          metalVariant,
          gemstoneVariant,
          makingCharge,
          jewelleryType,
          productSize,
          globalDiscounts,
          occasion,
          productStyle,
          collection,
          makingChargeWeightRangeOptions,
          karigarOptions,
          metalColor,
        });

        // Show warning for empty fields if any
        if (emptyFields.length > 0) {
          toast.warning(`No data available for: ${emptyFields.join(", ")}`, {
            autoClose: 5000,
          });
        }

        await fetchProductData();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      } finally {
        setLoading(false);
        setFetchingProduct(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchProductData = async () => {
    try {
      setFetchingProduct(true);
      const response = await getProductById(id);
      const productData = response.data.data;

      const hasOtherKarigar = productData.productVariant.some(
        (variant) => variant.karigarId === "other"
      );
      setShowKarigarSection(hasOtherKarigar);

      setFormData({
        title: productData.name,

        productStyle: productData.productStyle
          ? productData.productStyle.map((style) => style.id)
          : [],
        jewelleryType: productData.jewelryTypeId,
        // collection: productData.collectionId,
        collection: productData.collection
          ? productData.collection.map((collection) => collection.id)
          : [],
        description: productData.description,
        // occasion: productData.occasionId || "",
        occasion: productData.occasion
          ? productData.occasion.map((occasion) => occasion.id)
          : [],

        karigarName: productData.karigarName || "",
        karigarEmail: productData.karigarEmail || "",
        karigarPhone: productData.karigarPhone || "",
        karigarLocation: productData.karigarLocation || "",
        karigarExpertise: productData.karigarExpertise || "",
        karigarBio: productData.karigarBio || "",
        metaTitle: productData.metaTitle || "",
        metaDescription: productData.metaDescription || "",
        metaKeywords: productData.metaKeywords || [""],
        tags: productData.tags || [""],
        productVariantData: productData.productVariant.map((variant) => ({
          productVariantId: variant.id,
          metal: variant.metalVariantId,
          gemstone: variant.gemstoneVariantId || "",
          metalColor: variant.metalColorId || "",
          gemstoneColor: variant.gemstoneColor || "",
          productSize: variant.productSize?.map((size) => size.id) || [],
          makingChargeCategorySetId: variant?.makingChargeCategorySetId || "",
          makingChargeWeightRangeId: variant?.makingChargeWeightRangeId || "",
          karigar: variant.karigarId || "",
          metalWeightGram: variant.metalWeightInGram || "",
          gemstoneWeightCarat: variant.gemstoneWeightInCarat || "",
          stock: variant.stock || 0,
          gst: variant.gst || "",
          length: variant.length || "",
          width: variant.width || "",
          height: variant.height || "",
          numberOfDiamonds: variant.numberOfDiamonds || null,
          numberOfSideDiamonds: variant.numberOfSideDiamonds || null,
          sideDiamondPriceCarat: variant.sideDiamondPriceCarat || null,
          sideDiamondWeight: variant.sideDiamondWeight || null,
          sideDiamondQuality: variant.sideDiamondQuality || null,
          // isFeatured: variant.isFeatured || false,
          // isNewArrival: variant.isNewArrival || false,
          // newArrivalUntil: variant.newArrivalUntil || "",
          returnPolicy: variant.returnPolicyText || "",
          note: variant.note || "",
          screwOption: variant.ScrewOption?.map((screw) => ({
            screwId: screw.id,
            screwType: screw.screwType || "",
            screwMaterial: screw.screwMaterial || "",
            notes: screw.notes || "",
          })) || [
            {
              screwType: "",
              screwMaterial: "",
              notes: "",
            },
          ],
          continueSelling: variant.continueSelling || false,
          images: variant.productVariantImage || [],

          imagePreviews:
            variant.productVariantImage?.map((img) => ({
              id: img.id,
              url: img.imageUrl,
              type: img.imageUrl.match(/\.(mp4|mov|avi)$/i)
                ? "video/mp4"
                : "image/jpeg",
            })) || [],
        })),
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product data");
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayFieldChange = (fieldName, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[fieldName]];
      newArray[index] = value;
      return { ...prev, [fieldName]: newArray };
    });
  };

  const addArrayFieldItem = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ""],
    }));
  };

  const removeArrayFieldItem = (fieldName, index) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = async (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.productVariantData];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, productVariantData: newVariants };
    });

    // If the field is metalWeightGram, filter the weight ranges
    if (field === "metalWeightGram" && value) {
      try {
        const weight = parseFloat(value);
        if (!isNaN(weight)) {
          const response = await fetchAllMakingChargeWeightRanges({
            weight: weight,
          });

          setFilterOptions((prev) => ({
            ...prev,
            makingChargeWeightRangeOptions:
              response.data?.data?.makingCharges || [],
          }));
        }
      } catch (error) {
        console.error("Error filtering weight ranges:", error);
      }
    }
  };

  const handleVariantImageChange = async (variantIndex, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const variant = formData.productVariantData[variantIndex];
    const variantId = variant.productVariantId;

    const newPreviews = files.map((file) => ({
      url: file.type.startsWith("video/") ? URL.createObjectURL(file) : null,
      type: file.type,
      isNew: true,
      file,
    }));

    const imageFiles = files.filter((file) => !file.type.startsWith("video/"));
    const imagePreviews = await Promise.all(
      imageFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              url: reader.result,
              type: file.type,
              isNew: true,
              file,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const finalPreviews = newPreviews.map((preview) => {
      if (preview.url) return preview;
      const imagePreview = imagePreviews.find((p) => p.file === preview.file);
      return imagePreview || preview;
    });

    setFormData((prev) => {
      const newVariants = [...prev.productVariantData];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        images: [...newVariants[variantIndex].images, ...files],
        imagePreviews: [
          ...newVariants[variantIndex].imagePreviews,
          ...finalPreviews,
        ],
      };
      return { ...prev, productVariantData: newVariants };
    });

    for (const file of files) {
      const formDataImage = new FormData();
      formDataImage.append("image", file);

      try {
        const response =
          isVariant.isVariant === false &&
          (await addProductVariantImage(variantId, formDataImage));
        if (response.status === 200) {
          toast.success("Media uploaded");
          fetchProductData();
        }
      } catch (err) {
        console.error(err);
        toast.error("Upload failed");
      }
    }
  };

  const removeVariantImage = async (variantIndex, imageIndex) => {
    const variant = formData.productVariantData[variantIndex];
    const imageToDelete = variant.images[imageIndex];
    const previewToDelete = variant.imagePreviews[imageIndex];

    if (previewToDelete?.isNew) {
      if (
        previewToDelete.url &&
        (previewToDelete.type?.startsWith("video/") ||
          previewToDelete.type?.startsWith("image/"))
      ) {
        URL.revokeObjectURL(previewToDelete.url);
      }
    }

    setFormData((prev) => {
      const newVariants = [...prev.productVariantData];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        images: newVariants[variantIndex].images.filter(
          (_, i) => i !== imageIndex
        ),
        imagePreviews: newVariants[variantIndex].imagePreviews.filter(
          (_, i) => i !== imageIndex
        ),
      };
      return { ...prev, productVariantData: newVariants };
    });

    if (typeof imageToDelete === "object" && imageToDelete?.id) {
      try {
        const response = await removeProductVariantImage(imageToDelete.id);
        if (response.status === 200) {
          toast.success("Media removed successfully!");
        } else {
          toast.error("Failed to delete media");
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Error deleting media");
      }
    }
  };

  const removeVariant = (index) => {
    setFormData((prev) => {
      if (prev.productVariantData.length <= 1) {
        toast.warning("You must have at least one variant");
        return prev;
      }
      const updatedVariants = [...prev.productVariantData];
      updatedVariants.splice(index, 1);
      return {
        ...prev,
        productVariantData: updatedVariants,
      };
    });
  };

  const handleDeleteVariant = (variantId, index) => {
    // If it's a new variant that hasn't been saved yet (no ID), just remove it from state
    if (!variantId) {
      removeVariant(index);
      return;
    }

    // Set the variant to be deleted and open confirmation dialog
    setVariantToDelete({ id: variantId, index });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteProductVariant(variantToDelete.id);

      if (response.status === 200) {
        toast.success("Variant deleted successfully");
        removeVariant(variantToDelete.index);
      } else {
        toast.error("Failed to delete variant");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error(error.response?.data?.message || "Failed to delete variant");
    } finally {
      setDeleteConfirmOpen(false);
      setVariantToDelete({ id: null, index: null });
    }
  };
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      productVariantData: [
        ...prev.productVariantData,
        {
          metal: "",
          gemstone: "",
          metalColor: "",
          gemstoneColor: "",
          productSize: "",
          makingChargeCategorySetId: "",
          makingChargeWeightRangeId: "",
          karigar: "",
          metalWeightGram: "",
          gemstoneWeightCarat: "",
          stock: "",
          gst: "",
          numberOfDiamonds: null,
          numberOfSideDiamonds: null,
          sideDiamondPriceCarat: null,
          sideDiamondWeight: null,
          sideDiamondQuality: null,
          // isFeatured: false,
          // isNewArrival: false,
          // newArrivalUntil: "",
          returnPolicy: "",
          note: "",
          screwOption: [{ screwType: "", screwMaterial: "", notes: "" }],
          continueSelling: false,
          images: [],
          imagePreviews: [],
        },
      ],
    }));
  };

  const handleScrewOptionChange = (variantIndex, screwIndex, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.productVariantData];
      const newscrewOption = [...newVariants[variantIndex].screwOption];
      newscrewOption[screwIndex] = {
        ...newscrewOption[screwIndex],
        [field]: value,
      };
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        screwOption: newscrewOption,
      };
      return { ...prev, productVariantData: newVariants };
    });
  };

  const addScrewOption = (variantIndex) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.productVariantData];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        screwOption: [
          ...updatedVariants[variantIndex].screwOption,
          { screwType: "", screwMaterial: "", notes: "" },
        ],
      };
      return { ...prev, productVariantData: updatedVariants };
    });
  };

  const removeScrewOption = (variantIndex, screwIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.productVariantData];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        screwOption: newVariants[variantIndex].screwOption.filter(
          (_, i) => i !== screwIndex
        ),
      };
      return { ...prev, productVariantData: newVariants };
    });
  };

  const productValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    productStyle: Yup.array().nullable(),
    jewelleryType: Yup.string().required("Jewellery Type is required"),
    description: Yup.string().required("Description is required"),

    metaTitle: Yup.string().required("Meta Title is required"),
    metaDescription: Yup.string().required("Meta Description is required"),
    productVariantData: Yup.array()
      .min(1, "At least one variant is required")
      .of(
        Yup.object().shape({
          metal: Yup.string().required("Metal is required"),

          metalWeightGram: Yup.string().test(
            "required-if-metal",
            "Metal weight in gram is required",
            function (value) {
              const { metal } = this.parent;
              return !metal || (value && value.trim() !== "");
            }
          ),

          gemstone: Yup.string().nullable(),
          numberOfDiamonds: Yup.number().nullable(),
          numberOfSideDiamonds: Yup.number().nullable(),
          sideDiamondPriceCarat: Yup.number().nullable(),
          sideDiamondWeight: Yup.number().nullable(),
          sideDiamondQuality: Yup.string().nullable(),
          gemstoneWeightCarat: Yup.string().test(
            "required-if-gemstone",
            "Gemstone weight in carat is required",
            function (value) {
              const { gemstone } = this.parent;
              return !gemstone || (value && value.trim() !== "");
            }
          ),
          stock: Yup.string().required("Stock is required"),
          length: Yup.string().required("Length is required"),
          width: Yup.string().required("Width is required"),
          height: Yup.string().required("Height is required"),
          returnPolicy: Yup.string().required("Return policy is required"),
          note: Yup.string().nullable(),
          images: Yup.array()
            .min(1, "At least one image is required for each variant")
            .required("At least one image is required"),
        })
      ),
  });

  const [errors, setErrors] = useState({});

  const validateFields = async () => {
    try {
      await productValidationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};

      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });

        setErrors(validationErrors);

        const firstError = err.inner[0];
        if (firstError) {
          const element = document.querySelector(`[name="${firstError.path}"]`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          console.log(firstError.message);
          toast.error(firstError.message);
        }
      } else {
        // fallback error handling

        toast.error(err.message || "Validation failed");
      }

      return false;
    }
  };

  const handleAddScrew = async (screwData) => {
    try {
      const response = await addScrewToVariant(screwData);
      if (response.status === 200) {
        toast.success("Screw option added successfully");
        await fetchProductData();
      } else {
        toast.error(response.data?.message || "Failed to add screw option");
      }
    } catch (error) {
      console.error("Error adding screw:", error);
      toast.error("Failed to add screw option");
    }
  };

  const handleRemoveScrew = async (variantId, screwId) => {
    try {
      const response = await removeScrewFromVariant(variantId, screwId);
      if (response.status === 200) {
        toast.success("Screw option removed successfully");
        // Refresh the product data to get the updated screw options
        await fetchProductData();
      } else {
        toast.error(response.data?.message || "Failed to remove screw option");
      }
    } catch (error) {
      console.error("Error removing screw:", error);
      toast.error("Failed to remove screw option");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateFields();
    if (!isValid) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.title,
        description: formData.description,
        jewelryTypeId: formData.jewelleryType,
        collectionId: formData.collection.filter(Boolean),
        productStyleId: formData.productStyle.filter(Boolean),
        occasionId: formData.occasion.filter(Boolean),
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,

        karigarName: showKarigarSection ? formData.karigarName : undefined,
        karigarEmail: showKarigarSection ? formData.karigarEmail : undefined,
        karigarPhone: showKarigarSection ? formData.karigarPhone : undefined,
        karigarLocation: showKarigarSection
          ? formData.karigarLocation
          : undefined,
        karigarExpertise: showKarigarSection
          ? formData.karigarExpertise
          : undefined,
        karigarBio: showKarigarSection ? formData.karigarBio : undefined,
        metaKeywords: formData.metaKeywords.filter(Boolean),
        tags: formData.tags.filter(Boolean),
        productVariantData: formData.productVariantData.map((variant) => ({
          productVariantId: variant.productVariantId || undefined,
          metalVariantId: variant.metal,
          gemstoneVariantId: variant.gemstone || null,
          metalColorId: variant.metalColor || null,
          gemstoneColor: variant.gemstoneColor || null,
          productSizeId: variant.productSize,
          makingChargeCategorySetId: variant.makingChargeCategorySetId || null,
          makingChargeWeightRangeId: variant.makingChargeWeightRangeId || null,
          karigarId: variant.karigar || null,
          metalWeightInGram: Number(variant.metalWeightGram),
          gemstoneWeightInCarat: Number(variant.gemstoneWeightCarat) || 0,
          stock: Number(variant.stock),
          gst: Number(variant.gst) || 0,
          numberOfDiamonds: Number(variant.numberOfDiamonds) || null,
          numberOfSideDiamonds: variant.numberOfSideDiamonds || null,
          sideDiamondPriceCarat: variant.sideDiamondPriceCarat || null,
          sideDiamondWeight: variant.sideDiamondWeight || null,
          sideDiamondQuality: variant.sideDiamondQuality || null,
          // isFeatured: Boolean(variant.isFeatured),
          // isNewArrival: Boolean(variant.isNewArrival),
          length: variant.length ? variant.length : null,
          width: variant.width ? variant.width : null,
          height: variant.height ? variant.height : null,
          // newArrivalUntil: variant.newArrivalUntil || null,
          returnPolicyText: variant.returnPolicy,
          note: variant.note,
          continueSelling: Boolean(variant.continueSelling),
        })),
      };
      console.log("Payload to update product:", payload);

      const response = await updateProduct(id, payload);

      if (response.status === 201) {
        toast.success("Product updated successfully!");
        navigate("/admin/product/all-products");
      } else {
        toast.error(response.data?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const editorContent = useRef(null);
  const editorReturnContent = useRef(null);
  const editorNoteContent = useRef(null);

  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
      },
      readonly: false,
    }),
    []
  );

  const saveImageOrder = async (variantId, variantIndex) => {
    const variant = formData.productVariantData[variantIndex];
    if (variant.imagePreviews.length === 0) return;

    try {
      const imagesToUpdate = variant.imagePreviews
        .filter((img) => img.id) // Only include saved images (with IDs)
        .map((item, index) => ({
          id: item.id,
          displayOrder: index,
        }));

      if (imagesToUpdate.length === 0) {
        toast.info("No image order changes to save");
        return;
      }

      const requestData = {
        images: imagesToUpdate,
      };

      const response = await updateProductVariantImageOrder(
        variantId,
        requestData
      );

      if (response.status === 200) {
        toast.success("Image order saved successfully");
        fetchProductData();
      } else {
        toast.error("Failed to save image order");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(
        error.response?.data?.message || "Failed to save image order"
      );
    }
  };

  if (fetchingProduct) {
    return (
      <div className="w-full mx-auto ">
        <div className="mb-6">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-6 w-full" />
        </div>

        {/* Main form skeleton */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </Card>

          {/* Variant skeleton */}
          <Card className="p-6">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </Card>

          {/* Shipping skeleton */}
          <Card className="p-6">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full  mx-auto ">
        {/* Header Section */}
        <div className="mb-3 sm:mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Edit Product
          </h2>
          <div className="flex flex-row items-center justify-between gap-2">
            <p className="text-md font-medium text-gray-600">Product Listing</p>
            <Link to={"/admin/product/all-products"} className="group">
              <button className="addButton text-sm sm:text-md font-medium text-gray-600 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                <FaArrowLeftLong /> Back
              </button>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Main Product Form Card */}
          <Card className="p-4 sm:p-6 bg-white mb-6 shadow-sm rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Product Title"
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Jewellery Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Jewellery Type
                </label>
                <Select
                  value={formData.jewelleryType}
                  onValueChange={(value) => {
                    handleSelectChange("jewelleryType", value);
                    handleSelectChange("productStyle", "");
                    handleSelectChange("productSize", []);

                    setFormData((prev) => ({
                      ...prev,
                      productVariantData: prev.productVariantData.map(
                        (variant) => ({
                          ...variant,
                          productSize: [],
                        })
                      ),
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select jewellery type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.jewelleryType.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jewelleryType && (
                  <p className="text-red-500 text-sm">{errors.jewelleryType}</p>
                )}
              </div>

              {/* Product Style */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Style
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-md"
                      onClick={() => {
                        if (!formData.jewelleryType) {
                          toast.error("Please select a Jewellery Type first");
                        }
                      }}
                    >
                      {formData.productStyle?.length > 0
                        ? `${formData.productStyle.length} styles selected`
                        : "Select styles"}
                    </Button>
                  </PopoverTrigger>
                  {formData.jewelleryType && (
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search styles..." />
                        <CommandList>
                          <CommandEmpty>No styles found.</CommandEmpty>
                          <CommandGroup>
                            {filterOptions.productStyle
                              .filter(
                                (style) =>
                                  style.jewelryTypeId === formData.jewelleryType
                              )
                              .map((style) => (
                                <CommandItem key={style.id}>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`style-${style.id}`}
                                      checked={formData.productStyle.includes(
                                        style.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        setFormData((prev) => {
                                          const currentStyles = [
                                            ...prev.productStyle,
                                          ];
                                          const newStyles = checked
                                            ? [...currentStyles, style.id]
                                            : currentStyles.filter(
                                                (s) => s !== style.id
                                              );
                                          return {
                                            ...prev,
                                            productStyle: newStyles,
                                          };
                                        });
                                      }}
                                    />
                                    <label
                                      htmlFor={`style-${style.id}`}
                                      className="text-sm font-medium leading-none"
                                    >
                                      {style.name}
                                    </label>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
                {formData.productStyle?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.productStyle.map((styleId) => {
                      const style = filterOptions.productStyle.find(
                        (s) => s.id === styleId
                      );
                      return style ? (
                        <span
                          key={styleId}
                          className="bg-gray-100 px-2 py-1 rounded-md text-xs"
                        >
                          {style.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {errors.productStyle && (
                  <p className="text-red-500 text-sm">{errors.productStyle}</p>
                )}
              </div>

              {/* Collection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Collection
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-md"
                    >
                      {formData.collection?.length > 0
                        ? `${formData.collection.length} collections selected`
                        : "Select collections"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search collections..." />
                      <CommandList>
                        <CommandEmpty>No collections found.</CommandEmpty>
                        <CommandGroup>
                          {filterOptions.collection.map((collection) => (
                            <CommandItem key={collection.id}>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`collection-${collection.id}`}
                                  checked={formData.collection.includes(
                                    collection.id
                                  )}
                                  onCheckedChange={(checked) => {
                                    setFormData((prev) => {
                                      const currentCollections = [
                                        ...prev.collection,
                                      ];
                                      const newCollections = checked
                                        ? [...currentCollections, collection.id]
                                        : currentCollections.filter(
                                            (c) => c !== collection.id
                                          );
                                      return {
                                        ...prev,
                                        collection: newCollections,
                                      };
                                    });
                                  }}
                                />
                                <label
                                  htmlFor={`collection-${collection.id}`}
                                  className="text-sm font-medium leading-none"
                                >
                                  {collection.name}
                                </label>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.collection?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.collection.map((collectionId) => {
                      const collection = filterOptions.collection.find(
                        (c) => c.id === collectionId
                      );
                      return collection ? (
                        <span
                          key={collectionId}
                          className="bg-gray-100 px-2 py-1 rounded-md text-xs"
                        >
                          {collection.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Occasion */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Occasion
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-md"
                    >
                      {formData.occasion?.length > 0
                        ? `${formData.occasion.length} occasions selected`
                        : "Select occasions"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search occasions..." />
                      <CommandList>
                        <CommandEmpty>No occasions found.</CommandEmpty>
                        <CommandGroup>
                          {filterOptions.occasion.map((occ) => (
                            <CommandItem key={occ.id}>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`occasion-${occ.id}`}
                                  checked={formData.occasion.includes(occ.id)}
                                  onCheckedChange={(checked) => {
                                    setFormData((prev) => {
                                      const currentOccasions = [
                                        ...prev.occasion,
                                      ];
                                      const newOccasions = checked
                                        ? [...currentOccasions, occ.id]
                                        : currentOccasions.filter(
                                            (o) => o !== occ.id
                                          );
                                      return {
                                        ...prev,
                                        occasion: newOccasions,
                                      };
                                    });
                                  }}
                                />
                                <label
                                  htmlFor={`occasion-${occ.id}`}
                                  className="text-sm font-medium leading-none"
                                >
                                  {occ.name}
                                </label>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.occasion?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.occasion.map((occasionId) => {
                      const occasion = filterOptions.occasion.find(
                        (o) => o.id === occasionId
                      );
                      return occasion ? (
                        <span
                          key={occasionId}
                          className="bg-gray-100 px-2 py-1 rounded-md text-xs"
                        >
                          {occasion.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className=" space-y-2  md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>

                <JoditEditor
                  ref={editorContent}
                  config={config}
                  value={formData.description}
                  onBlur={() => {}}
                  onChange={(newContent) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: newContent,
                    }))
                  }
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Variants Section */}
          {formData.productVariantData.map((variant, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 bg-white shadow-sm mb-6 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Variant {index + 1}
                </h2>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteVariant(variant.productVariantId, index)
                    }
                    className="gap-2 rounded-md"
                  >
                    <FiTrash2 className="w-4 h-4" /> Remove
                  </Button>
                )}

                <Dialog
                  open={deleteConfirmOpen}
                  onOpenChange={setDeleteConfirmOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this variant? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteConfirmOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={confirmDelete}
                        disabled={loading} // Optional: disable during API call
                      >
                        {loading ? "Deleting..." : "Delete Variant"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Variant Fields */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-gray-700">Metal</Label>
                    <AddMetalVariantDialog
                      onSuccess={() => {
                        getMetalVariant().then((res) => {
                          setFilterOptions((prev) => ({
                            ...prev,
                            metalVariant: res.data?.data?.metalVariant || [],
                          }));
                        });
                      }}
                    >
                      <div className="text-xs text-gray-500 mb-1 hover:text-gray-700 cursor-pointer">
                        Add Metal
                      </div>
                    </AddMetalVariantDialog>
                  </div>
                  <Select
                    value={variant.metal}
                    onValueChange={(value) =>
                      handleVariantChange(index, "metal", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select metal" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.metalVariant.map((metal) => (
                        <SelectItem key={metal.id} value={metal.id}>
                          {metal?.metalType?.name} - {metal?.purityLabel} - ₹
                          {metal?.metalPriceInGram}/gm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`productVariantData[${index}].metal`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`productVariantData[${index}].metal`]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Metal Weight in Gram</Label>
                  <Input
                    type="number"
                    value={variant.metalWeightGram}
                    onChange={(e) =>
                      handleVariantChange(
                        index,
                        "metalWeightGram",
                        e.target.value
                      )
                    }
                    placeholder="Metal weight"
                    className="w-full no-spinners"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors[`productVariantData[${index}].metalWeightGram`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`productVariantData[${index}].metalWeightGram`]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-gray-700">Metal Color</Label>
                    <AddMetalColorDialog
                      onSuccess={() => {
                        getMetalColor().then((res) => {
                          setFilterOptions((prev) => ({
                            ...prev,
                            metalColor: res.data?.data || [],
                          }));
                        });
                      }}
                    />
                  </div>
                  <Select
                    value={variant.metalColor}
                    onValueChange={(value) =>
                      handleVariantChange(index, "metalColor", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.metalColor.map((metal) => (
                        <SelectItem key={metal.id} value={metal.id}>
                          {metal?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Product Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-gray-700">Product Size</Label>
                    <AddProductSizeDialog
                      onSuccess={() => {
                        getProductSize().then((res) => {
                          setFilterOptions((prev) => ({
                            ...prev,
                            productSize: res.data?.data || [],
                          }));
                        });
                      }}
                    >
                      <div className="text-xs text-gray-500 mb-1 hover:text-gray-700 cursor-pointer">
                        Add Product Size
                      </div>
                    </AddProductSizeDialog>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-md"
                        onClick={() => {
                          if (!formData.jewelleryType) {
                            toast.error("Please select a Jewellery Type first");
                          }
                        }}
                      >
                        {variant.productSize?.length > 0
                          ? `${variant.productSize.length} sizes selected`
                          : "Select sizes"}
                      </Button>
                    </PopoverTrigger>
                    {formData.jewelleryType && (
                      <PopoverContent className="w-[120%] sm:w-[160%] p-0">
                        <Command>
                          <CommandInput placeholder="Search sizes..." />
                          <CommandList>
                            <CommandEmpty>No sizes found.</CommandEmpty>
                            <CommandGroup>
                              {filterOptions.productSize.length === 0 ? (
                                <div>No data available</div>
                              ) : (
                                filterOptions.productSize
                                  .filter(
                                    (size) =>
                                      size.jewelryTypeId ===
                                      formData.jewelleryType
                                  )
                                  .map((size) => (
                                    <CommandItem key={size.id}>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`size-${size.id}`}
                                          checked={variant.productSize?.includes(
                                            size.id
                                          )}
                                          onCheckedChange={(checked) => {
                                            const currentSizes =
                                              variant.productSize || [];
                                            const newSizes = checked
                                              ? [...currentSizes, size.id]
                                              : currentSizes.filter(
                                                  (s) => s !== size.id
                                                );
                                            handleVariantChange(
                                              index,
                                              "productSize",
                                              newSizes
                                            );
                                          }}
                                        />
                                        <label
                                          htmlFor={`size-${size.id}`}
                                          className="text-sm font-medium leading-none"
                                        >
                                          {size.label} - {size.unit}
                                        </label>
                                      </div>
                                    </CommandItem>
                                  ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    )}
                  </Popover>

                  {variant.productSize?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.productSize.map((sizeId) => {
                        const size = filterOptions.productSize.find(
                          (s) => s.id === sizeId
                        );
                        return size ? (
                          <span
                            key={sizeId}
                            className="bg-gray-100 px-2 py-1 rounded-md text-xs"
                          >
                            {size.label} - {size.unit}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-gray-700">Gemstone</Label>
                      <AddGemstoneVariantDialog
                        onSuccess={() => {
                          getGemstoneVariant().then((res) => {
                            setFilterOptions((prev) => ({
                              ...prev,
                              gemstoneVariant:
                                res.data?.data?.gemstoneVariant || [],
                            }));
                          });
                        }}
                      >
                        <div className="text-xs text-gray-500 mb-1 hover:text-gray-700 cursor-pointer">
                          Add Gemstone
                        </div>
                      </AddGemstoneVariantDialog>
                    </div>
                    <Select
                      value={variant.gemstone}
                      onValueChange={(value) =>
                        handleVariantChange(index, "gemstone", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gemstone" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.gemstoneVariant.map((gemstone) => (
                          <SelectItem key={gemstone.id} value={gemstone.id}>
                            {gemstone?.gemstoneType?.name} - {gemstone?.clarity}{" "}
                            - ₹{gemstone?.gemstonePrice} - {gemstone?.color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`productVariantData[${index}].gemstone`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`productVariantData[${index}].gemstone`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Gemstone Weight in Carat
                    </Label>
                    <Input
                      type="number"
                      value={variant.gemstoneWeightCarat}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "gemstoneWeightCarat",
                          e.target.value
                        )
                      }
                      placeholder="Gemstone weight"
                      className="w-full no-spinners"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors[
                      `productVariantData[${index}].gemstoneWeightCarat`
                    ] && (
                      <p className="text-red-500 text-sm">
                        {
                          errors[
                            `productVariantData[${index}].gemstoneWeightCarat`
                          ]
                        }
                      </p>
                    )}
                  </div>

                  {/* Number of Diamonds */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">Number of Diamonds</Label>
                    <Input
                      type="number"
                      value={variant.numberOfDiamonds || ""}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "numberOfDiamonds",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      placeholder="Number of diamonds"
                      className="w-full no-spinners"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Number of Side Diamonds */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Number of Side Diamonds
                    </Label>
                    <Input
                      type="number"
                      value={variant.numberOfSideDiamonds || ""}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "numberOfSideDiamonds",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      placeholder="Number of side diamonds"
                      className="w-full no-spinners"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* Side Diamond Price Per Carat */}
                  <div className="">
                    <Label className="text-gray-700 mb-2">
                      Side Diamond Price (per carat)
                    </Label>
                    <Input
                      type="number"
                      value={variant.sideDiamondPriceCarat || ""}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "sideDiamondPriceCarat",
                          e.target.value ? parseFloat(e.target.value) : null
                        )
                      }
                      placeholder="Price per carat"
                      className="w-full no-spinners"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* Side Diamond Weight */}
                  <div className="">
                    <Label className="text-gray-700 mb-2">
                      Side Diamond Weight (carat)
                    </Label>
                    <Input
                      type="number"
                      value={variant.sideDiamondWeight || ""}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "sideDiamondWeight",
                          e.target.value ? e.target.value : null
                        )
                      }
                      placeholder="Total weight in carat"
                      className="w-full no-spinners"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  <div className="">
                    <Label className="text-gray-700 mb-2">
                      Side Diamond Quality
                    </Label>
                    <Input
                      type="text"
                      value={variant?.sideDiamondQuality || ""}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "sideDiamondQuality",
                          e.target.value ? e.target.value : null
                        )
                      }
                      placeholder="Side diamond quality"
                      className="w-full no-spinners"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Karigar</Label>
                  <Select
                    value={variant.karigar}
                    onValueChange={(value) => {
                      handleVariantChange(index, "karigar", value);
                      setShowKarigarSection(value === "other");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select karigar" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.karigarOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name} - {option.expertise}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-700">
                      Making Charge Weight Range
                    </Label>
                    <AddMakingChargeWeightRangeDialog
                      onSuccess={() => {
                        fetchAllMakingChargeWeightRanges().then((res) => {
                          setFilterOptions((prev) => ({
                            ...prev,
                            makingChargeWeightRangeOptions:
                              res.data?.data?.makingCharges || [],
                          }));
                        });
                      }}
                    />
                  </div>
                  <Select
                    value={variant.makingChargeWeightRangeId}
                    onValueChange={(value) =>
                      handleVariantChange(
                        index,
                        "makingChargeWeightRangeId",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select weight range" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const filteredOptions =
                          filterOptions.makingChargeWeightRangeOptions.filter(
                            (option) =>
                              !variant.metalWeightGram ||
                              (option.minWeight <=
                                parseFloat(variant.metalWeightGram) &&
                                option.maxWeight >=
                                  parseFloat(variant.metalWeightGram))
                          );

                        if (filteredOptions.length === 0) {
                          return (
                            <div className="py-2 px-4 text-sm text-gray-500">
                              No making charge available for this weight
                            </div>
                          );
                        }

                        return filteredOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            Weight Min-{option.minWeight} - Weight Max-
                            {option.maxWeight} -
                            {option?.chargeType === "FIXED" ? "₹" : ""}
                            {option.chargeValue}
                            {option?.chargeType === "PERCENTAGE" ? "%" : ""}
                            (Discount:{" "}
                            {option?.discountType === "FIXED" ? "₹" : ""}
                            {option.discountValue}
                            {option?.discountType === "PERCENTAGE" ? "%" : ""})
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Stock</Label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(index, "stock", e.target.value)
                    }
                    placeholder="Stock quantity"
                    className="w-full no-spinners"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors[`productVariantData[${index}].stock`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`productVariantData[${index}].stock`]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">GST</Label>
                  <Input
                    type="text"
                    value={variant.gst}
                    onChange={(e) =>
                      handleVariantChange(index, "gst", e.target.value)
                    }
                    placeholder="GST"
                    className="w-full"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label
                    htmlFor={`isFeatured-${index}`}
                    className="text-gray-700"
                  >
                    Is Featured
                  </Label>
                  <Select
                    value={variant.isFeatured ? "true" : "false"}
                    onValueChange={(value) =>
                      handleVariantChange(index, "isFeatured", value === "true")
                    }
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                {/* <div className="space-y-2">
                  <Label
                    htmlFor={`isNewArrival-${index}`}
                    className="text-gray-700"
                  >
                    Is New Arrival
                  </Label>
                  <Select
                    value={variant.isNewArrival ? "true" : "false"}
                    onValueChange={(value) =>
                      handleVariantChange(
                        index,
                        "isNewArrival",
                        value === "true"
                      )
                    }
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-700">Return Policy</Label>
                  {/* <Textarea
                    type="text"
                    value={variant.returnPolicy}
                    onChange={(e) =>
                      handleVariantChange(index, "returnPolicy", e.target.value)
                    }
                    placeholder="Return policy"
                    className="w-full"
                  /> */}

                  <JoditEditor
                    ref={editorReturnContent}
                    config={config}
                    value={variant.returnPolicy}
                    onBlur={() => {}}
                    onChange={(newContent) => {
                      handleVariantChange(index, "returnPolicy", newContent);
                    }}
                  />
                  {errors[`productVariantData[${index}].returnPolicy`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`productVariantData[${index}].returnPolicy`]}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-700">Note</Label>
                  {/* <Textarea
                    type="text"
                    value={variant.note}
                    onChange={(e) =>
                      handleVariantChange(index, "note", e.target.value)
                    }
                    placeholder="Note"
                    className="w-full"
                  /> */}
                  <JoditEditor
                    ref={editorNoteContent}
                    config={config}
                    value={variant.note}
                    onBlur={() => {}}
                    onChange={(newContent) => {
                      handleVariantChange(index, "note", newContent);
                    }}
                  />
                  {errors[`productVariantData[${index}].note`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`productVariantData[${index}].note`]}
                    </p>
                  )}
                </div>
                <Card className=" space-y-2 md:col-span-2 p-4 sm:p-6 bg-white mb-6 shadow-sm rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 ">
                    Shipping
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Length</Label>
                      <Input
                        name="length"
                        type="number"
                        value={variant.length}
                        onChange={(e) =>
                          handleVariantChange(index, "length", e.target.value)
                        }
                        placeholder="Mention Length"
                        className="w-full no-spinners"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors[`productVariantData[${index}].length`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`productVariantData[${index}].length`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Width</Label>
                      <Input
                        name="width"
                        value={variant.width}
                        type="number"
                        onChange={(e) =>
                          handleVariantChange(index, "width", e.target.value)
                        }
                        placeholder="Mention Width"
                        className="w-full no-spinners"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors[`productVariantData[${index}].width`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`productVariantData[${index}].width`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 ">
                      <Label className="text-gray-700">Height</Label>
                      <Input
                        name="height"
                        type={"number"}
                        value={variant.height}
                        onChange={(e) =>
                          handleVariantChange(index, "height", e.target.value)
                        }
                        placeholder="Mention Height"
                        className="w-full no-spinners"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors[`productVariantData[${index}].height`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`productVariantData[${index}].height`]}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
                <div className="md:col-span-2 space-y-4">
                  <Label className="text-gray-700">Screw Options</Label>

                  {(variant.screwOption?.length > 0
                    ? variant.screwOption
                    : [{ screwType: "", screwMaterial: "", notes: "" }]
                  ).map((screw, screwIndex) => (
                    <div
                      key={screwIndex}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-4 rounded-lg"
                    >
                      {/* Screw Type */}
                      <div className="space-y-2">
                        <Label className="text-gray-700">Screw Type</Label>
                        <Input
                          value={screw.screwType || ""}
                          onChange={(e) =>
                            handleScrewOptionChange(
                              index,
                              screwIndex,
                              "screwType",
                              e.target.value
                            )
                          }
                          placeholder="Screw Type"
                          className="w-full"
                        />
                      </div>

                      {/* Screw Material */}
                      <div className="space-y-2">
                        <Label className="text-gray-700">Screw Material</Label>
                        <Input
                          value={screw.screwMaterial || ""}
                          onChange={(e) =>
                            handleScrewOptionChange(
                              index,
                              screwIndex,
                              "screwMaterial",
                              e.target.value
                            )
                          }
                          placeholder="Screw Material"
                          className="w-full"
                        />
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label className="text-gray-700">Notes</Label>
                        <Input
                          value={screw.notes || ""}
                          onChange={(e) =>
                            handleScrewOptionChange(
                              index,
                              screwIndex,
                              "notes",
                              e.target.value
                            )
                          }
                          placeholder="Notes"
                          className="w-full"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="md:col-span-3 flex justify-end gap-2">
                        {screw.screwId ? ( // If screw has an ID, it's already saved
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleRemoveScrew(
                                variant.productVariantId,
                                screw.screwId
                              )
                            }
                          >
                            <FiTrash2 className="w-4 h-4" /> Remove
                          </Button>
                        ) : (
                          <>
                            {screwIndex > 0 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="rounded-md"
                                onClick={() =>
                                  removeScrewOption(index, screwIndex)
                                }
                              >
                                <FiTrash2 className="w-4 h-4" /> Cancel
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              className="rounded-md"
                              onClick={() =>
                                handleAddScrew({
                                  productVariantId: variant.productVariantId,
                                  screwType: screw.screwType,
                                  screwMaterial: screw.screwMaterial,
                                  notes: screw.notes,
                                })
                              }
                              disabled={
                                !screw.screwType || !screw.screwMaterial
                              }
                            >
                              Save Screw
                            </Button>
                          </>
                        )}
                        {screwIndex ===
                          (variant.screwOption?.length || 1) - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-md"
                            onClick={() => addScrewOption(index)}
                          >
                            <FiPlus className="w-4 h-4" /> Add Option
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* {variant.isNewArrival && (
                  <div className="space-y-2">
                    <Label className="text-gray-700">New Arrival Until</Label>
                    <Input
                      type="date"
                      value={variant.newArrivalUntil}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "newArrivalUntil",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </div>
                )} */}
                {/* Checkbox */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <Checkbox
                    id={`continueSelling-${index}`}
                    checked={variant.continueSelling}
                    onCheckedChange={(checked) =>
                      handleVariantChange(index, "continueSelling", checked)
                    }
                  />
                  <Label
                    htmlFor={`continueSelling-${index}`}
                    className="text-gray-700 cursor-pointer"
                  >
                    Continuing selling when out of stock
                  </Label>
                </div>
                {/* Image Upload */}
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-gray-700 block mb-2">
                    Upload Media (Images & Videos)
                  </Label>
                  <div className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col justify-center items-center relative hover:border-gray-400 transition-colors p-4">
                    {variant.imagePreviews.length > 0 ? (
                      <div className="w-full">
                        <DndProvider backend={HTML5Backend}>
                          <div
                            className={`flex flex-wrap ${
                              variant.imagePreviews.length > 4
                                ? "justify-between gap-4"
                                : "justify-start gap-10"
                            } items-center mb-4`}
                          >
                            {variant.imagePreviews.map((preview, imgIndex) => (
                              <DraggableImage
                                key={preview.id || imgIndex}
                                id={preview.id || imgIndex}
                                url={preview.url}
                                type={preview.type}
                                index={imgIndex}
                                moveImage={(fromIndex, toIndex) => {
                                  setFormData((prev) => {
                                    const newVariants = [
                                      ...prev.productVariantData,
                                    ];
                                    const newImages = [
                                      ...newVariants[index].images,
                                    ];
                                    const newPreviews = [
                                      ...newVariants[index].imagePreviews,
                                    ];

                                    // Reorder images
                                    const [movedImage] = newImages.splice(
                                      fromIndex,
                                      1
                                    );
                                    newImages.splice(toIndex, 0, movedImage);

                                    // Reorder previews
                                    const [movedPreview] = newPreviews.splice(
                                      fromIndex,
                                      1
                                    );
                                    newPreviews.splice(
                                      toIndex,
                                      0,
                                      movedPreview
                                    );

                                    // Update displayOrder for saved images
                                    const updatedPreviews = newPreviews.map(
                                      (item, idx) => ({
                                        ...item,
                                        displayOrder: idx,
                                      })
                                    );

                                    newVariants[index] = {
                                      ...newVariants[index],
                                      images: newImages,
                                      imagePreviews: updatedPreviews,
                                    };

                                    return {
                                      ...prev,
                                      productVariantData: newVariants,
                                    };
                                  });
                                }}
                                removeImage={(imgIndex) =>
                                  removeVariantImage(index, imgIndex)
                                }
                              />
                            ))}
                          </div>
                        </DndProvider>
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor={`variant-image-${index}`}
                            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer inline-block"
                          >
                            Add More Media
                          </Label>
                          <Button
                            type="button"
                            onClick={() =>
                              saveImageOrder(variant.productVariantId, index)
                            }
                            className="px-4  bg-emerald-500 text-sm text-white rounded-md hover:bg-emerald-700 transition-colors"
                          >
                            Save Order
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-sm mb-3">
                          Drag & drop images/videos or click to browse
                        </p>
                        <Label
                          htmlFor={`variant-image-${index}`}
                          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          Select Files
                        </Label>
                        {errors[`productVariantData[${index}].images`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`productVariantData[${index}].images`]}
                          </p>
                        )}
                      </>
                    )}
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleVariantImageChange(index, e)}
                      className="hidden"
                      id={`variant-image-${index}`}
                      multiple
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Add Variant Button */}
          <Button
            type="button"
            variant="outline"
            className="mb-6 gap-2 rounded-md"
            onClick={() => {
              addVariant();
              setIsVariant({ count: isVariant.count + 1, isVariant: true });
            }}
          >
            <FiPlus className="w-4 h-4" /> Add Variant
          </Button>

          {/* Karigar Section */}
          {showKarigarSection && (
            <Card className="p-4 sm:p-6 bg-white mb-6 shadow-sm rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Karigar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Name</Label>
                  <Input
                    name="karigarName"
                    value={formData.karigarName}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Email-ID</Label>
                  <Input
                    name="karigarEmail"
                    value={formData.karigarEmail}
                    onChange={handleInputChange}
                    placeholder="Your Email Id"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Phone No.</Label>
                  <Input
                    name="karigarPhone"
                    value={formData.karigarPhone}
                    onChange={handleInputChange}
                    placeholder="Your Mobile No."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Location</Label>
                  <Input
                    name="karigarLocation"
                    value={formData.karigarLocation}
                    onChange={handleInputChange}
                    placeholder="Mention Location"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">Expertise</Label>
                  <Input
                    name="karigarExpertise"
                    value={formData.karigarExpertise}
                    onChange={handleInputChange}
                    placeholder="Mention your Expertise"
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-gray-700">Bio</Label>
                  <Textarea
                    name="karigarBio"
                    value={formData.karigarBio}
                    onChange={handleInputChange}
                    placeholder="Your Bio"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* SEO Section */}
          <Card className="p-4 sm:p-6 bg-white mb-6 shadow-sm rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700">Meta Title</Label>
                <Input
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="Meta Title"
                  className="w-full"
                />
                {errors.metaTitle && (
                  <p className="text-red-500 text-sm">{errors.metaTitle}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">Meta Description</Label>
                <Textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="min-h-[100px]"
                />
                {errors.metaDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.metaDescription}
                  </p>
                )}
              </div>

              {/* Meta Keywords (array) */}
              <div className="space-y-2">
                <Label className="text-gray-700">Meta Keywords</Label>
                <div className="space-y-2">
                  {formData.metaKeywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={keyword}
                        onChange={(e) =>
                          handleArrayFieldChange(
                            "metaKeywords",
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter keyword"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeArrayFieldItem("metaKeywords", index)
                        }
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                        disabled={
                          formData.metaKeywords.length <= 1 && index === 0
                        }
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                      {index === formData.metaKeywords.length - 1 && (
                        <Button
                          type="button"
                          variant="edit"
                          size="sm"
                          onClick={() => addArrayFieldItem("metaKeywords", "")}
                          className="gap-2 rounded border-2"
                        >
                          <FiPlus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags (array) */}
              <div className="space-y-2">
                <Label className="text-gray-700">Tags</Label>
                <div className="space-y-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={tag}
                        onChange={(e) =>
                          handleArrayFieldChange("tags", index, e.target.value)
                        }
                        placeholder="Enter tag"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayFieldItem("tags", index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                        disabled={formData.tags.length <= 1 && index === 0}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                      {index === formData.tags.length - 1 && (
                        <Button
                          type="button"
                          variant="edit"
                          size="sm"
                          onClick={() => addArrayFieldItem("tags", "")}
                          className="gap-2 rounded border-2"
                        >
                          <FiPlus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-start pb-8">
            <Button
              type="button"
              variant="edit"
              onClick={() => navigate(-1)}
              className="border-gray-300 hover:bg-gray-50 rounded-md px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-8"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">Updating...</span>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
