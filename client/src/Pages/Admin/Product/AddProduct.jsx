import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  getKarigarDetails,
  getProductSize,
  getProductStyle,
} from "../../../api/Admin/ProductApi";
import { getGlobalDiscounts } from "../../../api/Admin/GlobalDiscount";
import { getOccassion } from "../../../api/Admin/OccationAPi";
import { getCollection } from "../../../api/Admin/CollectionApi";
import { createProduct } from "../../../api/Admin/ProductApi";
import { toast } from "sonner";
import AddMetalColorDialog from "./AddMetalColorDialog";
import JoditEditor from "jodit-react";
import * as Yup from "yup";
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
import AddMetalVariantDialog from "./AddMetalVariantDialog";
import AddGemstoneVariantDialog from "./AddGemstoneVariantDialog";
import AddProductSizeDialog from "./AddProductSizeDialog";
import AddMakingChargeWeightRangeDialog from "./AddMakingChargeWeightRangeDialog";

const DRAFT_KEY = "product_drafts";
const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showKarigarSection, setShowKarigarSection] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() => {
    // Check for draft ID in URL (for editing)
    const searchParams = new URLSearchParams(window.location.search);
    const editDraftId = searchParams.get("editDraft");

    if (editDraftId) {
      const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY)) || [];
      const draftToEdit = drafts.find((draft) => draft.id === editDraftId);
      if (draftToEdit) {
        setDraftId(editDraftId);
        return draftToEdit.data;
      }
    }

    // Default empty form
    return {
      title: "",
      productStyle: [],
      collection: [],
      description: "",
      occasion: [],
      jewelleryType: "",

      // Shipping
      length: "",
      width: "",
      height: "",
      // Karigar
      karigarName: "",
      karigarEmail: "",
      karigarPhone: "",
      karigarLocation: "",
      karigarExpertise: "",
      karigarBio: "",
      // SEO
      metaTitle: "",
      metaDescription: "",
      // Arrays
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
          stock: 0,
          gst: "",
          // isFeatured: false,
          // isNewArrival: false,
          // newArrivalUntil: "",
          numberOfDiamonds: null,
          numberOfSideDiamonds: null,
          sideDiamondPriceCarat: null,
          sideDiamondWeight: null,
          sideDiamondQuality: null,
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
    };
  });

  useEffect(() => {
    const saveDraft = debounce(() => {
      try {
        setIsSaving(true);
        const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY)) || [];

        const draftData = {
          id: draftId || Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          data: formData,
        };

        if (draftId) {
          // Update existing draft
          const index = drafts.findIndex((d) => d.id === draftId);
          if (index !== -1) {
            drafts[index] = draftData;
          }
        } else {
          // Add new draft
          drafts.push(draftData);
          setDraftId(draftData.id);
        }

        localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
      } catch (error) {
        console.log("Failed to save draft:", error);
      }
      setIsSaving(false);
    }, 1000);
    // Debounce to avoid saving too frequently

    saveDraft();

    return () => saveDraft.cancel();
  }, [formData, draftId]);

  // Debounce helper function
  function debounce(func, wait) {
    let timeout;

    const debounced = function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };

    debounced.cancel = function () {
      clearTimeout(timeout);
    };

    return debounced;
  }

  const handleCleanupOldDrafts = () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 days old

    const updatedDrafts = drafts.filter(
      (draft) => new Date(draft.updatedAt) > cutoffDate
    );

    localStorage.setItem(DRAFT_KEY, JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
  };

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

  useEffect(() => {
    const fetchAllFilterOptions = async () => {
      setLoading(true);
      try {
        const promises = [
          getMetalVariant().catch(() => ({
            data: { data: { metalVariant: [] } },
          })),
          getGemstoneVariant().catch(() => ({
            data: { data: { gemstoneVariant: [] } },
          })),
          fetchGlobalMakingCharges().catch(() => ({ data: { data: [] } })),
          getJewelleryType().catch(() => ({
            data: { data: { jewelryType: [] } },
          })),
          getProductSize().catch(() => ({ data: { data: [] } })),
          getGlobalDiscounts().catch(() => ({ data: { data: [] } })),
          getOccassion().catch(() => ({ data: { data: { result: [] } } })),
          getProductStyle().catch(() => ({ data: { data: { result: [] } } })),
          getCollection().catch(() => ({ data: { data: { collection: [] } } })),
          fetchAllMakingChargeWeightRanges().catch(() => ({
            data: { data: { makingCharges: [] } },
          })),
          getKarigarDetails().catch(() => ({ data: { data: [] } })),
          getMetalColor().catch(() => ({ data: { data: [] } })),
        ];

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
        ] = await Promise.all(promises);

        setFilterOptions({
          metalVariant: metalVariantRes.data?.data?.metalVariant || [],
          gemstoneVariant: gemstoneVariantRes.data?.data?.gemstoneVariant || [],
          makingCharge: makingChargeRes.data?.data || [],
          jewelleryType: jewelleryTypeRes.data?.data.jewelryType || [],
          productSize: productSizeRes.data?.data?.result || [],
          globalDiscounts: globalDiscountsRes.data?.data || [],
          occasion: occasionRes.data?.data.result || [],
          productStyle: productStyleRes.data?.data.result || [],
          collection: collectionRes.data?.data?.collection || [],
          makingChargeWeightRangeOptions:
            makingChargeWeightRangesRes.data?.data.makingCharges || [],
          karigarOptions: karigarDetailsRes.data?.data || [],
          metalColor: metalColorRes.data?.data || [],
        });
      } catch (error) {
        console.log("Error in Promise.all setup:", error);
        // Initialize all filter options as empty arrays in case of a major error
        setFilterOptions({
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
      } finally {
        setLoading(false);
      }
    };

    fetchAllFilterOptions();
  }, []);

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

  // Array field handlers
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
            // maxWeight: weight,
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

  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = [];
    const newFiles = [];

    files.forEach((file) => {
      const fileType = file.type;
      const isVideo = fileType.startsWith("video/");

      if (isVideo) {
        newPreviews.push({
          url: URL.createObjectURL(file),
          type: fileType,
        });
        newFiles.push(file);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            url: reader.result,
            type: fileType,
          });
          newFiles.push(file);

          // Update state when all files are processed
          if (newPreviews.length === files.length) {
            setFormData((prev) => {
              const newVariants = [...prev.productVariantData];
              newVariants[index] = {
                ...newVariants[index],
                images: [...newVariants[index].images, ...newFiles],
                imagePreviews: [
                  ...newVariants[index].imagePreviews,
                  ...newPreviews,
                ],
              };
              return { ...prev, productVariantData: newVariants };
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // For videos, we need to update state immediately
    if (files.some((file) => file.type.startsWith("video/"))) {
      setFormData((prev) => {
        const newVariants = [...prev.productVariantData];
        newVariants[index] = {
          ...newVariants[index],
          images: [...newVariants[index].images, ...newFiles],
          imagePreviews: [...newVariants[index].imagePreviews, ...newPreviews],
        };
        return { ...prev, productVariantData: newVariants };
      });
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    setFormData((prev) => {
      const newVariants = [...prev.productVariantData];
      const previewToRemove =
        newVariants[variantIndex].imagePreviews[imageIndex];

      // Revoke object URL if it's a video
      if (previewToRemove.type?.startsWith("video/")) {
        URL.revokeObjectURL(previewToRemove.url);
      }

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
  };

  const removeVariant = (index) => {
    setFormData((prev) => {
      if (prev.productVariantData.length <= 1) return prev; // don't allow removing the last variant
      const updatedVariants = [...prev.productVariantData];
      updatedVariants.splice(index, 1);
      return {
        ...prev,
        productVariantData: updatedVariants,
      };
    });
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
          // isFeatured: false,
          // isNewArrival: false,
          numberOfDiamonds: null,
          numberOfSideDiamonds: null,
          sideDiamondPriceCarat: null,
          sideDiamondWeight: null,
          sideDiamondQuality: null,
          // newArrivalUntil: "",
          returnPolicy: "",
          note: "",
          screwOption: [{ screwType: "", screwMaterial: "", notes: "" }],
          continueSelling: false,
          images: [], // Changed to array
          imagePreviews: [], // Changed to array
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

          gemstoneWeightCarat: Yup.string().test(
            "required-if-gemstone",
            "Gemstone weight in carat is required",
            function (value) {
              const { gemstone } = this.parent;
              return !gemstone || (value && value.trim() !== "");
            }
          ),
          screwOption: Yup.array()
            .of(
              Yup.object().shape({
                screwType: Yup.string().nullable(),
                screwMaterial: Yup.string().nullable(),
                notes: Yup.string().nullable(),
              })
            )
            .nullable(),
          stock: Yup.string().required("Stock is required"),
          numberOfDiamonds: Yup.number().nullable(),
          numberOfSideDiamonds: Yup.number().nullable(),
          sideDiamondPriceCarat: Yup.number().nullable(),
          sideDiamondWeight: Yup.number().nullable(),
          sideDiamondQuality: Yup.string().nullable(),
          returnPolicy: Yup.string().required("Return policy is required"),
          note: Yup.string().nullable(),
          length: Yup.number().required("Length is required"),
          width: Yup.number().required("Width is required"),
          height: Yup.number().required("Height is required"),
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
          toast.error(firstError.message);
        }
      } else {
        // fallback error handling
        toast.error(err.message || "Validation failed");
      }

      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateFields();
    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all the required fields as before
      formDataToSend.append("name", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("jewelryTypeId", formData.jewelleryType);
      // formDataToSend.append("collectionId", formData.collection);
      // formDataToSend.append("productStyleId", formData.productStyle);
      formDataToSend.append("metaTitle", formData.metaTitle);
      formDataToSend.append("metaDescription", formData.metaDescription);
      // formDataToSend.append("occasionId", formData.occasion);

      formDataToSend.append("karigarName", formData.karigarName);
      formDataToSend.append("karigarEmail", formData.karigarEmail);
      formDataToSend.append("karigarPhone", formData.karigarPhone);
      formDataToSend.append("karigarLocation", formData.karigarLocation);
      formDataToSend.append("karigarExpertise", formData.karigarExpertise);
      formDataToSend.append("karigarBio", formData.karigarBio);

      formData.productStyle.forEach((styleId) => {
        formDataToSend.append("productStyleId[]", styleId);
      });

      formData.occasion.forEach((occasionId) => {
        formDataToSend.append("occasionId[]", occasionId);
      });

      formData.collection.forEach((collectionId) => {
        formDataToSend.append("collectionId[]", collectionId);
      });

      // Append metaKeywords array
      formData.metaKeywords.forEach((keyword, index) => {
        if (keyword) {
          formDataToSend.append(`metaKeywords[]`, keyword);
        }
      });

      // Append tags array
      formData.tags.forEach((tag, index) => {
        if (tag) {
          formDataToSend.append(`tags[]`, tag);
        }
      });

      // Handle product variants - only required fields

      formData.productVariantData.forEach((variant, index) => {
        // formDataToSend.append(
        //   `productVariantData[${index}][screwOption]`,
        //   variant.screwOption.length
        //     ? JSON.stringify(variant.screwOption)
        //     : null
        // );

        if (variant.screwOption && variant.screwOption.length > 0) {
          variant.screwOption.forEach((screw, screwIndex) => {
            formDataToSend.append(
              `productVariantData[${index}][screwOption][${screwIndex}][screwType]`,
              screw.screwType || ""
            );
            formDataToSend.append(
              `productVariantData[${index}][screwOption][${screwIndex}][screwMaterial]`,
              screw.screwMaterial || ""
            );
            formDataToSend.append(
              `productVariantData[${index}][screwOption][${screwIndex}][notes]`,
              screw.notes || ""
            );
          });
        }

        formDataToSend.append(
          `productVariantData[${index}][metalVariantId]`,
          variant.metal
        );
        formDataToSend.append(
          `productVariantData[${index}][gemstoneVariantId]`,
          variant.gemstone
        );
        formDataToSend.append(
          `productVariantData[${index}][makingChargeWeightRangeId]`,
          variant.makingChargeWeightRangeId
        );
        formDataToSend.append(
          `productVariantData[${index}][metalWeightInGram]`,
          variant.metalWeightGram
        );

        formDataToSend.append(
          `productVariantData[${index}][metalColorId]`,
          variant.metalColor
        );

        formDataToSend.append(
          `productVariantData[${index}][gemstoneWeightInCarat]`,
          variant.gemstoneWeightCarat
        );
        formDataToSend.append(
          `productVariantData[${index}][productSizeId]`,
          JSON.stringify(variant.productSize || [])
        );
        formDataToSend.append(
          `productVariantData[${index}][occasionId]`,
          formData.occasion
        );
        formDataToSend.append(
          `productVariantData[${index}][stock]`,
          variant.stock
        );
        formDataToSend.append(`productVariantData[${index}][gst]`, variant.gst);
        formDataToSend.append(
          `productVariantData[${index}][numberOfDiamonds]`,
          variant.numberOfDiamonds || ""
        );
        formDataToSend.append(
          `productVariantData[${index}][numberOfSideDiamonds]`,
          variant.numberOfSideDiamonds || ""
        );
        formDataToSend.append(
          `productVariantData[${index}][sideDiamondPriceCarat]`,
          variant.sideDiamondPriceCarat || ""
        );
        formDataToSend.append(
          `productVariantData[${index}][sideDiamondWeight]`,
          variant.sideDiamondWeight || ""
        );
        formDataToSend.append(
          `productVariantData[${index}][sideDiamondQuality]`,
          variant.sideDiamondQuality || ""
        );

        formDataToSend.append(
          `productVariantData[${index}][returnPolicyText]`,
          variant.returnPolicy
        );
        formDataToSend.append(
          `productVariantData[${index}][note]`,
          variant.note
        );
        // formDataToSend.append(
        //   `productVariantData[${index}][isFeatured]`,
        //   variant.isFeatured ? "true" : "false"
        // );
        // formDataToSend.append(
        //   `productVariantData[${index}][isNewArrival]`,
        //   variant.isNewArrival ? "true" : "false"
        // );
        // formDataToSend.append(
        //   `productVariantData[${index}][newArrivalUntil]`,
        //   variant.newArrivalUntil || ""
        // );
        formDataToSend.append(
          `productVariantData[${index}][continueSelling]`,
          variant.continueSelling ? "true" : "false"
        );
        formDataToSend.append(
          `productVariantData[${index}][karigarId]`,
          variant.karigar || ""
        );
        formDataToSend.append(
          `productVariantData[${index}][length]`,
          variant.length || ""
        );
        formDataToSend.append(
          `productVariantData[${index}][width]`,
          variant.width || ""
        );
        formDataToSend.append(
          `productVariantData[${index}][height]`,
          variant.height || ""
        );

        // Append all images for this variant with the correct field name
        variant.images.forEach((image, imgIndex) => {
          formDataToSend.append(`variant_${index}`, image);
        });
      });
      // console.log("formData=", formData);
      debugger;
      const response = await createProduct(formDataToSend);
      if (response.status === 201) {
        toast.success("Product created successfully!");
        navigate("/admin/product/all-products");
      } else {
        toast.error(response.data?.message || "Failed to create product");
      }
    } catch (error) {
      console.log("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const editorContent = useRef(null);
  const editorReturnContent = useRef(null);
  const editorNoteContent = useRef(null);

  /* The most important point*/
  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
      },
      readonly: false,
    }),
    []
  );

  return (
    <>
      <div className="w-full  mx-auto ">
        {/* Header Section */}
        <div className="mb-3 sm:mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {" "}
            Add Product
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
                    <PopoverContent className="w-[120%] sm:w-[160%] p-0">
                      <Command>
                        <CommandInput placeholder="Search styles..." />
                        <CommandList>
                          {filterOptions.productStyle.filter(
                            (style) =>
                              style.jewelryTypeId === formData.jewelleryType
                          ).length > 0 ? (
                            <CommandGroup>
                              {filterOptions.productStyle
                                .filter(
                                  (style) =>
                                    style.jewelryTypeId ===
                                    formData.jewelleryType
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
                                          const currentStyles = [
                                            ...formData.productStyle,
                                          ];
                                          const newStyles = checked
                                            ? [...currentStyles, style.id]
                                            : currentStyles.filter(
                                                (s) => s !== style.id
                                              );
                                          handleSelectChange(
                                            "productStyle",
                                            newStyles
                                          );
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
                          ) : (
                            <CommandEmpty>
                              No styles available for this jewellery type
                            </CommandEmpty>
                          )}
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
                  <PopoverContent className="w-[120%] sm:w-[160%] p-0">
                    <Command>
                      <CommandInput placeholder="Search collections..." />
                      <CommandList>
                        {filterOptions.collection.length > 0 ? (
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
                                      const currentCollections = [
                                        ...formData.collection,
                                      ];
                                      const newCollections = checked
                                        ? [...currentCollections, collection.id]
                                        : currentCollections.filter(
                                            (c) => c !== collection.id
                                          );
                                      handleSelectChange(
                                        "collection",
                                        newCollections
                                      );
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
                        ) : (
                          <CommandEmpty>No collections available</CommandEmpty>
                        )}
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
                  <PopoverContent className="w-[120%] sm:w-[160%] p-0">
                    <Command>
                      <CommandInput placeholder="Search occasions..." />
                      <CommandList>
                        {filterOptions.occasion.length > 0 ? (
                          <CommandGroup>
                            {filterOptions.occasion.map((occ) => (
                              <CommandItem key={occ.id}>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`occasion-${occ.id}`}
                                    checked={formData.occasion.includes(occ.id)}
                                    onCheckedChange={(checked) => {
                                      const currentOccasions = [
                                        ...formData.occasion,
                                      ];
                                      const newOccasions = checked
                                        ? [...currentOccasions, occ.id]
                                        : currentOccasions.filter(
                                            (o) => o !== occ.id
                                          );
                                      handleSelectChange(
                                        "occasion",
                                        newOccasions
                                      );
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
                        ) : (
                          <CommandEmpty>No occasions available</CommandEmpty>
                        )}
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
                    onClick={() => removeVariant(index)}
                    className="gap-2 rounded-md"
                  >
                    <FiTrash2 className="w-4 h-4" /> Remove
                  </Button>
                )}
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
                      {filterOptions.metalVariant.length === 0 ? (
                        <div>No data available</div>
                      ) : (
                        filterOptions.metalVariant.map((metal) => (
                          <SelectItem key={metal.id} value={metal.id}>
                            {metal?.metalType?.name} - {metal?.purityLabel} - ₹
                            {metal?.metalPriceInGram}/gm
                          </SelectItem>
                        ))
                      )}
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

                {/* Metal Color */}
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
                            {filterOptions.productSize.filter(
                              (size) =>
                                size.jewelryTypeId === formData.jewelleryType
                            ).length > 0 ? (
                              <CommandGroup>
                                {filterOptions.productSize
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
                                          {size.label || size.labelSize} -{" "}
                                          {size.unit}{" "}
                                          {size?.circumference && (
                                            <span>{`(${
                                              size?.circumference || "-"
                                            })`}</span>
                                          )}
                                        </label>
                                      </div>
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            ) : (
                              <CommandEmpty>
                                No sizes available for this jewellery type
                              </CommandEmpty>
                            )}
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
                            {size.label} - {size.unit}{" "}
                            {size?.circumference && (
                              <span>{`(${size?.circumference || "-"})`}</span>
                            )}
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
                  <div className="space-y-2">
                    <Label className="text-gray-700">
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
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* Side Diamond Weight */}
                  <div className="space-y-2">
                    <Label className="text-gray-700">
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
                      onWheel={(e) => e.target.blur()}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Side Diamond Quality
                    </Label>
                    <Input
                      type="text"
                      value={variant.sideDiamondQuality || ""}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "sideDiamondQuality",
                          e.target.value ? e.target.value : null
                        )
                      }
                      placeholder="Side Diamond Quality"
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
                    type="number"
                    value={variant.gst}
                    onChange={(e) =>
                      handleVariantChange(index, "gst", e.target.value)
                    }
                    placeholder="GST"
                    className="w-full no-spinners"
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
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
                    value={formData.returnPolicy}
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

                <Card className="space-y-2 md:col-span-2 p-4 sm:p-6 bg-white mb-6 shadow-sm rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-0">
                    Shipping
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Length</Label>
                      <Input
                        name="length"
                        type="number"
                        value={variant.length || ""}
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
                      {errors.length && (
                        <p className="text-red-500 text-sm">{errors.length}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Width</Label>
                      <Input
                        name="width"
                        type="number"
                        value={variant.width || ""}
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
                      {errors.width && (
                        <p className="text-red-500 text-sm">{errors.width}</p>
                      )}
                    </div>
                    <div className="space-y-2 ">
                      <Label className="text-gray-700">Height</Label>
                      <Input
                        name="height"
                        type="number"
                        value={variant.height || ""}
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
                      {errors.height && (
                        <p className="text-red-500 text-sm">{errors.height}</p>
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
                        {screwIndex > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeScrewOption(index, screwIndex)}
                          >
                            <FiTrash2 className="w-4 h-4" /> Remove
                          </Button>
                        )}
                        {screwIndex ===
                          (variant.screwOption?.length || 1) - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
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
                        <div
                          className={`flex flex-wrap ${
                            variant.imagePreviews.length > 4
                              ? "justify-between gap-4"
                              : "justify-start gap-10"
                          } items-center  mb-4`}
                        >
                          {variant.imagePreviews.map((preview, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative h-40 w-40 rounded-md overflow-hidden aspect-square bg-gray-200 shadow-md"
                            >
                              {preview.type?.startsWith("video/") ? (
                                <video
                                  controls
                                  className="h-full w-full object-cover"
                                >
                                  <source
                                    src={preview.url}
                                    type={preview.type}
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <img
                                  src={preview.url}
                                  alt={`Variant preview ${imgIndex + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 p-1 rounded-full shadow-md h-6 w-6"
                                onClick={() =>
                                  removeVariantImage(index, imgIndex)
                                }
                              >
                                <FiTrash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Label
                          htmlFor={`variant-image-${index}`}
                          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer inline-block"
                        >
                          Add More Media
                        </Label>
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
            onClick={addVariant}
          >
            <FiPlus className="w-4 h-4" /> Add Variant
          </Button>

          {/* Shipping Section */}

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
              className="border-gray-300 hover:bg-gray-50 rounded-md px-8"
              onClick={() => {
                setFormData({
                  title: "",
                  productStyle: [],
                  collection: [],
                  description: "",
                  occasion: [],
                  jewelleryType: "",

                  length: "",
                  width: "",
                  height: "",

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
                      productSize: "",
                      makingChargeCategorySetId: "",
                      makingChargeWeightRangeId: "",
                      karigar: "",
                      metalWeightGram: "",
                      gemstoneWeightCarat: "",
                      stock: "",
                      gst: "",
                      // isFeatured: false,
                      // isNewArrival: false,
                      // newArrivalUntil: "",
                      returnPolicy: "",
                      note: "",
                      screwOption: [],
                      continueSelling: false,
                      images: [],
                      imagePreviews: [],
                    },
                  ],
                });
                setShowKarigarSection(false);
                setErrors({});
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-8"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
