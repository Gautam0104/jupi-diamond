import React, { useEffect } from "react";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const BraceletSizeGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Bracelet Size Guide & Measurement Chart | Jupi Diamonds"
        description="Find your perfect bracelet size with our comprehensive sizing guide. Includes measurement tips and size conversion chart."
        keywords={[
          "bracelet size chart",
          "how to measure bracelet size",
          "bracelet sizing guide",
          "wrist measurement",
          "jewelry size chart",
        ]}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 md:px-8 lg:px-10 xl:px-6 py-6 sm:py-12 text-[#27282C] bg-white">
        <div className=" bg-white text-gray-800 ">
          <h1 className="text-center text-lg font-semibold mb-4 sm:mb-4">
            Bracelet Size Guide
          </h1>
          <div className="mb-0 pb-2 flex flex-col sm:flex-row items-center  justify-center gap-2 sm:gap-4">
            <h2 className="text-lg  md:text-2xl font-semibold text-center  ">
              BRACELET SIZE SUGGESTION
            </h2>
            <img
              src="/home/BraceletSize.png"
              loading="lazy"
              className="w-72 h-56"
              alt="Bracelet Size Image"
            />
          </div>

          <div className="flex flex-col  items-center md:items-start justify-center gap-8">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full border text-xs sm:text-sm text-center">
                <thead className="bg-gray text-black text-[10px] sm:text-sm">
                  <tr>
                    <th className="border p-2 font-medium" colSpan="2">
                      Wrist Size
                    </th>
                    <th className="border p-2 font-medium" colSpan="2">
                      Bracelet Size (Without Charms)
                    </th>
                    <th className="border p-2 font-medium" colSpan="2">
                      Bracelet Size (With Charms)
                    </th>
                  </tr>
                  <tr>
                    <th className="border p-2 font-medium">cm</th>
                    <th className="border p-2 font-medium">inch</th>
                    <th className="border p-2 font-medium">cm</th>
                    <th className="border p-2 font-medium">inch</th>
                    <th className="border p-2 font-medium">cm</th>
                    <th className="border p-2 font-medium">inch</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["15", "6", "16-17", "6.3-6.7", "17-18", "6.7-7.1"],
                    ["16", "6.3", "17-18", "6.7-7.1", "18-19", "7.1-7.5"],
                    ["17", "6.7", "18-19", "7.1-7.5", "19-20", "7.5-7.9"],
                    ["18", "7.1", "19-20", "7.5-7.9", "20-21", "7.9-8.3"],
                  ].map(
                    (
                      [
                        wCm,
                        wIn,
                        noCharmCm,
                        noCharmIn,
                        withCharmCm,
                        withCharmIn,
                      ],
                      index
                    ) => (
                      <tr key={index}>
                        <td className="border p-2 hover:bg-gray-50">{wCm}</td>
                        <td className="border p-2 hover:bg-gray-50">{wIn}</td>
                        <td className="border p-2 hover:bg-gray-50">{noCharmCm}</td>
                        <td className="border p-2 hover:bg-gray-50">{noCharmIn}</td>
                        <td className="border p-2 hover:bg-gray-50">{withCharmCm}</td>
                        <td className="border p-2 hover:bg-gray-50">{withCharmIn}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4 text-xs sm:text-sm overflow-x-auto">
              <div className=" w-full ">
                <h3 className="font-semibold text-[10px]  sm:text-sm text-center  mb-2">
                  Women's Bracelets & Cuffs Size
                </h3>
                <table className="min-w-full border  text-center">
                  <thead className="bg-gray text-black text-[10px]  sm:text-sm">
                    <tr>
                      <th className="border p-2 font-medium">Actual Wrist Measurements</th>
                      <th className="border p-2 font-medium">Bracelet Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['4⅝ - 5"', "X-Small"],
                      ['5⅛ - 5½"', "Small"],
                      ['5⅝ - 6"', "Medium"],
                      ['6⅛ - 6½"', "Large"],
                      ['6⅝ - 7"', "X-Large"],
                      ['7⅛ - 7½"', "2X-Large"],
                      ['7⅝ - 8"', "3X-Large"],
                    ].map(([measurement, size], i) => (
                      <tr key={i}>
                        <td className="border p-2 hover:bg-gray-50">{measurement}</td>
                        <td className="border p-2 hover:bg-gray-50">{size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className=" w-full">
                <h3 className="font-semibold text-[10px]  sm:text-sm text-center mb-2">
                  Men's Bracelets Size
                </h3>
                <table className="min-w-full border  text-center">
                  <thead className="bg-gray  text-black text-[10px]  sm:text-sm">
                    <tr>
                      <th className="border p-2 font-medium">Actual Wrist Measurements</th>
                      <th className="border p-2 font-medium">Bracelet Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['6⅛ - 6½"', "Small"],
                      ['6⅝ - 7"', "Medium"],
                      ['7⅛ - 7½"', "Large"],
                      ['7⅝ - 8"', "X-Large"],
                      ['8⅛ - 8½"', "2X-Large"],
                      ['8⅝ - 9"', "3X-Large"],
                      ['9⅛ - 9½"', "4X-Large"],
                      ['9⅝ - 10"', "5X-Large"],
                    ].map(([measurement, size], i) => (
                      <tr key={i}>
                        <td className="border p-2 hover:bg-gray-50">{measurement}</td>
                        <td className="border p-2 hover:bg-gray-50">{size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <section className="my-10">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            How to Measure Bracelet Size
          </h2>
          <ul
            role="list"
            className="list-disc list-outside space-y-2 ml-7 sm:ml-10 text-xs sm:text-sm text-gray-700"
          >
            <li>
              Measuring your wrist size accurately is the first step in finding
              the perfect bracelet size. Here's a step-by-step guide on how to
              measure your wrist for the right bracelet size:
            </li>
          </ul>

          <div className="mt-6">
            <h3 className="text-sm sm:text-md font-medium mb-2">
              Step 1: Get a Measuring Tape
            </h3>
            <p className="sm:ml-10 text-xs sm:text-sm">
              Start by getting a flexible measuring tape that is used for sewing
              or crafting. If you don't have a measuring tape, you can also use
              a strip of paper or a piece of string and a ruler to measure
              later.
            </p>

            <h3 className="text-sm sm:text-md font-medium mt-4 mb-2">
              Step 2: Measure Your Wrist
            </h3>
            <p className="sm:ml-10 text-xs sm:text-sm">
              Wrap the measuring tape around the widest part of your wrist,
              which is usually just above the wrist bone. If you're using a
              strip of paper or a piece of string, wrap it snugly around your
              wrist and mark the spot where it overlaps. Then, measure the
              marked length with a ruler to get your wrist circumference.
            </p>

            <h3 className="text-sm sm:text-md font-medium mt-4 mb-2">
              Step 3: Add an Inch or Two
            </h3>
            <p className="sm:ml-10 text-xs sm:text-sm">
              To find the right bracelet size, it's important to add some extra
              length to your wrist circumference measurement. A general rule of
              thumb is to add 1/2 inch to 1 inch (1.27 cm to 2.54 cm) to your
              wrist measurement to determine your bracelet size. This allows for
              a comfortable fit without being too tight.
            </p>
            <p className="sm:ml-10 text-xs sm:text-sm mt-2">
              Keep in mind the type of bracelet you're interested in. Different
              styles may require different sizes, so it's crucial to take that
              into consideration when measuring your wrist.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Understanding Bracelet Sizing
          </h2>
          <ul
            role="list"
            className="list-disc list-outside space-y-2 ml-7 sm:ml-10 text-xs sm:text-sm text-gray-700"
          >
            <li>
              Bracelets come in various sizes, and it's essential to understand
              the different sizing options available to ensure you get the
              perfect fit. Here's a breakdown of the most common bracelet sizes:
            </li>
          </ul>

          <div className="mt-4">
            <ul className="list-disc list-outside space-y-2 ml-7 sm:ml-10 text-xs sm:text-sm text-gray-700">
              <li>
                <span className="font-semibold">Small:</span> Fits wrists up to
                6 inches (15.24 cm) in circumference
              </li>
              <li>
                <span className="font-semibold"> Medium:</span> Fits wrists
                between 6 to 7 inches (15.24 cm to 17.78 cm) in circumference
              </li>
              <li>
                <span className="font-semibold">Large:</span> Fits wrists
                between 7 to 8 inches (17.78 cm to 20.32 cm) in circumference
              </li>
              <li>
                <span className="font-semibold">Extra-large:</span> Fits wrists
                over 8 inches (20.32 cm) in circumference
              </li>
              <li>
                Keep in mind that these sizes are just general guidelines and
                may vary depending on the brand or style of the bracelet. It's
                always best to refer to the specific size chart provided by the
                retailer or jewelry maker to ensure an accurate fit.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Different Bracelet Styles and Sizing Considerations
          </h2>
          <ul
            role="list"
            className="list-disc list-outside space-y-2 ml-7 sm:ml-10 text-xs sm:text-sm text-gray-700"
          >
            <li>
              Bracelets come in a wide array of styles, and each style may
              require different sizing considerations. Let's take a look at some
              popular bracelet styles and how to determine the right size for
              each:
            </li>
            <li>
              <span className="text-sm sm:text-md font-medium">
                {" "}
                Chain Bracelets:
              </span>{" "}
              Chain bracelets are made up of links that can be adjusted to fit
              different wrist sizes. To determine the right size for a chain
              bracelet, measure your wrist as explained earlier and add the
              desired length for how loose or tight you want the bracelet to
              fit. Keep in mind that some chain bracelets have a built-in
              extender chain, which allows for additional adjustments.
            </li>
            <li>
              <span className="text-sm sm:text-md font-medium">
                {" "}
                Bangle Bracelets:
              </span>{" "}
              Bangle bracelets are rigid and slip over the hand onto the wrist.
              To find the right size for a bangle bracelet, measure the widest
              part of your hand, which is usually around the knuckles, and add a
              little extra room for the bracelet to slide on and off easily. A
              general rule of thumb is to choose a bangle that is 1/4 to 1/2
              inch (0.64 cm to 1.27 cm) larger than your hand measurement to
              ensure a comfortable fit.
            </li>

            <li>
              <span className="text-sm sm:text-md font-medium">
                {" "}
                Beaded Bracelets:
              </span>{" "}
              Beaded bracelets are made with beads that are strung together and
              typically do not have a clasp. To determine the right size for a
              beaded bracelet, measure your wrist as explained earlier and add
              the desired length for how loose or snug you want the bracelet to
              fit. Keep in mind that beaded bracelets may have different bead
              sizes, which can affect the overall length of the bracelet, so
              it's crucial to consider that when selecting the size.
            </li>

            <li>
              <span className="text-sm sm:text-md font-medium">
                {" "}
                Cuff Bracelets:
              </span>{" "}
              Cuff bracelets are open-ended and can be adjusted to fit different
              wrist sizes. To find the right size for a cuff bracelet, measure
              the circumference of your wrist and add a little extra room for
              comfort. It's essential to choose a cuff bracelet that is slightly
              smaller than your wrist size to ensure a secure fit without
              slipping off.
            </li>

            <li>
              <span className="text-sm sm:text-md font-medium">
                {" "}
                Leather Bracelets:
              </span>{" "}
              Leather bracelets are typically adjustable with a buckle or a
              clasp, allowing you to customize the fit. Measure your wrist and
              choose a leather bracelet that has multiple size options, or
              choose one that is slightly larger for a looser fit.
            </li>

            <li>
              <span className="text-sm sm:text-md font-medium">
                {" "}
                Tennis Bracelets:
              </span>{" "}
              Tennis bracelets are made of a continuous line of gemstones or
              diamonds and usually have a clasp for closure. To determine the
              right size for a tennis bracelet, measure your wrist and add about
              1/4 to 1/2 inch for a snug fit or 3/4 to 1 inch for a looser fit.
            </li>

            <li>
              <span className="text-sm sm:text-md font-medium">
                {" "}
                Watch Bracelets:
              </span>
              Watch bracelets usually come in standard sizes based on the watch
              case diameter. Measure the circumference of your wrist and choose
              a watch bracelet that matches the size of your wrist or adjust the
              links if possible.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default BraceletSizeGuide;
