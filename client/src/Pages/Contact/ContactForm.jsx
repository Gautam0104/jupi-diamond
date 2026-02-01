import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonLoading from "../../components/Loaders/ButtonLoading";
import axios from "axios";
import { toast } from "sonner";
import { submitContactForm } from "../../api/Public/publicApi";

export default function ContactForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      agreeToTerms: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().required("Message is required"),
      agreeToTerms: Yup.boolean()
        .oneOf([true], "You must accept the terms and conditions")
        .required("You must accept the terms and conditions"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await submitContactForm({
          name: values.name,
          email: values.email,
          phone: values.phone,
          subject: values.subject,
          message: values.message,
        });
        toast.success("Message submitted successfully !!");
        setTimeout(() => {
          resetForm();
        }, 2000);
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="p-4 sm:p-10 bg-white">
      <h2 className="text-xl sm:text-3xl text-start font-normal mb-3 sm:mb-6">
        Let's Connect With Us
      </h2>
      <div className="bg-[#cc9378] p-4 sm:p-8 marcellus text-xs  sm:text-sm">
        <form
          className="space-y-4"
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="p-4 w-full bg-gray-100 outline-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-white text-start text-xs sm:text-sm mt-1">
                  {formik.errors.name} *
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="p-4 w-full bg-gray-100 outline-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
              />
              {formik.touched.subject && formik.errors.subject ? (
                <div className="text-white text-start text-xs sm:text-sm mt-1">
                  {formik.errors.subject} *
                </div>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Your Phone Number"
                className="p-4 w-full bg-gray-100 outline-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-white text-start text-xs sm:text-sm mt-1">
                  {formik.errors.phone} *
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email Id"
                className="p-4 w-full bg-gray-100 outline-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-white text-start text-xs sm:text-sm mt-1">
                  {formik.errors.email} *
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <textarea
              name="message"
              rows="5"
              placeholder="Message Here"
              className="p-4 w-full bg-gray-100 outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
            />
            {formik.touched.message && formik.errors.message ? (
              <div className="text-white text-start text-xs sm:text-sm mt-0">
                {formik.errors.message} *
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-5 items-center justify-between">
            <label className="flex items-center text-xs sm:text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                className="mr-2 focus:outline-none rounded-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.agreeToTerms}
              />
              I Agree To Terms & Condition
            </label>
            <button
              type="submit"
              disabled={
                formik.isSubmitting ||
                (formik.touched.agreeToTerms && formik.errors.agreeToTerms)
              }
              className="animated-button bg-black text-white px-6 py-2 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <ButtonLoading />
              ) : (
                <>
                  Let's Talk
                  <span className="text-lg text-black bg-white rounded-full py-2 px-2">
                    <BsArrowRight />
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
