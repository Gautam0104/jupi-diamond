import React, { useEffect } from "react";
import { loadScript } from "@paypal/paypal-js";

const PayPalButton = ({ amount, currency, onSuccess, onError, disabled }) => {
  useEffect(() => {
    let paypalButtons;

    const initializePayPal = async () => {
      try {
        const paypal = await loadScript({
          "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
          currency: currency,
          "disable-funding": "credit,card",
        });

        paypalButtons = paypal.Buttons({
          style: {
            layout: "vertical",
            color: "silver",
            shape: "sharp",
            label: "pay",
            height: 40,
            disableMaxWidth: true,
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: currency,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              onSuccess(details);
            } catch (error) {
              console.log("PayPal approval error:", error);
              onError("Payment failed. Please try again.");
            }
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            onError("An error occurred with PayPal. Please try another payment method.");
          },
        });

        if (paypalButtons.isEligible() && !disabled) {
          paypalButtons.render("#paypal-button-container");
        } else if (disabled) {
          document.getElementById("paypal-button-container").innerHTML =
            "<p class='text-sm text-gray-500'>PayPal is not available for this transaction</p>";
        }
      } catch (error) {
        console.error("Failed to load PayPal JS SDK:", error);
        onError("Failed to load PayPal. Please try another payment method.");
      }
    };

    initializePayPal();

    return () => {
      if (paypalButtons) {
        paypalButtons.close();
      }
    };
  }, [amount, currency, onSuccess, onError, disabled]);

  return <div id="paypal-button-container" className="mt-4 w-full font-medium poppins"></div>;
};

export default PayPalButton;