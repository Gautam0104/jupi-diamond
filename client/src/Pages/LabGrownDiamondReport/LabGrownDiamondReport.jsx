import React, { useEffect } from "react";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const LabGrownDiamondReport = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Understanding IGI Diamond Certificates | Sample Report | Jupi Diamonds"
        description="View a sample IGI diamond certificate and learn how to read diamond grading reports. Understand the quality markers for your jewelry."
        keywords={[
          "IGI certificate sample",
          "diamond grading report",
          "how to read diamond certificate",
          "IGI diamond quality",
          "diamond authentication",
          "jewelry certification",
        ]}
        url={window.location.href}
      />

      <div className="bg-white px-6 sm:px-4 md:px-12 lg:px-14 xl:px-4 py-6 sm:py-12 max-w-7xl mx-auto">
        <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
          IGI Lab Grown Diamond Grading Report
        </h1>

        <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
          <p>
            IGI pioneered the grading of lab grown diamonds in 2005 and
            continues to lead the field today.
            <br /> <br /> More complex than the analysis of most gemstones,
            IGI’s lab grown diamond certification process demonstrates
            unparalleled expertise in the testing and documentation of loose
            stones and finished jewelry items undergoing lab grown diamond
            certification. Without disassembling mounted stones or complex
            pieces, IGI experts perform thorough, objective analysis.
            <br /> <br /> IGI screens every gemstone using state of the art
            technologies to determine naturally mined, laboratory grown or
            simulant origin. Experienced graduate gemologists conduct further
            assessment in controlled conditions, detailing relevant gemological
            characteristics according to the strictest international system.
            <br /> <br /> Upon request the growth process used and presence of
            treatments will be noted in the comments section of the IGI lab
            diamond report.
          </p>{" "}
        </div>

        <div className="my-8 flex justify-center">
          <img
            src="/home/Labgrown.png"
            alt="IGI Lab Grown Diamond Grading Report Brochure"
            loading="lazy"
            className=" max-w-full sm:h-[640px] object-cover aspect-square "
          />
        </div>
        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2">
            How To Read A IGI Lab Grown Diamond Grading Report
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              When purchasing a significant piece of fine jewelry, you are
              making an investment in a future heirloom. Therefore, it is
              essential to ensure that the quality of your lab-grown diamond
              meets your expectations. To confirm that the color, clarity, cut,
              and carat weight of your lab-grown diamond align with what you are
              paying for, obtaining a lab-grown diamond grading report is
              necessary. This independent grading report, commonly referred to
              as a diamond certificate, serves as third-party verification of
              your diamond's quality. At Jupi Diamonds, all diamonds weighing
              0.50 carats and above come with an IGI grading report, ensuring
              you can trust the 4Cs of diamond quality. Each IGI grading report
              can be verified at IGI.org using the report number or the QR code
              provided on the report.
              <br /> <br /> The International Gemological Institute (IGI) stands
              as the largest gem grading laboratory globally, with 20 locations
              worldwide. It issues millions of reports each year for finished
              jewelry, natural diamonds, lab-grown diamonds, and gemstones. IGI
              was the first gemological laboratory to receive ISO accreditation
              for both natural and lab-grown diamond grading. The ISO 17025
              certification for laboratory competence is recognized as the most
              critical standard for calibration and testing laboratories
              internationally, applicable to all laboratory settings.
              Additionally, IGI is the first gemological laboratory to pledge
              carbon neutrality, collaborating with the Responsible Jewelry
              Council, International Precious Metals Institute, and Initiative
              for Responsible Mining Assurance, in partnership with SCS Global
              Services, to reduce its environmental footprint. IGI does not
              engage in the mining, purchasing, selling, or trading of diamonds,
              ensuring that its grading remains impartial and objective.
              <br /> <br /> The IGI Lab Grown Diamond Report encompasses a
              detailed description of the gemstone, including its shape, cutting
              style, measurements, and an evaluation based on the 4Cs: Carat
              Weight, Color, Clarity, and Cut. Additionally, diamond reports may
              feature a graphical representation of the diamond's proportions
              along with a diagram illustrating its clarity characteristics. The
              IGI Laboratory Grown Diamond Report maintains the same quality and
              descriptions as the IGI Diamond Report, with the distinction that
              the report is presented in yellow rather than white. Furthermore,
              the girdle of the laboratory grown diamond is laser inscribed with
              the report number and the phrase 'lab grown.'
              <br /> <br /> This document outlines the primary sections of the
              IGI Lab Grown Diamond Grading Report and the contents of each
              section, serving as a glossary to enhance your understanding of
              the IGI grading report for your diamond.
            </p>
          </div>
        </section>

        <div className="my-8 flex justify-center mb-6 md:mb-8">
          <img
            src="/home/GrownLabReport.png"
            alt="IGI Lab Grown Diamond Grading Report Brochure"
            loading="lazy"
            className=" max-w-full sm:h-[640px]  "
          />
        </div>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Report Number
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              The unique number can be used to verify the authenticity of the
              report and confirm the grading details using IGI’s online{" "}
              <a
                href="https://www.igi.org/verify-your-report/"
                target="_blank"
                rel="noopener noreferrer"
                title="IGI Report Verification Service"
                className="font-medium text-blue-600 hover:underline"
              >
                Verify My Report
              </a>{" "}
              service. This number is also laser-inscribed on the gemstone’s
              girdle.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Description
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              The identity and the origin (in this case, lab-grown) as
              scientifically determined by IGI.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Shape & Cut
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              This section describes the outline of the gemstone’s shape and its
              faceting style. For example, an octagonal diamond could be a
              radiant cut or an emerald cut.{" "}
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Measurements
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              This specifies the gemstone’s dimensions: minimum and maximum
              width and length, followed by depth. The dimensions are not the
              same as carat weight. For example, a one-carat round diamond could
              be 6.2mm or 6.5mm in diameter. Fancy shapes have varying lengths
              and widths: an oval can be closer to round or more elongated.{" "}
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Carat Weight
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Carat is the standard weight unit for gemstones (not to be
              confused with karat, which is a measure of gold purity). One carat
              is 0.20 grams.{" "}
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Color Grade
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Colorless diamond color is graded on a scale from the letter D
              (colorless) to the letter Z (light yellow, brown or gray). The
              more colorless a diamond is, the closer to D in the scale, the
              more expensive it will be. IGI grades diamond color to
              internationally accepted standards which apply the same way to
              mined and lab grown diamonds using comparisons to calibrated
              master stones. All other colors and stronger shades of yellow,
              brown and gray are classified as fancy colors and are graded on a
              different scale.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Clarity Grade
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Clarity is graded using 10 power magnification assessing the
              visibility, size, location, color, number and nature of internal
              and surface characteristics. IGI grades clarity according to
              international standards that are the same for mined and lab grown
              diamonds. The clarity scale ranges from flawless (FL) to I3
              (obvious large inclusions.)
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Cut Grade
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Cut of round brilliant is graded on a scale of Ideal to Poor and
              assesses human craftsmanship factors, including surface polish,
              faceting symmetry and how the gemstone's overall proportions
              combine to promote proper physical size appearance and visual
              beauty components. The better the quality of the cut, the more
              sparkle and brilliance the gem will have. This cut grade evaluates
              a diamond's brightness, fire, scintillation, durability, polish,
              and symmetry. IGI also grades the cut of fancy shaped lab grown
              diamonds, based on polish, symmetry, proportions and light return.
              Fancy shape cut grades range from Excellent to Poor. (Ideal is
              only used for round brilliant diamonds.)
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Polish
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Polish is a sub-component of the overall cut grade. Graded on a
              scale of Excellent to Poor, it assesses the smoothness and
              mirror-like finish of each facet resulting from the diamond
              polishing process.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Symmetry
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Symmetry is a sub-component of the overall cut grade. Graded on a
              scale of Excellent to Poor, it assesses the shape, uniformity,
              alignment, and junctions of all the gemstone's facets.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Fluorescence
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Fluorescence is a measure of the finished crystal's reaction to
              ultraviolet (UV) light, expressed in terms of intensity as None to
              Very Strong. Very Strong fluorescence can sometimes (but not
              always) make a diamond look hazy.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Inscription
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Any microscopic inscription that appears on the gem’s girdle,
              including the report number and the words “lab grown.”
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Proportions
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Proportions are measurements of the gemstone's primary and
              secondary facet groups, largely expressed as average angles and
              percentages of average girdle diameter.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Clarity Characteristics
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              A map of the gemstone's internal and external clarity
              characteristics, as observed at 10X magnification, is provided for
              purposes of information and identification. The most significant
              characteristic will be listed first.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Grading Scales
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              This section shows the grading scales for color, clarity, and cut
              so you can see where your grades fall in the scales. IGI uses the
              internationally accepted scales for color and clarity, and its own
              cut grading standard.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Image
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              This is a photo of your actual diamond. It’s enlarged and not to
              scale.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Laserscribe
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              A photo of the laser inscription on the gemstone's girdle so you
              can check to see if it matches the actual gem.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            Security Seal
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Every IGI paper grading report has a tamper evident security seal
              with enhancements to protect against counterfeiting.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 capitalize">
            QR Code
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              This QR code can be scanned to take you to the verified digital
              version of the report posted on the IGI website.
            </p>
          </div>
        </section>

        <div className=" mt-8 sm:mt-16">
          <a
            href="https://www.igi.org/reports/lab-grown-diamond-report/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Read more about lab grown diamonds vs natural diamonds"
            title="Learn about the differences between lab grown and natural diamonds"
          >
            <button className="bg-brown text-white font-medium py-3 sm:py-4 px-8 sm:px-24 text-xs sm:text-sm hover:shadow-md cursor-pointer">
              Read More
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default LabGrownDiamondReport;
