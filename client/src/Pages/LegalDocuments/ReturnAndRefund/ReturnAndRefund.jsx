import React, { useEffect } from "react";
import SEOProvider from "../../../components/common/SEOProvider/SEOProvider";

const ReturnAndRefund = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Return & Refund Policy | Jupi Diamonds - Hassle-Free Returns"
        description="Our transparent return and refund policy ensures satisfaction with your jewelry purchase. Learn about timelines, conditions, and the return process."
        keywords={[
          "jewelry return policy",
          "diamond refund policy",
          "jewelry exchange policy",
          "online jewelry returns",
          "30 day return policy",
          "jewelry warranty information",
        ]}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 py-6 sm:py-12 bg-white  text-[#27282C] tracking-wide leading-relaxed">
        <h1 className="text-xl font-medium mb-6 text-center">
          Return & Refund
        </h1>

        <p className="text-xl  text-start font-normal mb-1 sm:mb-2">
          Effective Date: 1 Sept 2025
        </p>
        <p className=" mb-6 md:mb-12 sm:ml-10 text-sm">
          At Jupi Diamonds, we place a high value on your satisfaction by
          offering a straightforward return and refund policy.{" "}
        </p>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            30-Day Returns & Refund (Worldwide)
          </h2>
          <ul className="list-disc list-outside text-sm  space-y-1 ml-7 sm:ml-10">
            <li>
              <span className="font-medium">Design Preference Returns:</span>{" "}
              Rings/Jewelry can be returned if you’re not satisfied.
            </li>
            <li>
              <span className="font-medium">Defective or Incorrect Items:</span>{" "}
              Report within 30 days with photo evidence for a replacement or
              refund.
            </li>
            <li>
              <span className="font-medium">Free Returns (USA Only):</span>{" "}
              Approved returns within the USA qualify for a prepaid return
              label.
            </li>
            <li>
              <span className="font-medium">
                International Returns & Exchanges:
              </span>{" "}
              Available, but customers must cover return shipping costs.
            </li>
            <li>
              <span className="font-medium">Return Condition:</span> Items must
              be in original condition with box & certification (GIA, IGI).
            </li>
            <li>
              <span className="font-medium">Not Accepted:</span>{" "}
              Customized/engraved items, worn/damaged products, and wrong-size
              orders.
            </li>
            <li className="font-medium">
              One return/exchange per order, max four per year.
            </li>
          </ul>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Exchange & Refund Process
          </h2>
          <ul className="list-disc list-outside text-sm  space-y-1 ml-7 sm:ml-10">
            <li>
              <span className="font-medium">Contact Us:</span> Email
              support@Jupidiamonds.com with your order number and request.
              You'll usually get a reply within 24 hours on working days.
            </li>
            <li>
              <span className="font-medium">Approval & Instructions:</span> If
              approved, we provide return/exchange details.
            </li>
            <li>
              <span className="font-medium">Inspection & Processing:</span>
            </li>
            <ul className="list-disc list-outside text-sm ml-5">
              <li>
                <span className="font-medium">Refunds:</span> You will receive
                your refund within 7 business days after the item has been
                received in its original condition.
              </li>
              <li>
                <span className="font-medium">Exchanges:</span> Processed
                quickly once you select your new design.
              </li>
            </ul>
          </ul>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Free Resizing & Repair Compensation
          </h2>
          <ul className="list-disc list-outside text-sm  space-y-1 ml-7 sm:ml-10">
            <li>
              <span className="font-medium">
                One-Time Free Resizing (Worldwide):
              </span>{" "}
              Covered up to $75 if resizing is required within 30 days.
            </li>
            <li>
              <span className="font-medium">Local Repairs:</span> We may
              reimburse up to $75 for minor repair costs.
            </li>
          </ul>
          <p className="text-sm text-gray-600 mt-2 sm:ml-10">
            Note: Customers are required to visit the nearest local jewelry
            store for resizing or minor repairs. We provide reimbursement of up
            to $75 for both services within a 30-day period. Please note that
            pickup and in-house repairs are not offered.
          </p>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Order Cancellations
          </h2>
          <ul className="list-disc list-outside text-sm  space-y-1 ml-7 sm:ml-10">
            <li>
              Orders can be cancelled within 48 hours before production starts.
            </li>
            <li>
              If the customer refuses to pay custom duties, no refund or
              exchange will be provided.
            </li>
          </ul>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Fair Usage & Policy Updates
          </h2>
          <ul className="list-disc list-outside text-sm  space-y-1 ml-7 sm:ml-10">
            <li>
              Returns may be denied in cases of excessive use or improper
              handling.
            </li>
            <li>
              Jupi Diamonds retains the authority to amend this policy at any
              time without prior notification.
            </li>
          </ul>
        </section>
        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            contact us at{" "}
            <span className="font-medium">support@Jupidiamonds.com</span>
          </h2>
        </section>
      </div>
    </>
  );
};

export default ReturnAndRefund;
