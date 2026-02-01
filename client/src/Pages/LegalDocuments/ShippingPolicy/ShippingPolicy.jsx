import React, { useEffect } from "react";
import SEOProvider from "../../../components/common/SEOProvider/SEOProvider";

const ShippingPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Shipping Policy | Jupi Diamonds Jewelry - Safe & Insured Delivery"
        description="Details about our secure shipping methods, delivery timelines, packaging standards, and international shipping policies for your precious jewelry orders."
        keywords={[
          "jewelry shipping policy",
          "diamond delivery options",
          "secure jewelry packaging",
          "insured jewelry shipping",
          "international delivery jewelry",
          "jewelry transit protection",
        ]}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 py-6 sm:py-12 bg-white text-[#27282C] leading-relaxed tracking-wide">
        <h1 className="text-xl font-medium text-center mb-6 text-black">
          Shipping Policy
        </h1>
        <p className=" mb-6 md:mb-12 text-sm text-center text-balance sm:text-pretty">
          Thank you for visiting and shopping at Jupi Diamonds. Following are
          the terms and conditions that constitute our Shipping Policy.
        </p>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Shipment Processing Time
          </h2>
          <ul className="list-disc list-outside  space-y-1 ml-7 sm:ml-14 text-sm">
            <li>
              Our typical order processing time for dispatch is between 12 to 15
              business days. It is important to note that shipments are not
              processed or delivered on weekends or public holidays.
            </li>
            <li>
              In cases of increased order volume, minor delays may occur, and we
              thank you for your patience.
            </li>
            <li>
              Please account for additional transit days during the delivery
              phase. If there is a significant delay in shipping your order, we
              will promptly contact you via email or phone to provide updates.
            </li>
            <li>
              Additionally, all shipments are insured and will be delivered by
              one of our trusted partners, including FedEx, DHL, UPS, or USPS.
            </li>
          </ul>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Shipping Rates & Delivery Estimates
          </h2>
          <p className=" mb-6 text-sm sm:ml-12">
            For details regarding shipping costs and projected delivery
            timelines, please consult the information provided below.
          </p>
          <div className="overflow-x-auto mb-1 sm:mb-2 text-sm sm:ml-12">
            <table className="min-w-full text-left  border border-gray-200">
              <thead className="">
                <tr>
                  <th className="px-6 py-8 border border-black text-center">
                    Shipment Method
                  </th>
                  <th className="px-6 py-8 border border-black text-center">
                    Total Arriving Time
                  </th>
                  <th className="px-6 py-8 border border-black text-center">
                    Estimate Dispatch Time
                  </th>
                  <th className="px-6 py-8 border border-black text-center">
                    Estimate Delivery Time
                  </th>
                  <th className="px-6 py-8 border border-black text-center">
                    Shipment Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-8 border border-black text-center">
                    Free Shipping
                  </td>
                  <td className="px-6 py-8 border border-black text-center">
                    17–23 days
                  </td>
                  <td className="px-6 py-8 border border-black text-center">
                    12–15 Business Days
                  </td>
                  <td className="px-6 py-8 border border-black text-center">
                    5–8 Business Days
                  </td>
                  <td className="px-6 py-8 border border-black text-center">
                    Free
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc list-outside  space-y-1 ml-7 sm:ml-20 text-sm">
            <li>
              Once dispatched, you can expect your order to arrive within 7 to
              10 business days, not including the production time for Ring &
              Fine Jewelry. Please be aware that we utilize World Class Shipping
              Company, which may lead to longer delivery times due to its
              distinct operational procedures, possibly causing delays of 3 to 7
              business days within the EU.
            </li>
            <li>
              For orders totalling up to $500, a standard shipping charge of $30
              is applicable within the USA and select countries. In some other
              areas where shipping expenses are elevated, a fee of $50 will be
              charged for orders up to $500.
            </li>
          </ul>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Shipment Confirmation & Order Tracking
          </h2>
          <ul className="list-disc list-outside  space-y-1 ml-7 sm:ml-14 text-sm">
            <li>
              Once your order has been shipped, you will receive a Shipment
              Confirmation email containing active tracking numbers within 24-48
              hours.
            </li>
          </ul>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Customs, Duties, And Taxes
          </h2>
          <ul className="list-disc list-outside  space-y-1 ml-7 sm:ml-14 text-sm">
            <li>
              Customers from India, Hong Kong, or Dubai are exempt from customs
              duties and taxes. Jupi Diamonds disclaims any responsibility for
              customs fees and taxes incurred during or after shipping; these
              charges are the sole responsibility of the customer (including
              tariffs and taxes).
            </li>
            <li>
              Although 99% of packages are delivered punctually, there may be
              occasional delays caused by customs processing or extreme weather
              conditions. Jupi Diamonds cannot be held accountable for these
              delays, as they are outside of our control.
            </li>
            <li>
              Please be advised that if a customer declines to pay the customs
              duty and the shipment is returned to the sender, we will subtract
              the customs duty along with both shipping fees prior to issuing a
              refund upon receipt of the returned item.
            </li>
          </ul>
        </section>

        <section className="mb-6 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-normal mb-1 sm:mb-2">
            Lost/Stolen
          </h2>
          <ul className="list-disc list-outside  space-y-1 ml-7 sm:ml-14 text-sm">
            <li>
              Your shipment is completely covered by insurance throughout its
              journey, and we implement all necessary measures to guarantee its
              secure delivery. A signature will be mandatory for all parcels. In
              the unlikely case of loss, a complete refund will be issued.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default ShippingPolicy;
