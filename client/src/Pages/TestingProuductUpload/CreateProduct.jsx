import { useState } from "react";
import { createProduct } from "../../api/Admin/ProductApi";

const CreateProductForm = () => {
    const [form, setForm] = useState({
        name: "Gold New new Pagination Apply & Diamond Rings & Diamond 18k",
        description: "Gold New new Pagination Apply & Diamond Rings & Diamond 18k",
        jewelryTypeId: "4428ed99-e468-4038-9d1c-f1a90ed83d25",
        collectionId: "80787ddc-18b4-4395-8545-124dece6aea9",
        productStyleId: "f6d0f200-1ac3-4983-af85-5636f2d05d23",
        occasionId: "",
        metaTitle: "Gold ring New - Elegant Jewellery",
        metaDescription: "Gold ring New - Elegant Jewellery",
        metaKeywords: ["ring", "gold", "22k"],
        tags: ["22k", "18k", "22k"],
    });

    const [variants, setVariants] = useState([
        {
            metalVariantId: "a5bb905d-4e4d-4252-99aa-c05bd7700964",
            gemstoneVariantId: "4c49f7ff-9645-4192-ac9f-fb0fe1087a1d",
            metalColorVariantId: "",
            gemstoneColorVariantId: "",
            productSizeId: "076209f6-5e90-4761-bb1c-87a9d533425c",
            makingChargeWeightRangeId: "03466bf1-3b3b-4608-87e9-43614e37cf73",
            karigarId: "",
            metalWeightInGram: 5,
            gemstoneWeightInCarat: 2,
            stock: 10,
            gst: 3,
            isFeatured: false,
            isNewArrival: false,
            newArrivalUntil: "",
            returnPolicyText: "",
            images: [],
        },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (["tags", "metaKeywords"].includes(name)) {
            const arrayValues = value.split(',').map((item) => item.trim()).filter(Boolean);
            setForm({ ...form, [name]: arrayValues });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const handleVariantFileChange = (index, files) => {
        const updated = [...variants];
        updated[index].images = files;
        setVariants(updated);
    };

    const addVariant = () => {
        setVariants([
            ...variants,
            {
                ...variants[0],
                images: [],
            },
        ]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(form).forEach(([key, val]) => {
            if (Array.isArray(val)) {
                val.forEach((item) => formData.append(`${key}[]`, item));
            } else {
                formData.append(key, val);
            }
        });

        const variantDataToSend = variants.map(({ images, ...rest }) => rest);
        formData.append("productVariantData", JSON.stringify(variantDataToSend));

        variants.forEach((variant, idx) => {
            Array.from(variant.images).forEach((file) => {
                formData.append(`variant_${idx}`, file);
            });
        });

        try {
            const res = await createProduct(formData);
            console.log("response created = ", res);
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["name", "description", "jewelryTypeId", "collectionId", "productStyleId", "occasionId", "metaTitle", "metaDescription", "metaKeywords", "tags"].map((field) => (
                        <div key={field} className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">
                                {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                                name={field}
                                value={Array.isArray(form[field]) ? form[field].join(", ") : form[field]}
                                onChange={handleInputChange}
                                required={["name", "jewelryTypeId", "collectionId", "productStyleId"].includes(field)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Product Variants</h3>
                    {variants.map((variant, index) => (
                        <div key={index} className="border rounded-md p-4 mb-4 bg-gray-50 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(variant).filter(key => key !== "images").map((field) => (
                                    <div key={field} className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-700 mb-1">
                                            {field.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        <input
                                            type={["metalWeightInGram", "gemstoneWeightInCarat", "gst", "stock"].includes(field) ? "number" : "text"}
                                            placeholder={field}
                                            value={variant[field]}
                                            onChange={(e) => handleVariantChange(index, field, e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Variant Images
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleVariantFileChange(index, e.target.files)}
                                    className="w-full text-sm"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addVariant}
                        className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded hover:bg-indigo-200"
                    >
                        + Add Variant
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                >
                    Submit Product
                </button>
            </form>
        </div>
    );
};

export default CreateProductForm;
