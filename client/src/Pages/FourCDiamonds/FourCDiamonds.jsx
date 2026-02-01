import React, { useEffect } from "react";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const colorGrades = [
  {
    range: "D - F",
    description: "Colorless",
    image: "/home/Dia1.png",
  },
  {
    range: "G - J",
    description: "Near Colorless",
    image: "/home/Dia2.png",
  },
  {
    range: "K - M",
    description: "Slightly Tinted",
    image: "/home/Dia3.png",
  },
  {
    range: "N - R",
    description: "Very Light Color",
    image: "/home/Dia4.png",
  },
  {
    range: "N - R",
    description: "Light Color",
    image: "/home/Dia5.png",
  },
];

const FourCDiamonds = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Understanding Diamond 4Cs | Cut, Color, Clarity, Carat | Jupi Diamonds"
        description="Learn about the 4Cs of diamond quality - Cut, Color, Clarity, and Carat weight. Our expert guide helps you make informed diamond jewelry purchases."
        keywords={[
          "diamond 4cs explained",
          "diamond quality guide",
          "how to choose diamonds",
          "diamond cut clarity color carat",
          "diamond buying guide",
          "understanding diamond grades",
        ]}
        url={window.location.href}
      />
      <div className="bg-white px-6 sm:px-4 md:px-12 lg:px-14 xl:px-4 py-6 sm:py-12 max-w-7xl mx-auto tracking-wide leading-relaxed">
        <h1 className="text-center text-xl font-semibold mb-5 sm:mb-10">
          4C's of Diamonds
        </h1>

        <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
          What are 4Cs of Diamonds?
        </h1>

        <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm mb-6 md:mb-8">
          <p>
            Selecting the ideal diamond may seem daunting; however,
            familiarizing oneself with the Four C's —Cut, Color, Clarity, and
            Carat—can streamline the decision-making process. These widely
            recognized criteria assist in evaluating a diamond's quality and
            worth, enabling you to make a well-informed selection. Below is an
            explanation of each C and its impact on the diamond's overall
            aesthetic appeal and cost.
          </p>{" "}
        </div>
        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Understanding the 4Cs of Diamonds: Cut, Color, Clarity, and Carat
            Weight
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              The 4Cs of diamonds—Cut, Color, Clarity, and Carat Weight — are
              the key factors that determine a diamond's quality and value. Cut
              refers to how well a diamond is shaped and affects its brilliance.
              Color measures how colorless the diamond is, with the best stones
              having no color.
            </p>{" "}
            <ul className="list-disc list-outside  space-y-2 ml-10 sm:ml-14 text-xs sm:text-sm text-gray-700">
              <li>Cut</li>
              <li>Color</li>
              <li>Clarity</li>
              <li>Carat</li>
            </ul>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Cut of Diamonds
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Cut of a diamond refers to the overall proportioned surfaces of a
              diamond. One might wonder how the surfaces of a diamond contribute
              to a diamond's beauty and brilliance.
            </p>{" "}
          </div>
        </section>

        <div className="my-8 flex justify-center">
          <img
            src="/home/DiamondMesurement.png"
            alt="Diamond Mesurement"
            loading="lazy"
            className=" max-w-full sm:h-[640px]  "
          />
        </div>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Crown height
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Showcase your projects with stunning high-quality images that
              capture every detail.
            </p>{" "}
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Pavilion depth
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Offer in-depth project information to draw in your audience and
              highlight your craftsmanship.
            </p>{" "}
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Table diameter
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Give each project a unique identity with customizable features and
              personalized details.
            </p>{" "}
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Girdle thickness
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Display completion dates to showcase your commitment to excellence
              and timely delivery.
            </p>{" "}
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Crown angle
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Include time duration to give an insight into the effort and
              dedication put into each project.
            </p>{" "}
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Pavilion angle
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm mb-6 md:mb-8">
            <p>
              List client names to build credibility and trust with potential
              customers.
            </p>{" "}
            <p>
              The assessment of a diamond's cut is conducted in controlled
              laboratory settings, as the nuances are imperceptible to the naked
              eye and can only be discerned by trained experts. To the average
              observer, even a diamond with a shallow cut may appear flawless in
              every aspect.
            </p>
            <p>
              While the natural characteristics of a diamond's color and clarity
              are determined by nature, the quality of the cut is a human
              endeavor that enhances its brilliance. The planning, proportions,
              precision in cutting, and finishing details dictate the diamond's
              brilliance, dispersion, and scintillation. If the cutting
              parameters that are within human control are not optimized, the
              diamond's visual appeal may suffer. The art of diamond faceting
              has evolved over time, especially with advancements in lighting
              technology. Various shapes and cutting styles exist, each
              exhibiting unique visual attributes, with the Round Brilliant
              being the most favored diamond shape in the era of modern electric
              lighting.
            </p>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-start">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-lg font-medium mb-1 sm:mb-2">Proportions</h2>
              <img
                src="/home/Proportions.png"
                alt="Diamond proportions diagram"
                loading="lazy"
                className="max-w-[300px] h-auto"
              />
            </div>

            {/* Light Return - Ideal */}
            <div className="flex flex-col items-center text-center">
              <h2 className="text-lg font-medium mb-1 sm:mb-2">Light Return</h2>
              <div className="flex gap-4 justify-center items-center">
                <img
                  src="/home/LightReturn1.png"
                  alt="Ideal Light Return 1"
                  loading="lazy"
                  className="w-40 h-40"
                />
                <img
                  src="/home/LightReturn2.png"
                  alt="Ideal Light Return 2"
                  loading="lazy"
                  className="w-36 h-36"
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                "Ideal" Excellent to Very Good
              </p>
            </div>

            {/* Light Return - Poor Examples */}
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-lg font-medium mb-1 sm:mb-2">Light Return</h2>
              <div className="flex justify-center items-center gap-6">
                <div className="flex flex-col items-center">
                  <img
                    src="/home/LightReturn3.png"
                    alt="Too Shallow"
                    loading="lazy"
                    className="w-40 h-40"
                  />
                  <p className="text-xs sm:text-sm mt-1">Too Shallow</p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="/home/LightReturn4.png"
                    alt="Too Deep"
                    loading="lazy"
                    className="w-40 h-40"
                  />
                  <p className="text-xs sm:text-sm mt-1">Too Deep</p>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="/home/LightReturn5.png"
                    alt="Excellent to Good"
                    loading="lazy"
                    className="w-40 h-40"
                  />
                  <p className="text-xs sm:text-sm mt-1">Excellent to Good</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-10 text-xs sm:text-sm sm:text-base italic font-normal sm:ml-10">
            <span className="font-medium">Grading:</span> Ranges from Excellent
            to Poor, based on proportions, symmetry, and polish
          </p>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Color of Diamonds
          </h1>

          <div className="space-y-4 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              The color of a diamond is a crucial element in assessing its
              rarity, value, and pricing. Naturally occurring diamonds exhibit a
              spectrum of colors, such as orange, yellow, pink, grey, blue,
              brown, white, red, and even black. The evaluation and pricing of
              these colored diamonds differ significantly. Most gem-quality
              diamonds utilized in jewelry display shades ranging from
              completely colorless to those with noticeable yellow or brown
              hues.
            </p>
            <p>
              The most rare and valuable diamonds fall within the colorless
              category, graded D, E, and F on a descending scale that extends to
              Z. Diamonds exhibiting more color than Z, or those in other hues
              like orange, pink, or blue, are categorized as 'Fancy Colored
              Diamonds' and are assessed using the IGI Colored Diamond Report.
              To accurately identify the color, all submitted diamonds are
              compared against an internationally recognized master set of
              stones, which spans from D, or colorless (the most desirable), to
              Z, the most yellow or brown, excluding 'fancy' yellow or brown.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center text-gray-800 ">
              {colorGrades.map((grade, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={grade.image}
                    alt={grade.description}
                    loading="lazy"
                    className="w-20 h-16 mb-3"
                  />
                  <p className="font-semibold">{grade.range}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{grade.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-x-auto sm:ml-10">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Grade
                  </th>
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Subgrade/Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    D, E, and F
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Colorless
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    G, H, I, and J
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Near Colorless
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    K, L, and M
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Slightly Tinted
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    N, O, P, Q, and R
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Very Light Yellow
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    S, T, U, V, W, X, Y, and Z
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Light Yellow
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm mt-6">
            <p>
              As diamonds approach colorless grades, their prices increase
              significantly. It is important for customers to understand that
              the variations in color are so subtle that they can only be
              detected under a microscope. For those who are sensitive to even
              the slightest color differences, there are more affordable yet
              equally appealing options available in the F, G, H, and I grades.
              In fact, nearly 68% of consumers opt for diamonds within these
              grades.
            </p>
          </div>

          <h2 className="text-xl font-normal text-[#27282C] mb-1 sm:mb-2 mt-8 sm:ml-10">
            Some things customers should keep in mind regarding the color of a
            diamond
          </h2>

          <ol className="list-decimal list-outside space-y-2 ml-10 sm:ml-16 text-xs sm:text-sm text-gray-700">
            <li>
              It isn't difficult to assess color after the diamond is set on a
              piece of jewelry because the color is influenced by the color of
              the jewelry, compared to that in common light settings.
            </li>
            <li>
              Color plays a greater visible factor in large diamonds or diamonds
              with large carat weight. This is one of the reasons small diamonds
              are a more preferred choice than large ones.
            </li>
            <li>
              3. The Cut of a diamond is very important in determining its
              color. In a well-cut diamond, light passes through it and reflects
              on shorter ray-paths with greater intensity, making the diamond
              appear less colored. On the other hand, if the diamond cut is
              shallow or deep, the light rays become concentrated at the bottom,
              giving it an exaggerated look from the top.
            </li>
            <li>
              4. As mentioned earlier, the color difference is minuscule, and it
              is almost invisible to an unaided eye. So, resorting to a lesser
              grade would not make a very huge difference in the overall
              appearance but will surely make a difference in the budget. Grade
              Subgrade/Description D, E, and F Colorless G, H, I, and J Near
              Colorless K, L, and M Faint Yellow N, O, P, Q, and R Very
              Light-Yellow S, T, U, V, W, X, Y, and Z Light Yellow
            </li>
            <li>
              Finally, yellow diamonds are no less diamonds so if you have a
              piece of jewelry like a necklace or a ring which really contrasts
              or goes well with yellow more than white, you should choose it
              over the other.
            </li>
          </ol>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Clarity of Diamonds
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Diamonds are formed under conditions of extreme heat and pressure,
              resulting in both internal and external characteristics that are
              prevalent. These features assist gemologists in distinguishing
              natural diamonds from synthetic ones and simulants, as well as in
              identifying individual stones. Clarity characteristics are
              categorized into two types: inclusions and blemishes. To
              accurately assess a diamond's clarity, one must examine the
              quantity and nature of both internal and external characteristics,
              along with their size and positioning. The distinction lies in
              their locations: inclusions are found within the diamond, whereas
              blemishes are external features. Grading reports from reputable
              Independent Grading and Accreditation Services Providers include
              plotted diagrams that highlight clarity characteristics, with
              internal features marked in red and external features in green.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto sm:ml-10">
            <img
              src="/home/ClarityOfDIamond.png"
              alt="ClarityOfDIamond"
              loading="lazy"
              className="w-full sm:max-w-3xl  mx-auto mb-1 sm:mb-2"
            />
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Category
                  </th>
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Flawless
                  </th>
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Internally Flawless
                  </th>
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Very Very Slightly Included
                  </th>
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Very Slightly Included
                  </th>
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Slightly Included
                  </th>
                  <th className="border font-medium border-gray-300 px-4 py-2 text-left">
                    Included
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Grade</td>
                  <td className="border border-gray-300 px-4 py-2">FL</td>
                  <td className="border border-gray-300 px-4 py-2">IF</td>
                  <td className="border border-gray-300 px-4 py-2">
                    VVS1 / VVS2
                  </td>
                  <td className="border border-gray-300 px-4 py-2">VS1/VS2</td>
                  <td className="border border-gray-300 px-4 py-2">SI1/SI2</td>
                  <td className="border border-gray-300 px-4 py-2">I1/I2/I3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h1 className="text-md md:text-xl font-normal text-[#27282C] mb-1 sm:mb-2 ">
            Carat of Diamond
          </h1>

          <div className="space-y-3 text-gray-700 leading-relaxed sm:ml-10 text-xs sm:text-sm">
            <p>
              Carat weight or mass (ct) is a unit of measurement of the weight
              of a gemstone. The use of Ct as a unit is limited to gemstones and
              is also prevalent in other forms of jewels such as pearls.
            </p>
            <p>
              The contemporary metric carat, adopted in 1907, demarcates that 1
              carat is precisely equal to 200 mg or 0.2 grams. A carat is
              divided into 100 points, which means:
            </p>
            <ul className="list-disc list-outside space-y-2 ml-10 sm:ml-14">
              <li>1 carat = 100 points</li>
              <li>Three-Quarter Carat = 75 points</li>
              <li>Half Carat = 50 points</li>
              <li>Quarter Carat = 25 points</li>
            </ul>
            <p>
              When diamonds are mined, large gems are discovered much less
              frequently than small ones, which makes large diamonds much more
              valuable. Diamond prices rise exponentially with carat weight. So,
              a 2-carat diamond of a given quality is always worth more than two
              1-carat diamonds of the same quality.
            </p>
            <p>
              It is important to note that diamonds of the same weight don't
              necessarily have the same size appearance. Those cut too shallow
              or deep may look small for their weight or suffer in brilliance.
            </p>
            <p>
              A comprehensive Diamond Size Charts by Shape is as follows to find
              the perfect fit for your jewelry designs.
            </p>
          </div>
        </section>

        <div className=" mt-8 sm:mt-16">
          <a
            href="https://www.igi.org/consumer-education/diamond-4cs/"
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

export default FourCDiamonds;
