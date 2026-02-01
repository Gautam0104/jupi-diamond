import React, { useState } from "react";
import { useCart } from "../../Context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CurrencyContext } from "../../Context/CurrencyContext";
import { useContext } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { getUserAddress, createUserAddress } from "../../api/User/AddressApi";
import useAuth from "../../Hooks/useAuth";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  applyCoupon,
  applyGift,
  createOrder,
  verifyRazorpayPayment,
} from "../../api/Public/publicApi";
import { ImHome3 } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import Select from "react-select";
import countryList from "country-list";
import { City, State, Country } from "country-state-city";
import { toast } from "sonner";
import { IoImage } from "react-icons/io5";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { formatSizeUnit } from "../../lib/sizeUtils";

const addressTypes = [
  { value: "HOME", label: "Home" },
  { value: "OFFICE", label: "Office" },
];

const Checkout = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const countryOptions = countryList.getData().map((country) => ({
    label: country.name,
    value: country.name,
    code: country.code,
  }));
  const { convertPrice, currency, getCurrencySymbol, switchCurrency } =
    useContext(CurrencyContext);
  const [couponCode, setCouponCode] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [couponId, setCouponId] = useState("");
  const [giftId, setGiftId] = useState("");
  const [couponMessage, setCouponMessage] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isGiftApplied, setIsGiftApplied] = useState(false);
  const [couponData, setCouponData] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [giftData, setGiftData] = useState(false);
  const [giftMessage, setGiftMessage] = useState(null);
  const [giftLoading, setGiftLoading] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const { cartData, loading } = useCart();
  const [payLoading, setPayLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.code); // Changed from getStatesByCountry
      setStates(
        countryStates.map((state) => ({
          label: state.name,
          value: state.name,
          code: state.isoCode,
        }))
      );
      setSelectedState(null);
      setCities([]);
      setSelectedCity(null);
      addressForm.setFieldValue("country", selectedCountry.value);
      addressForm.setFieldValue("state", "");
      addressForm.setFieldValue("city", "");
    }
  }, [selectedCountry]);

  // When state changes, load its cities
  useEffect(() => {
    if (selectedState && selectedCountry) {
      const stateCities = City.getCitiesOfState(
        // Changed from getCitiesByState
        selectedCountry.code,
        selectedState.code
      );
      setCities(
        stateCities.map((city) => ({
          label: city.name,
          value: city.name,
        }))
      );
      setSelectedCity(null);
      addressForm.setFieldValue("state", selectedState.value);
      addressForm.setFieldValue("city", "");
    }
  }, [selectedState]);

  // When city changes, update form value
  useEffect(() => {
    if (selectedCity) {
      addressForm.setFieldValue("city", selectedCity.value);
    }
  }, [selectedCity]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getUserAddress();
        if (response.data.data && user) {
          const formattedAddresses = response.data.data.map((address) => ({
            id: address.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            address: `${address.houseNo}, ${address.street}, ${address.landMark}, ${address.city}, ${address.postalCode}, ${address.state}, ${address.country}.`,
            mobile: address.phone || user.phone || "",
            panNumber: address.panNumber || "",
            gstNumber: address.gstNumber || "",
            tag: address.addressType,
            isDefault: address.isBilling,
            rawAddress: address,
          }));
          setAddresses(formattedAddresses);
          // Set the default address as selected if available
          const defaultAddress = response.data.data.find(
            (addr) => addr.isBilling
          );
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!loading && (!cartData || cartData?.cart?.cartItems?.length === 0)) {
      navigate("/shop-all");
    }
  }, [cartData, loading, navigate]);

  const addressForm = useFormik({
    initialValues: {
      houseNo: "",
      landMark: "",
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: user?.phone || "",
      panNumber: "",
      gstNumber: "",
      isBilling: false,
      addressType: "HOME",
    },
    validationSchema: Yup.object({
      houseNo: Yup.string().required("House number is required"),
      landMark: Yup.string().required("Landmark is required"),
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      postalCode: Yup.string().required("Postal code is required"),
      phone: Yup.string().required("Phone number is required"),
      panNumber: Yup.string().nullable(),
      gstNumber: Yup.string().nullable(),
      addressType: Yup.string().required("Address type is required"),
    }),
    onSubmit: async (values) => {
      setFormLoading(true);
      try {
        const response = await createUserAddress(values);
        if (response.status === 201) {
          const newAddresses = await getUserAddress();
          if (newAddresses.data.data && user) {
            const formattedAddresses = newAddresses.data.data.map(
              (address) => ({
                id: address.id,
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                address: `${address.houseNo}, ${address.street}, ${address.landMark}, ${address.city}, ${address.postalCode}, ${address.state}, ${address.country}`,
                mobile: address.phone || user.phone || "",
                panNumber: address.panNumber || "",
                gstNumber: address.gstNumber || "",
                tag: address.addressType,
                isDefault: address.isBilling,
                rawAddress: address,
              })
            );
            setAddresses(formattedAddresses);
            // Set the newly created address as selected
            setSelectedAddress(response.data.data);
          }
          setShowAddressForm(false);
          addressForm.resetForm();
        }
      } catch (error) {
        console.log("Error creating address:", error);
      } finally {
        setFormLoading(false);
      }
    },
  });

  const AddressCard = ({
    id,
    name,
    address,
    mobile,
    tag,
    isDefault,
    rawAddress,
    panNumber,
    gstNumber,
  }) => {
    return (
      <div
        className={`bg-white shadow-md border p-4 mb-6 cursor-pointer ${
          selectedAddress?.id === id ? "border-2 border-b-4 border-brown" : ""
        }`}
        onClick={() => setSelectedAddress(rawAddress)}
      >
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col w-full">
            <p className="font-medium">{name}</p>
            <p className="mt-1 text-xs sm:text-sm">{address}</p>
            <div
              className={`${
                selectedAddress?.id === id ? "text-brown" : ""
              } mt-2 flex flex-col justify-between items-start gap-1 w-full`}
            >
              <p className=" font-medium">Mobile: {mobile}</p>
              {panNumber && (
                <p className=" font-medium">PAN Number: {panNumber}</p>
              )}
              {gstNumber && (
                <p className=" font-medium">GST Number: {gstNumber}</p>
              )}
            </div>
          </div>
          <span
            className={`text-[10px] sm:text-xs  px-3 py-1 ${
              selectedAddress?.id === id ? "bg-brown" : "bg-gray-300 "
            }  rounded-full text-white`}
          >
            {tag}
          </span>
        </div>
        {isDefault && (
          <span className="inline-block mt-2 text-xs bg-brown text-white px-2 py-1 rounded">
            Default
          </span>
        )}
      </div>
    );
  };

  const displayPrice = (price) => {
    // if(isGiftApplied){
    //    price=price-giftData?.value
    // }

    // let giftValue=0

    // if(isGiftApplied){
    //    giftValue=giftData?.value
    // }
    // price=price-giftValue

    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const renderProductImages = (productVariant, isCartItem = false) => (
    <div
      className={`relative ${
        isCartItem
          ? "w-16 h-16  md:w-16 md:h-16 aspect-square"
          : "w-full aspect-square"
      }`}
    >
      <Swiper
        loop={true}
        pagination={
          !isCartItem
            ? {
                clickable: true,
              }
            : false
        }
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className={`${isCartItem ? "w-full h-full" : "w-full aspect-square"}`}
      >
        {productVariant.productVariantImage.length === 0 ? (
          <SwiperSlide>
            <div className="flex items-center bg-gray-200 justify-center border border-dashed border-gray-300 h-full w-full">
              <span className="text-gray-400 text-xl font-semibold">
                <IoImage />
              </span>
            </div>
          </SwiperSlide>
        ) : (
          productVariant.productVariantImage.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}-${index}`}>
              {image.imageUrl.endsWith(".mp4") ? (
                <video
                  src={image.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label={`${productVariant.productVariantTitle} video ${
                    index + 1
                  }`}
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={`${productVariant.productVariantTitle} - ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponMessage(null);

    try {
      const response = await applyCoupon({
        code: couponCode,
        cartId: cartData?.cart?.id,
      });

      if (response.data.success) {
        setCouponMessage("Coupon applied successfully!");
        setIsCouponApplied(true);
        setCouponId(response.data?.data?.couponId);
        setCouponData(response.data?.data);
        toast.success("Coupon applied successfully!");

        // You might want to update cart data here if the API returns updated cart info
      } else {
        toast.error(response.data.message || "Failed to apply coupon");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponMessage(
        error.response?.data?.message || "Failed to apply coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleGift = async () => {
    if (!giftCode.trim()) {
      setGiftMessage("Please Enter a Git  code");
      return;
    }
    setGiftLoading(true);
    setGiftMessage(null);

    try {
      console.log(cartData);

      const response = await applyGift({
        code: giftCode,
        orderValue: cartData?.cartSummery.grandTotal,
      });

      if (response.data.success) {
        setGiftMessage("Gift applied successfully!");
        setIsGiftApplied(true);
        setGiftId(response.data?.data?.giftId);
        setGiftData(response?.data?.data);
        toast.success("Gift applied successfully!");

        // You might want to update cart data here if the API returns updated cart info
      } else {
        toast.error(response.data.message || "Failed to apply gift card");
      }
    } catch (error) {
      console.error("Error applying gift:", error);
      setGiftMessage(error.response?.data?.message || "Failed to apply gift");
    } finally {
      setGiftLoading(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      setError("Please select a shipping address");

      return;
    }

    if (!cartData?.cart?.cartItems || cartData.cart.cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    setError(null);
    setPayLoading(true);
    try {
      const finalAmount =
        (isCouponApplied
          ? couponData?.finalAmount
          : cartData?.cartSummery.grandTotal) -
        (isGiftApplied ? giftData?.value || 0 : 0);

      const orderData = {
        customerId: user?.id,
        addressId: selectedAddress.id,
        paymentMethod: paymentMethod === "razorpay" ? "RAZORPAY" : "PAYPAL",
        totalAmount: cartData?.cartSummery.subTotal || 0,
        gstAmount: "0",
        // currency: currency === "INR" ? "INR" : "USD",
        currency:
          paymentMethod === "paypal"
            ? "USD"
            : currency === "INR"
            ? "INR"
            : "USD",
        discountAmount: cartData?.cartSummery.totalDiscount || 0,
        finalAmount: finalAmount,
        couponId: isCouponApplied ? couponId : null,
        giftCardId: isGiftApplied ? giftId : null,
        orderItems: cartData?.cart?.cartItems.map((item) => ({
          productVariantId: item.productVariant.id,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtAddition,
          gst: "0",
          total: item.priceAtAddition * item.quantity,
        })),
      };

      const orderResponse = await createOrder(orderData);

      if (paymentMethod === "razorpay") {
        // const orderResponse = await createOrder(orderData);

        if (orderResponse?.data) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => {
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: convertPrice(orderData.finalAmount) * 100,
              currency: currency,
              name: "Jupi Diamonds",
              image: "/jupi-logo.png",
              description: "Order Payment",
              order_id: orderResponse?.data?.data?.orderDetail?.id,
              handler: async function (response) {
                try {
                  const verificationData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId: orderResponse?.data?.data?.id, // Assuming your API returns the orderId
                  };

                  const verificationResponse = await verifyRazorpayPayment(
                    verificationData
                  );
                  if (verificationResponse.status === 200) {
                    console.log("Payment verified:", verificationResponse.data);
                    navigate(`/payment/success`);
                    setTimeout(() => {
                      navigate(`/user/order-history`);
                    }, 6000);
                  } else {
                    console.log(
                      "Payment verification failed:",
                      verificationResponse.data
                    );
                    navigate(`/payment/failed`);
                  }
                } catch (error) {
                  console.log("Error verifying payment:", error);
                  toast.error(
                    "Error verifying payment. Please contact support."
                  );
                }
              },
              prefill: {
                name: `${user?.firstName} ${user?.lastName}`,
                email: user?.email,
                contact: selectedAddress.phone || user?.phone,
              },
              theme: {
                color: "#ce967e",
              },
              method: {
                upi: true,
              },
              modal: {
                ondismiss: function () {
                  // toast.info("Payment cancelled by user.");
                  setGiftCode("");
                  setGiftId("");
                  setIsGiftApplied(false);
                  setGiftData("");
                  setGiftMessage("");

                  // navigate("/payment/failed");
                },
              },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        }
      } else if (paymentMethod === "paypal") {
        if (orderResponse?.data) {
          const paypalScript = document.createElement("script");
          paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${
            import.meta.env.VITE_PAYPAL_CLIENT_ID
          }&currency=USD`;
          paypalScript.onload = () => {
            window.paypal
              .Buttons({
                createOrder: function (data, actions) {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: finalAmount.toFixed(2), // Use finalAmount from above
                        },
                        description: "Order Payment - Jupi Diamonds",
                      },
                    ],
                  });
                },
                onApprove: async function (data, actions) {
                  const captureResult = await actions.order.capture();

                  // You may want to send `captureResult` to backend to mark the order as paid
                  // Example:
                  const verificationResponse = await verifyPaypalPayment({
                    orderId: orderResponse?.data?.data?.id,
                    paypalOrderId: data.orderID,
                    paypalPaymentId: captureResult.id,
                  });

                  if (verificationResponse.status === 200) {
                    console.log(
                      "PayPal payment verified:",
                      verificationResponse.data
                    );
                    navigate(`/payment/success`);
                    setTimeout(() => {
                      navigate(`/user/order-history`);
                    }, 6000);
                  } else {
                    console.log(
                      "PayPal verification failed:",
                      verificationResponse.data
                    );
                    navigate(`/payment/failed`);
                  }
                },
                onError: function (err) {
                  console.error("PayPal payment error:", err);
                  toast.error("PayPal payment failed. Please try again.");
                  navigate("/payment/failed");
                },
                onCancel: function () {
                  toast.info("Payment cancelled.");
                },
              })
              .render("#paypal-button-container"); // This container should exist on your page
          };
          document.body.appendChild(paypalScript);
        }
        return;
      }
    } catch (error) {
      console.log("Error creating order:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setError("Failed to create order. Please try again.");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen 2xl:container mx-auto bg-white p-3 sm:p-6 md:p-12 grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="md:col-span-3 text-xs sm:text-sm lg:col-span-2 xl:col-span-3 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-[14px] sm:text-lg">
              Shipping Address
            </h2>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-brown text-white px-4 py-2 rounded text-[10px] sm:text-sm"
              >
                Add New Address
              </button>
            )}
          </div>

          {showAddressForm ? (
            <div className="bg-white  p-0 mb-6">
              <h3 className="font-medium mb-4">Add New Address</h3>
              <form onSubmit={addressForm.handleSubmit} autoComplete="off">
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex-1">
                    <Select
                      name="country"
                      options={countryOptions}
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                      placeholder="Select country"
                      className="country-select"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: "2px solid #868686",
                          padding: "0px 4px",
                          minHeight: "38px",
                          "@media (max-width: 640px)": {
                            padding: "0px 0px",
                            fontSize: "12px",
                            minHeight: "34px",
                          },
                          borderRadius: "0",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#868686",
                          },
                          "&:focus-within": {
                            borderColor: "#868686",
                          },
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: "4px",
                          "@media (min-width: 640px)": {
                            padding: "2px",
                          },
                          color: "#6b7280",
                        }),
                        indicatorSeparator: () => ({}),
                        option: (base, { isSelected }) => ({
                          ...base,
                          backgroundColor: isSelected ? "#f3f4f6" : "white",
                          color: "#111827",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                          },
                        }),
                      }}
                    />
                    {addressForm.touched.country &&
                    addressForm.errors.country ? (
                      <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                        {addressForm.errors.country}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="houseNo"
                      placeholder="House No/Building Name"
                      className="w-full border-2 border-gray px-2 sm:px-4 py-2"
                      value={addressForm.values.houseNo}
                      onChange={addressForm.handleChange}
                      onBlur={addressForm.handleBlur}
                    />
                    {addressForm.touched.houseNo &&
                    addressForm.errors.houseNo ? (
                      <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                        {addressForm.errors.houseNo}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <Select
                      name="addressType"
                      options={addressTypes}
                      value={addressTypes.find(
                        (opt) => opt.value === addressForm.values.addressType
                      )}
                      onChange={(selected) =>
                        addressForm.setFieldValue("addressType", selected.value)
                      }
                      onBlur={addressForm.handleBlur("addressType")}
                      placeholder="Select address type"
                      className="address-type-select"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: "2px solid #868686",
                          padding: "0px 4px",
                          minHeight: "38px",
                          "@media (max-width: 640px)": {
                            padding: "0px 0px",
                            fontSize: "12px",
                            minHeight: "34px",
                          },
                          borderRadius: "0",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#868686",
                          },
                          "&:focus-within": {
                            borderColor: "#868686",
                          },
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: "4px",
                          "@media (min-width: 640px)": {
                            padding: "2px",
                          },
                          color: "#6b7280",
                        }),
                        indicatorSeparator: () => ({}),
                        option: (base, { isSelected }) => ({
                          ...base,
                          backgroundColor: isSelected ? "#f3f4f6" : "white",
                          color: "#111827",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                          },
                        }),
                      }}
                    />
                    {addressForm.touched.addressType &&
                    addressForm.errors.addressType ? (
                      <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                        {addressForm.errors.addressType}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-row gap-2 sm:gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="landMark"
                        placeholder="Landmark"
                        className="w-full border-2 border-gray px-2 sm:px-4 py-2"
                        value={addressForm.values.landMark}
                        onChange={addressForm.handleChange}
                        onBlur={addressForm.handleBlur}
                      />
                      {addressForm.touched.landMark &&
                      addressForm.errors.landMark ? (
                        <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                          {addressForm.errors.landMark}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        name="street"
                        placeholder="Street"
                        className="w-full border-2 border-gray px-2 sm:px-4 py-2"
                        value={addressForm.values.street}
                        onChange={addressForm.handleChange}
                        onBlur={addressForm.handleBlur}
                      />
                      {addressForm.touched.street &&
                      addressForm.errors.street ? (
                        <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                          {addressForm.errors.street}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                    <div className="flex-2 flex flex-row gap-2 sm:gap-2">
                      <div className="flex-1">
                        <Select
                          name="state"
                          options={states}
                          value={selectedState}
                          onChange={setSelectedState}
                          placeholder="Select state"
                          isDisabled={!selectedCountry}
                          className="state-select"
                          classNamePrefix="select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: "2px solid #868686",
                              padding: "0px 4px",
                              minHeight: "38px",
                              "@media (max-width: 640px)": {
                                padding: "0px 0px",
                                fontSize: "12px",
                                minHeight: "34px",
                              },
                              borderRadius: "0",
                              boxShadow: "none",
                              "&:hover": {
                                borderColor: "#868686",
                              },
                              "&:focus-within": {
                                borderColor: "#868686",
                              },
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: "4px",
                              "@media (min-width: 640px)": {
                                padding: "2px",
                              },
                              color: "#6b7280",
                            }),
                            indicatorSeparator: () => ({}),
                            option: (base, { isSelected }) => ({
                              ...base,
                              backgroundColor: isSelected ? "#f3f4f6" : "white",
                              color: "#111827",
                              "&:hover": {
                                backgroundColor: "#f3f4f6",
                              },
                            }),
                          }}
                        />
                        {addressForm.touched.state &&
                        addressForm.errors.state ? (
                          <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                            {addressForm.errors.state}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <Select
                          name="city"
                          options={cities}
                          value={selectedCity}
                          onChange={setSelectedCity}
                          placeholder="Select city"
                          isDisabled={!selectedState}
                          className="city-select"
                          classNamePrefix="select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: "2px solid #868686",
                              padding: "0px 4px",
                              minHeight: "38px",
                              "@media (max-width: 640px)": {
                                padding: "0px 0px",
                                fontSize: "12px",
                                minHeight: "34px",
                              },
                              borderRadius: "0",
                              boxShadow: "none",
                              "&:hover": {
                                borderColor: "#868686",
                              },
                              "&:focus-within": {
                                borderColor: "#868686",
                              },
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: "4px",
                              "@media (min-width: 640px)": {
                                padding: "2px",
                              },
                              color: "#6b7280",
                            }),
                            indicatorSeparator: () => ({}),
                            option: (base, { isSelected }) => ({
                              ...base,
                              backgroundColor: isSelected ? "#f3f4f6" : "white",
                              color: "#111827",
                              "&:hover": {
                                backgroundColor: "#f3f4f6",
                              },
                            }),
                          }}
                        />
                        {addressForm.touched.city && addressForm.errors.city ? (
                          <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                            {addressForm.errors.city}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        className="w-full border-2 border-gray px-2 sm:px-4 py-2"
                        value={addressForm.values.postalCode}
                        onChange={addressForm.handleChange}
                        onBlur={addressForm.handleBlur}
                      />
                      {addressForm.touched.postalCode &&
                      addressForm.errors.postalCode ? (
                        <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                          {addressForm.errors.postalCode}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full border-2 border-gray px-2 sm:px-4 py-2"
                        value={addressForm.values.phone}
                        onChange={addressForm.handleChange}
                        onBlur={addressForm.handleBlur}
                      />
                      {addressForm.touched.phone && addressForm.errors.phone ? (
                        <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                          {addressForm.errors.phone}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex-2 flex flex-row gap-2 sm:gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          name="panNumber"
                          placeholder="PAN Number"
                          className="w-full border-2 border-gray px-2 sm:px-4 py-2"
                          value={addressForm.values.panNumber}
                          onChange={addressForm.handleChange}
                          onBlur={addressForm.handleBlur}
                        />
                        {addressForm.touched.panNumber &&
                        addressForm.errors.panNumber ? (
                          <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                            {addressForm.errors.panNumber}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          name="gstNumber"
                          placeholder="GST Number"
                          className="w-full border-2 border-gray px-2 sm:px-4 py-2"
                          value={addressForm.values.gstNumber}
                          onChange={addressForm.handleChange}
                          onBlur={addressForm.handleBlur}
                        />
                        {addressForm.touched.gstNumber &&
                        addressForm.errors.gstNumber ? (
                          <div className="text-red-500 text-[11px] sm:text-xs mt-1">
                            {addressForm.errors.gstNumber}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isBilling"
                      id="isBilling"
                      className="mr-2"
                      checked={addressForm.values.isBilling}
                      onChange={addressForm.handleChange}
                    />
                    <label htmlFor="isBilling">Set as billing address</label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        addressForm.resetForm();
                      }}
                      className="px-4 py-2 cp border border-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="px-4 py-2 cp bg-brown text-white rounded"
                    >
                      {formLoading ? (
                        <span className="animate-pulse">Saving...</span>
                      ) : (
                        "Save Address"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <>
              {isLoading ? (
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
                </div>
              ) : addresses.length > 0 ? (
                addresses.map((address) => (
                  <AddressCard key={address.id} {...address} />
                ))
              ) : (
                <div className="bg-white shadow-md border p-4 mb-6 text-center">
                  <p>No addresses found. Please add an address.</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-2 bg-brown text-white px-4 py-2 rounded text-sm"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <h2 className="font-medium text-md sm:text-lg mb-2">
            Shipping Method
          </h2>
        </div>

        <div>
          <h2 className="font-medium text-md sm:text-lg mb-2">Payment</h2>
          <div className="space-y-4">
            <label className="flex items-center border-2 border-gray px-4 py-2 ">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={() => {
                  setPaymentMethod("razorpay");
                  setShowPayPalButton(false);
                  switchCurrency("INR");
                }}
                className="mr-2"
              />
              Razorpay Payment Gateway
            </label>

            <label className="flex items-center border-2 border-gray px-4 py-2 ">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => {
                  setPaymentMethod("paypal");
                  setShowPayPalButton(true);
                  switchCurrency("USD");
                }}
                className="mr-2"
              />
              PayPal
            </label>
          </div>
        </div>

        <div>
          <h2 className="font-medium text-md sm:text-lg mb-2">
            Billing Address
          </h2>
          <div className="space-y-4">
            <label className="flex items-center border-2 border-gray px-4 py-2 ">
              <input
                type="radio"
                checked={billingSameAsShipping}
                onChange={() => setBillingSameAsShipping(true)}
                className="mr-2"
              />
              Same as Shipping address
            </label>
            <label className="flex items-center border-2 border-gray px-4 py-2 ">
              <input
                type="radio"
                checked={!billingSameAsShipping}
                onChange={() => setBillingSameAsShipping(false)}
                className="mr-2"
              />
              Use a different billing address
            </label>
          </div>
        </div>
        {paymentMethod === "paypal" && (
          <button
            type="button"
            onClick={handleOrderSubmit}
            disabled={payLoading || !cartData?.cart?.cartItems?.length}
            className="w-full bg-yellow-400 text-black pt-2 mt-0 font-semibold rounded-md hover:bg-yellow-500 shadow-sm"
          >
            {payLoading ? (
              <span className="animate-pulse">Processing PayPal...</span>
            ) : (
              <>
                <img
                  src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-large.png"
                  alt="Pay with PayPal"
                  className="h-5 inline-block mr-2"
                />
                Pay with PayPal
              </>
            )}
            <div id="paypal-button-container" className="mt-2" />
          </button>
        )}

        {paymentMethod !== "paypal" && (
          <button
            type="button"
            onClick={handleOrderSubmit}
            disabled={payLoading || !cartData?.cart?.cartItems?.length}
            className="w-full bg-brown cursor-pointer hover:shadow-md text-white py-3 mt-4 font-medium"
          >
            {payLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              "Place Order"
            )}
          </button>
        )}
      </div>

      <div className="bg-[#F6DCD3] p-4 md:col-span-2 lg:col-span-3 xl:col-span-2 space-y-4 h-fit">
        <div className="space-y-2 py-5 px-0 sm:px-5 overflow-y-auto h-auto sm:h-[200px] scrollbarWidthThin">
          {loading ? (
            <div className="space-y-2 overflow-y-auto h-[200px] scrollbarWidthThin">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Skeleton className="h-14 w-16 bg-white" />
                  <div className="flex justify-between w-full items-start">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32 sm:w-40 bg-white" />
                      <Skeleton className="h-3 w-24 bg-white" />
                    </div>
                    <div className="space-y-1 text-right">
                      <Skeleton className="h-4 w-16 ml-auto bg-white" />
                      <Skeleton className="h-3 w-12 ml-auto bg-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartData?.cart?.cartItems.length > 0 ? (
            cartData?.cart?.cartItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {renderProductImages(item.productVariant, true)}
                <div className="flex justify-between w-full items-start">
                  <div className="max-w-[300px]">
                    <Link
                      to={`/shop-all/details/${item.productVariant?.productVariantSlug}`}
                      className="hover:text-black hover:underline"
                    >
                      <p className="text-xs sm:text-sm  font-medium text-wrap ">
                        {item.productVariant.productVariantTitle}
                      </p>
                    </Link>
                    {/* Display size if available */}
                    {item.productSize && (
                      <p className="text-xs text-balance font-normal">
                        Size:{" "}
                        {item.productSize?.label || item.productSize?.labelSize}{" "}
                        {item.productVariant?.products?.jewelryType?.name.toLowerCase() ===
                        "bangles"
                          ? ""
                          : formatSizeUnit(item.productSize?.unit)}
                        {}{" "}
                        {item.productSize?.circumference
                          ? `- ${item.productSize?.circumference}`
                          : ""}
                        {item.productVariant?.products?.jewelryType?.name.toLowerCase() ===
                        "bangles"
                          ? formatSizeUnit(item.productSize?.unit)
                          : ""}
                        {}{" "}
                      </p>
                    )}
                    {/* Display screw option if available */}
                    {item.screwOption && (
                      <p className="text-xs text-balance font-normal">
                        Screw: {item.screwOption.screwType} (
                        {item.screwOption.screwMaterial})
                      </p>
                    )}
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-right text-xs sm:text-sm font-medium">
                      {displayPrice(item.priceAtAddition)}
                    </p>
                    <p className="text-xs text-balance font-normal">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs">GST: {item?.productVariant?.gst}%</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              Your cart is empty. Add items to proceed.
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 text-xs sm:text-sm ">
            <div className="flex flex-col w-full sm:w-[70%] gap-0">
              <input
                type="text"
                placeholder="Referral Code"
                className="w-full border-2 bg-white border-gray px-3 py-2"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={isCouponApplied}
              />
              {couponMessage && (
                <p
                  className={`text-xs mt-1 ${
                    isCouponApplied ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {couponMessage}
                </p>
              )}
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={couponLoading || isCouponApplied}
              className={`${
                isCouponApplied ? "bg-green-100" : "bg-lightBrown"
              } cursor-pointer py-2 w-[30%] border border-black`}
            >
              {couponLoading
                ? "Applying..."
                : isCouponApplied
                ? "Applied"
                : "Apply"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5 text-xs sm:text-sm ">
            <div className="flex flex-col w-full sm:w-[70%] gap-0">
              <input
                type="text"
                placeholder="Gift Card Code"
                className="w-full border-2 bg-white border-gray px-3 py-2"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                disabled={isGiftApplied}
              />
              {giftMessage && (
                <p
                  className={`text-xs mt-1 ${
                    isGiftApplied ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {giftMessage}
                </p>
              )}
            </div>
            <button
              onClick={handleGift}
              disabled={giftLoading || isGiftApplied}
              className={`${
                isGiftApplied ? "bg-green-100" : "bg-lightBrown"
              } cursor-pointer py-2 w-[30%] border border-black`}
            >
              {giftLoading
                ? "Applying..."
                : isGiftApplied
                ? "Applied"
                : "Apply"}
            </button>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="text-sm space-y-2 mt-10 text-black">
          {cartData?.cartSummery.subTotal > 0 && (
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{displayPrice(cartData?.cartSummery.subTotal)}</span>
            </div>
          )}
          {cartData?.cartSummery.totalDiscount > 0 && (
            <div className="flex justify-between">
              <span>Order discount:</span>
              <span>-{displayPrice(cartData?.cartSummery.totalDiscount)}</span>
            </div>
          )}
          {isCouponApplied && (
            <div className="flex justify-between">
              <span>Coupon discount:</span>
              <span>-{displayPrice(couponData.discountAmount)}</span>
            </div>
          )}

          {isGiftApplied && (
            <div className="flex justify-between">
              <span>Gift discount:</span>
              <span>-{displayPrice(giftData?.value)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-medium text-black text-md sm:text-lg">
            <span>Total:</span>
            <span>
              {isCouponApplied
                ? displayPrice(
                    (couponData?.finalAmount || 0) -
                      (isGiftApplied ? giftData?.value || 0 : 0)
                  )
                : displayPrice(
                    (cartData?.cartSummery.grandTotal || 0) -
                      (isGiftApplied ? giftData?.value || 0 : 0)
                  )}
            </span>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
