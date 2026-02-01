import React, { useEffect } from "react";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

export default function PaymentOptions() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEOProvider
        title="Secure Payment Options | Jupi Diamonds"
        description="Explore our secure payment methods including credit cards, EMI options, and bank transfers. We offer flexible payment solutions for your jewelry purchases."
        keywords={[
          "jewelry payment options",
          "buy now pay later jewelry",
          "secure jewelry payments",
          "EMI for diamonds",
          "jewelry financing",
          "credit card payment jewelry",
        ]}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 md:px-12 lg:px-14 xl:px-4 py-6 sm:py-12 text-[#27282C] tracking-wide leading-relaxed">
        <h2 className="text-center text-xl font-medium mb-3 sm:mb-6 text-black">
          Payment Options
        </h2>
        <p className="text-center text-xs sm:text-sm mb-12 font-normal max-w-5xl mx-auto">
          At Jupi Diamonds Jewelry, we strive to make your shopping experience
          seamless and convenient. To accommodate your needs, we offer a variety
          of secure payment options for your purchases.
        </p>

        <h3 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
          Accepted Payment Methods
        </h3>

        <ul className="list-disc list-inside space-y-6 max-w-6xl mx-auto">
          <li>
            <span className="font-medium text-xs sm:text-sm">Razorpay as Gateway</span>
            <p className="mt-1 ml-0 text-xs sm:text-sm text-gray-700 ">
              Razorpay is a payment gateway and financial services company based
              in India that enables businesses to accept, process, and disburse
              payments through various online and offline channels. It provides
              a range of services, including payment processing for credit and
              debit cards, net banking, UPI, and digital wallets.
            </p>

            <p className="mt-2 ml-4 text-xs sm:text-sm font-medium">
              Safety of Using Razorpay
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 ml-12 mt-1 space-y-1 ">
              <li>
                <span className="font-medium">Regulatory Compliance:</span>{" "}
                Razorpay is compliant with the Payment Card Industry Data
                Security Standard (PCI DSS).
              </li>
              <li>
                <span className="font-medium">Encryption:</span> The platform
                uses encryption protocols to protect sensitive payment
                information during transactions.
              </li>
              <li>
                <span className="font-medium">Fraud Detection:</span> Razorpay
                employs advanced fraud detection mechanisms.
              </li>
              <li>
                <span className="font-medium">User Authentication:</span> It
                supports various authentication methods, including OTP
                verification.
              </li>
            </ul>
          </li>

          <li>
            <span className="font-medium text-xs sm:text-sm">PayPal</span>
            <p className="mt-1 ml-0 text-xs sm:text-sm text-gray-700">
              PayPal is generally considered safe for international
              transactions, including sending money to India. It uses 128-bit
              data security encryption and offers buyer protection. It's widely
              used for international payments and is a trusted platform for
              receiving and making payments.
            </p>
          </li>

          <li>
            <span className="font-medium text-xs sm:text-sm">
              In-store payments (for our Gurugram location)
            </span>
            <ul className="list-disc list-inside ml-14 mt-1 text-xs sm:text-sm text-gray-700">
              <li>Cash</li>
              <li>Credit/Debit Cards</li>
              <li>Contactless Payments</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-md sm:text-xl font-normal mt-10 mb-1 sm:mb-2">
          Security & Privacy
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 max-w-6xl mx-auto">
          Your security is our top priority. All online transactions are
          encrypted with SSL technology, ensuring your personal and financial
          information remains safe and confidential.
        </p>

        <h3 className="text-md sm:text-xl font-normal mt-10 mb-1 sm:mb-2">
          Questions?
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 max-w-6xl mx-auto">
          If you have any questions or need assistance with payments, please
          contact our customer service team. We're here to help make your
          purchase as effortless as possible.
        </p>
      </div>
    </>
  );
}
