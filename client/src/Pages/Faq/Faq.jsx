import React, { useEffect, useState } from "react";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const faqData = [
  {
    title: "About Jupi Diamonds",
    items: [
      {
        q: "What is Jupi Diamonds?",
        a: "Jupi Diamonds focuses on the design and distribution of lab-created diamonds and fine jewelry. The company is committed to producing and providing high-quality, sustainable diamonds that cater to the preferences of discerning clientele.\n \n At Jupi Diamonds, our brand distinguishes itself through an unparalleled blend of superior craftsmanship, classic design, and a dedication to ethically sourced diamonds. We emphasize quality and customer satisfaction, guaranteeing that every engagement and wedding ring narrates a story as unique as the love it symbolizes.",
      },
      {
        q: "What steps do you implement to guarantee the sourcing of conflict-free diamonds?",
        a: "Jupi Diamonds ensures the provision of conflict-free diamonds by strictly following the Kimberley Process and conducting thorough vetting of suppliers, thereby guaranteeing ethical and sustainable sourcing.",
      },
      {
        q: "What Makes Purchasing From You The Optimal Decision?",
        a: "At Jupi Diamonds, we source the finest diamonds and meticulously cut them with state-of-the-art equipment. Our expert artisans guarantee superior quality in every piece of jewelry. Each item from Jupi Diamonds is accompanied by a diamond certificate for added assurance. We collaborate with the most esteemed jewelers in the area to deliver exceptional craftsmanship.",
      },
      {
        q: "Do you provide wholesale options?",
        a: "We invite you to explore wholesale opportunities for small businesses or bulk jewelry orders. Please reach out to us directly via email or messenger to initiate the process.",
      },
      {
        q: "Is My Personal Information Shared?",
        a: "Your personal information remains strictly confidential and is never disclosed or sold to external parties.",
      },
      {
        q: "How Is My Personal Data Protected?",
        a: "The confidential information you provide during your transactions with us is fully secured and protected using state-of-the-art encryption methods.",
      },
    ],
  },
  {
    title: "Lab Grown Diamonds",
    items: [
      {
        q: "Do They Resemble Diamonds Formed on Earth? If Not, What Distinguishes Them?",
        a: "Synthetic diamonds and natural diamonds possess identical appearances and chemical compositions, exhibiting the same brilliance.",
      },
      {
        q: "Will I Get A Paper Certificate And Report For The Lab, Or Is It All Digital?",
        a: "A lab-created diamond is accompanied by a comprehensive report from a recognized laboratory such as GIA, IGI, or GRA, detailing its '4 Cs' – cut, color, clarity, and carat weight. If the diamond is incorporated into jewelry, the report will still be provided. For diamonds graded by GIA, the grading report can be accessed online.\n \n When you purchase a GIA-graded lab-grown diamond, it features a laser inscription on the girdle, and the receipt includes the report number for easy reference and printing.\n \n We also offer a complimentary IGI Digital Certificate for lab-grown diamonds.",
      },
      {
        q: "Will The Return Policy Be The Same?",
        a: "We wholeheartedly endorse our products and strive to ensure your total satisfaction with each purchase. Should you find yourself dissatisfied with your diamond or jewelry item for any reason, you are entitled to return it for a complete refund within 30 days from the date of receipt.",
      },
    ],
  },
  {
    title: "Warranty and Insurance",
    items: [
      {
        q: "What's Included In Your Warranty Coverage?",
        a: "Our warranty guarantees coverage for any issues with your purchase immediately upon receipt. Within 10 days of your purchase, we will address any loose prongs, provide a polish, or apply rhodium plating if necessary. We assure you that our products are defect-free; however, should you encounter any problems, please contact us. For any other inquiries not included in the warranty, do not hesitate to reach out. We will assess your item and provide you with the cost for any extra services.",
      },
    ],
  },
  {
    title: "Order And Ring Size",
    items: [
      {
        q: "Can I Order Through Your Website?",
        a: "Certainly! You can easily place an order on our website for any of the products showcased. Every item on Jupi Diamonds's website is ready for purchase.",
      },
      {
        q: "What Should I Do If I Require Assistance With Placing An Order?",
        a: "If you need any sort of assistance from us the number mentioned below is available 24 hours a day, 7 days a week. Customer service: <strong>+91 95606 58306</strong>.",
      },
      {
        q: "Can I Place My Order By Phone?",
        a: "Certainly! Feel free to place your order by giving us a call at <strong>+91 95606 58306</strong>. Our friendly Customer Service team is ready to assist you over the phone.",
      },
      {
        q: "I Need To Keep My Order Secret, Can You Help?",
        a: "We place a high priority on your privacy. Our communications are conducted with discretion, and shipments will not bear any brand identifiers. We will coordinate a suitable delivery date with you and supply a tracking code once your custom ring is dispatched. Your satisfaction and confidentiality are of utmost importance to us.",
      },
      {
        q: "I Need A Ring Asap, Can You Help?",
        a: "Yes! I can help you find a ring ASAP. For Urgent Order simply contact our support team via chat or email at support@Jupidiamonds.com.",
      },
      {
        q: "How Do I Get My Ring Size?",
        a: "To find your ring size, you can explore a ring size chart. Alternatively, for the most accurate measurement, we recommend visiting a nearby jewelry store where they can professionally measure your ring size. This ensures 100% accuracy.",
      },
      {
        q: "Do You Offer Re-Sizing?",
        a: "If you require resizing for a ring acquired from Jupi Diamonds, we are pleased to offer a complimentary resizing service within 10 days of purchase. Please contact our support team via chat or email at support@Jupidiamonds.com, ensuring you have your order number and desired size on hand to facilitate a swift process. Please be aware that our resizing policy does not extend to Platinum rings, as they are not eligible for resizing.",
      },
    ],
  },
  {
    title: "Our Diamond & Jewelry",
    items: [
      {
        q: "Do You Offer a Price Match Guarantee?",
        a: "We assure you of high-quality products at competitive prices. Shop with confidence, knowing that if you discover the same product at a lower price elsewhere, simply provide us with the link, and we will make an effort to offer you a better price. It's that simple!",
      },
      {
        q: "Are Your Lab Grown Diamonds Eco-Friendly And Conflict Free?",
        a: "Indeed, lab-grown diamonds are sustainable and conflict-free. They are produced in a laboratory setting rather than extracted from the earth, which is beneficial as natural diamond mining can significantly harm the environment and is often associated with conflict. Therefore, opting for lab-grown diamonds contributes to minimizing pollution and prevents the endorsement of detrimental practices.",
      },
      {
        q: "If I Buy A Lab Grown Diamond, Will Anyone Be Able To Tell?",
        a: "It is impossible to differentiate between a natural diamond and a lab-created diamond without the use of specialized tools. Distinguishing between the two requires specific equipment and training, which can be quite expensive.",
      },
      {
        q: "Does Your Fine Jewellery Comes With The Certificate?",
        a: "Explore our exquisite collection of jewelry featuring beautiful pendants and delightful earrings, offered without a formal certificate. We stand by the superior quality of our diamonds, guaranteeing DEF color and VVS/VS clarity for every item. You can be assured that all diamond rings include a diamond certificate, enhancing the value and security of your investment.",
      },
      {
        q: "Do You Offer Natural Diamond?",
        a: "We primarily offer lab-grown diamonds. However, if you specifically require natural diamonds, you can contact support@Jupidiamonds.com for further assistance.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "What Types Of Payment Do You Accept?",
        a: "We use Razorpay, a widely accepted payment gateway in India, offering a comprehensive suite of solutions for online payments. It supports various payment methods, including credit cards, debit cards, net banking, UPI, and popular wallets.\n \n We support PayPal which is generally considered safe for international transactions, including sending money to India. PayPal uses 128-bit data security encryption for all transactions and offers buyer protection, which can help if an item doesn't arrive or is significantly different from the description. While PayPal is not regulated for domestic transactions in India, it's widely used for international payments and is a trusted platform for online shopping and receiving payments.\n \n If you have any questions or need assistance, feel free to contact us via email or <strong>call/WhatsApp us at +91 95606 58306</strong>.",
      },
      {
        q: "How Do I Pay By ETH Or BTC Or USDT Or Crypto?",
        a: "At this time, we do not accept cryptocurrency as a form of payment. Nevertheless, if you are experiencing difficulties in identifying an appropriate payment method for your order, we are willing to consider alternative solutions.",
      },
    ],
  },
  {
    title: "Shipping",
    items: [
      {
        q: "Do You Ship Worldwide?",
        a: "Yes, we do ship WORLDWIDE.",
      },
      {
        q: "When Will My Order Ship?",
        a: "Free Shipping: Orders typically dispatch within 10 to 15 business days.\n \n Transit time is not included in the lead times stated above because transit times vary so dramatically. If you need an order to ship by, or arrive by, an specific date we urge you to type in 'order notes' section provided during check out. We'll do our best to exceed your request or attempt to reach you and advise the best we can do.\n \n Note: We do not shipped on Weekends & Holidays.",
      },
      {
        q: "What's Included In My Order?",
        a: "Inside the package, you'll find beautiful diamond jewelery with a nice box and a soft leather cover to protect your jewelry. If your jewelery has a lab-grown diamond, the certificate will be sent separately if applicable.",
      },
      {
        q: "Are Your Shipments Fully Insured?",
        a: "Yes. All of our shipments are 100% insured.",
      },
      {
        q: "I Got My Diamond, But No Certificate Came With It. Why?",
        a: "We provide a free IGI digital certificate for lab-grown diamonds. If a physical copy is requested, a $30 fee will apply, and it will be shipped separately.",
      },
      {
        q: "How Much Time Will It Take To Deliver It To My Home?",
        a: "After dispatch, expect your delivery in 8-14 business days. Keep in mind that crafting time for rings and fine jewelry is not included in this period.",
      },
      {
        q: "Can I Track My Order Online?",
        a: "Check the status of your recent purchases by heading to the <strong>'Orders' section within your 'My Account' page</strong>. Once your items are on their way, you can easily track the delivery progress using the provided tracking number on the shipping company's website. Keep an eye out for updates!",
      },
      {
        q: "Are There Any Duties I Have To Pay? How Much Duty/Taxes Do I Have To Pay In Custom?",
        a: "If you reside in India, Hong Kong, or Dubai, you won't have to worry about customs duties or taxes when ordering from us. For customers in other countries, please note that you may be required to pay duties and taxes upon the package's arrival.\n \n The courier will contact you to collect any applicable fees. The exact amount depends on your state or country government, so please check your government's website for specific information. It's important to be aware that we cannot guarantee a lower invoice.",
      },
      {
        q: "What Do I Do If My Order Doesn't Arrive In The Prescribed Time Frame?",
        a: "For assistance with tracking your package, feel free to reach out to us! You can drop us an email at support@Jupi Diamonds.com, or give our friendly customer service team a call at <strong>+91 9560658306</strong>. We're available Monday to Friday from 9:00 AM to 5:00 PM Eastern Time, and we'll be happy to help you with any questions you may have.",
      },
      {
        q: "I'm Not Going To Be Home When My Package Is Supposed To Arrive, What Should I Do?",
        a: "Oftentimes we can set up a hold for pickup at an approved local FedEx/DHL location. Reach out to a support representative in chat or email support@Jupidiamonds.com for help setting it up.",
      },
      {
        q: "What If My Diamond/Jewelry Gets Lost During Shipment?",
        a: "At Jupi Diamonds, we go above and beyond to safeguard your delivery. Your order is protected every step of the way, including transit insurance and requiring a signature upon delivery. In the rare event of loss, rest assured, you'll receive a full refund.",
      },
      {
        q: "How To File A Claim When Your Package Goes Missing?",
        a: "We'll take care of locating your shipment and, once it's found, we'll send the diamond or product back to you. This process typically takes 4 to 6 weeks. Your patience and cooperation are crucial for the best results. Thank you for understanding.",
      },
    ],
  },
  {
    title: "Returns/Refund",
    items: [
      {
        q: "Jupi Diamonds's Return Policy Lasts For Just 30 Days. Why Is That?",
        a: "We want to emphasize that when you buy diamonds jewelry from us, you won't encounter any extra charges like 'middle-men fees' that some other diamond retailers might add on. Our goal is to provide you with top-quality diamonds at fair prices, so we keep our profit margins low. Plus, we offer a 30-day return policy to ensure your satisfaction.\n \n Sometimes, multiple customers fall in love with the same diamond or piece of diamond jewelry. If someone purchases it and decides to return it within the 30-day window, we can then offer it to another interested buyer. This helps us maintain a balanced market and ensures that our diamonds find happy homes. <strong>Remember, the 30-day return period starts from the date you receive the product</strong>.",
      },
      {
        q: "What is Jupi Diamond’ s Lifetime Returns and Exchange Policy ?",
        a: "Customers can exchange their jewelry at 100% of the existing market value, with deductions only for making charges and applicable taxes. \n \n 100% on Gold and 80% on Diamond current market value, with deductions only for making charges and applicable taxes.",
      },
      {
        q: "What Is Jupi Diamonds's Cancellation Policy?",
        a: "You have 24-48Hr to cancel any order after Ordering it.",
      },
      {
        q: "I Just Cancelled My Order. When Will I Receive My Refund?",
        a: "If you cancel your order, you can expect a refund to be credited back to your original payment method within 1 to 3 business days.",
      },
      {
        q: "Is It Possible To Change The Delivery Address For My Order Once It's Already Been Placed?",
        a: "Sure! We can update your address before sending out your order. Once it's dispatched, we can't make any changes to the address",
      },
      {
        q: "When Are Returns Not Possible?",
        a: "Returns will only be accepted within the specified return timeline. The product must remain in its original, unused condition and include any applicable certificates. Please note that returns are not permitted for round and fancy shapes melee & calibrated diamonds. <strong>Additionally, We do not accept returns for Price Match & custom Orders</strong>.",
      },
      {
        q: "How Can I Initiate A Return?",
        a: "You will have to send us an email on support@Jupidiamonds.com along with order number & the reason for your return.",
      },
      {
        q: "Do I Pay The Return Shipping Costs?",
        a: "For U.S. returns, we offer free return shipping with a pre-paid, insured label. Simply print the label, repack the items in their original packaging, include any diamond certifications, and arrange for a pickup or drop-off at the nearest Shipping Hub. Please note that a $100 fee will be charged if the diamond certificate is not returned. For international orders (excluding the USA), customers are responsible for return shipping costs.",
      },
      {
        q: "What Is The Pick-Up Process For The Return Of A Product?",
        a: "After you've sent us an email requesting a return, our team will respond with simple instructions for the next steps. Keep in mind that each customer is allowed two returns or exchanges per year.",
      },
      {
        q: "What Is The Mode Of Payment For Refunds?",
        a: "Refunds are always returned to the same account or card that was used for the initial purchase.",
      },
      {
        q: "Why Did I Get Less Money Back Than What I Paid For My Purchase?",
        a: "International customers may experience a reduced refund amount due to currency conversion fees imposed by their banks. We have successfully processed a full refund, which may include additional charges from currency conversion. If you require a refund receipt, kindly reach out to us at support@Jupidiamonds.com. It is advisable to contact your bank to explore potential ways to minimize these fees, as they have the primary authority and may offer assistance. Please be aware that we are not accountable for any currency conversion charges that may have been applied.",
      },
      {
        q: "How Will I Know That My Refund Has Been Initiated?",
        a: "No need for you to worry – a confirmation email about your refund initiation will be on its way soon. Expect your refund to be in your hands within 1-3 business days.",
      },
      {
        q: "I Still Haven't Got My Refund. Why?",
        a: "Once we confirm your refund approval, rest assured you'll receive it. Occasionally, we encounter technical hiccups that might cause a delay in the refund process. If you find the wait extended, reach out to us for assistance.",
      },
    ],
  },
  {
    title: "Customer Service & Virtual Appointment",
    items: [
      {
        q: "How Can I Receive Support For Any Issues With My Order?",
        a: "It's our pleasure to offer you the highest quality customer care and the finest diamonds. Call our customer service at <strong>+9195606 58306 or email support@Jupidiamonds.com</strong>. You can place your order here or ask us any questions about your previously placed order. We'll be happy to help.",
      },
    ],
  },
  {
    title: "Gemological Terms & Laboratory Info",
    items: [
      {
        q: "What Does A Gemologist Specialize In?",
        a: "A gemologist specializes in identifying, grading, and evaluating gemstones. They assess factors like color, clarity, cut, and carat weight to determine quality and value. Gemologists work in labs, jewelry stores, or as consultants, providing services such as appraisals and certification of gemstones. They also stay informed about industry trends and ethical sourcing practices.",
      },
      {
        q: "How Can I Be Sure That I'll Get Exactly What I Ordered?",
        a: "Every diamond in our collection comes with an independent laboratory report from globally recognized institutes like the International Gemological Institute (IGI), HRD Antwerp, Gemological Institute of America (GIA) and The Global Gemological Resesarch Association Institute (GRA). These reports guarantee authenticity and quality, highlighting the unique characteristics of each diamond.",
      },
      {
        q: "What Are Certificates?",
        a: "When you buy a diamond or gemstone from us, you'll receive a detailed certificate from a trusted gemological institute. This document breaks down all the important details about your precious stone, like its size, clarity, color, cut, and weight. The certificate follows a widely accepted grading system, ensuring accuracy and reliability in the information provided.\n \n Our website features stunning pieces, each accompanied by a certificate that not only describes the gem but also covers details about any diamonds and precious metals used. For instance, if your purchase includes gold elements, the certificate will specify the gold's purity and weight.\n \n Including these certificates with your order is our way of being transparent and building trust. It shows our commitment to delivering high-quality items and provides you with all the necessary information to understand the real value of your chosen piece.",
      },
      {
        q: "Conflict-Free Diamonds. What Are Those?",
        a: "In today's society, the extraction of diamonds and gemstones can sometimes involve unethical practices, such as human rights abuses, child exploitation, or harm to the environment. Conflict-free diamonds, however, ensure that these precious stones are sourced ethically from suppliers committed to avoiding such unfortunate practices.",
      },
      {
        q: "Can You Explain What An Eye Clean Is?",
        a: "This term in the diamond trade suggests that the diamond is clear and doesn't have any visible imperfections when looked at with the naked eye from a distance of about twelve to fifteen inches. Diamonds of SI quality or higher are typically considered eye-clean.",
      },
      {
        q: "What Does The Term 'Cut' Mean?",
        a: "Some folks confuse the term 'cut' with the diamond's shape, such as round or oval. However, it actually speaks to how skillfully the stone is crafted. A finely-cut diamond sparkles with fire and brilliance, catching the eye effortlessly.\n\n On the flip side, poorly-cut diamonds lack luster and fail to impress. It's fascinating how a well-cut diamond can make it seem larger than its counterparts of the same weight. That's why the cut grade holds such importance in the world of diamonds.",
      },
      {
        q: "What Are The GIA Certificates?",
        a: "Every diamond undergoes a thorough examination to create a one-of-a-kind certificate highlighting its distinct features. These certificates use a widely recognized system to communicate the diamond's qualities and follow the strictest standards in grading diamonds.",
      },
      {
        q: "What Are The IGI Certificates?",
        a: "IGI certificates are issued by the International Gemological Institute, an independent laboratory that evaluates and certifies gemstones and jewelry. These certificates provide detailed information about the quality and characteristics of the gemstone, aiding consumers and professionals in assessing its value.",
      },
      {
        q: "What Are The GRA Certificates?",
        a: "A GRA (Global Gemological Research Association Institute) certificate is a report that comes with moissanite jewelry purchases. It contains information about the stone, including: Shape, Cutting style, Measurements, Carat weight, Color grade, Clarity grade, Cut grade, Polish.",
      },
      {
        q: "Can You Define Enhanced Diamonds And Clarify If You Offer Them?",
        a: "We offer diamonds that have been enhanced to enhance their clarity and beauty. These treated diamonds are sourced from natural earth mines. When you make a purchase, it's important to ask for a copy of your diamond's certification.",
      },
      {
        q: "How Is A Diamond's Clarity Enhanced?",
        a: "We utilize cutting-edge laser enhancement and filling techniques to enhance diamonds. The enhancement process leaves no visible marks, and there's no increase in carat weight. These upgraded diamonds are still 100% authentic but come with improved clarity. The quality improves, yet the cost remains lower compared to non-enhanced diamonds with similar clarity grades.",
      },
      {
        q: "What Are Lab Diamonds?",
        a: "Lab diamonds are man-made  but just as real as natural ones. Created in labs using high pressure and heat, they're nearly indistinguishable from natural diamonds. Special machines like DiamondSure and DiamondView can spot differences, but these are hard for the naked eye to see.\n \n Lab diamonds are 70-80% cheaper than natural ones due to efficient production. They also guarantee ethical practices and use less land compared to mining.",
      },
    ],
  },
];

