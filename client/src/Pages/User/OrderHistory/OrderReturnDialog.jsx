import React, { useState } from "react";
import { toast } from "react-toastify";
import { customerOrderReturn } from "../../../api/User/returnOrderApi";
import { fetchOrdersByUser } from "../../../api/Public/publicApi";

export default function ReturnOrderDialog({ open, onClose, orderId, backendUrl }) {
    const [photos, setPhotos] = useState([]);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos((prev) => [...prev, ...files]);
    };

    const removePhoto = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const fetchData = async () => {
        try {
            const response = await fetchOrdersByUser({

            });

        } catch (err) {
            console.log(err.message);
        }
    };

    const handleSubmit = async () => {
        if (!reason || photos.length === 0) {
            toast.error("Please enter a reason and select at least one photo");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("orderId", orderId);
            formData.append("reason", reason);
            photos.forEach((photo) => {
                formData.append("photos", photo);
            });


            const data = await customerOrderReturn(formData, orderId)
            if (data?.data?.success) {
                toast.success("Order return request submitted successfully");
                setReason("");
                setPhotos([]);
                fetchData()
                onClose(); // ✅ Close only on success
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while submitting the return request");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Return Order</h2>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Reason for return:
                </label>
                <textarea
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Upload Photos:
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="mb-2"
                />

                <div className="flex flex-wrap gap-2 mb-4">
                    {photos.map((file, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-20 h-20 object-cover rounded"
                            />
                            <button
                                onClick={() => removePhoto(index)}
                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Return"}
                    </button>
                </div>
            </div>
        </div>
    );
}
