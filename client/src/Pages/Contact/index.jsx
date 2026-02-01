import React, { useEffect } from "react";
import HeadOfficeLocation from "./HeadOfficeLocation";
import ContactForm from "./ContactForm";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const Contact = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <SEOProvider
      title="Contact Jupi Diamonds | Customer Support & Inquiries"
        description="Reach out to Jupi Diamonds Jewelry for inquiries, custom orders, or customer support. Visit our store, call, or message us for assistance with your jewelry needs."
        keywords={[
          "contact jewelry store",
          "jewelry customer service",
          "custom order inquiry",
          "jewelry store contact",
          "diamond jewelry questions",
          "jewelry support",
        ]}
        url={window.location.href}
      />
      <section className="text-center pt-5  sm:pt-10 pb-5">
        <h2 className="text-2xl md:text-2xl font-medium mb-2">Contact Us</h2>
        <ContactForm />
        <HeadOfficeLocation />
      </section>
    </>
  );
};

export default Contact;