const AccordionItem = ({ q, a, isOpen, onClick }) => (
  <div
    className={`border transition-all duration-300 ease-in-out ${
      isOpen ? "border-brown" : "border-none"
    }`}
  >
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center px-4 sm:px-8 py-4 text-left transition-colors duration-300 ease-in-out ${
        isOpen ? "bg-white" : "bg-lightBrown"
      } cursor-pointer text-xs sm:text-sm text-black font-normal focus:outline-none`}
    >
      <span>{q}</span>
      <span className="transition-transform duration-300 ease-in-out">
        {isOpen ? "−" : "+"}
      </span>
    </button>
    <div
      className={`px-4 sm:px-8 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-96 pb-2 py-0 opacity-100" : "max-h-0 py-0 opacity-0"
      } bg-white text-[10px] sm:text-sm text-[#27282C] whitespace-pre-line tracking-wide`}
    >
      <div dangerouslySetInnerHTML={{ __html: a }} />
    </div>
  </div>
);

const FAQSection = ({
  title,
  items,
  openIndex,
  setOpenIndex,
  sectionIndex,
}) => (
  <section className="mb-10">
    <h2 className="text-center text-md  md:text-2xl font-normal text-[#1E1E1E] mb-3 sm:mb-6">
      {title}
    </h2>
    <div className="space-y-4">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          q={item.q}
          a={item.a}
          isOpen={openIndex?.section === sectionIndex && openIndex.index === i}
          onClick={() =>
            setOpenIndex(
              openIndex?.section === sectionIndex && openIndex.index === i
                ? null
                : { section: sectionIndex, index: i }
            )
          }
        />
      ))}
    </div>
  </section>
);

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState({ section: 0, index: 1 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Jewelry FAQs | Common Questions Answered | Jupi Diamonds"
        description="Find answers to frequently asked questions about jewelry care, sizing, customization, and more. Expert advice from Jupi Diamonds."
        keywords={[
          "jewelry FAQ",
          "diamond questions",
          "ring care guide",
          "jewelry maintenance",
          "custom jewelry FAQ",
          "jewelry buying questions",
        ]}
        url={window.location.href}
      />
      <div className="max-w-5xl mx-auto   px-6 sm:px-4 md:px-8 lg:px-10 xl:px-6 py-6 sm:py-12 tracking-wide leading-relaxed bg-white ">
        <h1 className="text-[#1E1E1E] text-md text-center font-medium mb-5 sm:mb-10">
          Frequently Asked Questions
        </h1>

        {faqData.map((section, sectionIndex) => (
          <FAQSection
            key={sectionIndex}
            title={section.title}
            items={section.items}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
            sectionIndex={sectionIndex}
          />
        ))}
      </div>
    </>
  );
};

export default FAQPage;
