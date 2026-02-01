import React, { useEffect } from "react";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const RingSizeGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Ring Size Guide & Measurement Chart | Jupi Diamonds"
        description="Find your perfect ring size with our comprehensive sizing guide. Includes printable chart, measurement tips, and international size conversions."
        keywords={[
          "ring size chart",
          "how to measure ring size",
          "ring sizing guide",
          "international ring sizes",
          "printable ring sizer",
          "jewelry size chart",
        ]}
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 md:px-8 lg:px-10 xl:px-6 py-6 sm:py-12 text-[#27282C] bg-white">
        <h1 className="text-center text-lg font-semibold mb-5 sm:mb-10">
          Ring Size Guide
        </h1>

        <section className="mb-10">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Measure A Ring
          </h2>
          <ul
            role="list"
            className="list-disc list-outside  space-y-2 ml-7 sm:ml-10 text-xs sm:text-sm text-gray-700"
          >
            <li>
              Find a ring that fits comfortably on the finger you intend to wear
              your new ring on.
            </li>
            <li>
              Measure the internal diameter of the ring, using a ruler or
              measuring tape. To do so, ensure you are using a ruler with
              millimeter (mm) measurements, then place your ring on top of the
              ruler and measure the inside of the circle – in other words, the
              part that is in contact with your finger.
            </li>
            <li>
              Use Ring Size Chart to convert your diameter measurement into the
              correct ring size.
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
            <img
              src="/home/RingChart1.png"
              alt="Ring Measurement Side View"
              loading="lazy"
              className="max-w-[180px] sm:max-w-xs rounded shadow"
            />
            <img
              src="/home/RingChart2.png"
              alt="Ring Measurement Top View"
              loading="lazy"
              className="max-w-[180px] sm:max-w-xs rounded shadow"
            />
          </div>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Useful Tips
          </h2>
          <p className="sm:ml-10 text-xs sm:text-sm">
            There are a few environmental and physical factors that should be
            taken into consideration before deciding on the size of the ring you
            want to buy, but remember that when it comes to guessing your
            partner’s ring size, guess on the large side as it’s easier to size
            a ring down.{" "}
          </p>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Average Ring Sizes
          </h2>
          <p className="sm:ml-10 text-xs sm:text-sm">
            Keep in mind the average ring size range for women is between 9 and
            14 (India), while sizes commonly range from 17 to 22 (India) for
            men. If you have no other information available, it’s best to choose
            between these ranges.{" "}
          </p>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Time Of Day
          </h2>
          <p className="sm:ml-10 text-xs sm:text-sm">
            An ideal time to measure their finger size is in the evening. Most
            people’s fingers tend to be at their largest in the evening and
            smaller in the morning. Measuring your partner’s finger size in the
            evening will guarantee a comfortable fit.{" "}
          </p>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Optimal Temperature
          </h2>
          <p className="sm:ml-10 text-xs sm:text-sm">
            Fingers tend to react to temperatures, and can change size depending
            on the weather. The cold winter air will shrink fingers while the
            opposite happens in summer or when it’s warm and humid. Avoid
            measuring finger size outside in the very cold or very hot.{" "}
          </p>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Fingers Expand And Contract
          </h2>
          <p className="sm:ml-10 text-xs sm:text-sm">
            Other factors can cause fingers to grow such as exercising, water
            retention, pregnancy, ageing, and arthritis. Weight loss and low
            temperatures can cause fingers to decrease in size.{" "}
          </p>
        </section>

        <section className="mb-6 md:mb-8">
          <h2 className="text-md sm:text-xl font-normal mb-1 sm:mb-2">
            Thicker bands
          </h2>
          <p className="sm:ml-10 text-xs sm:text-sm">
            Thicker ring bands (larger than 6mm) will fit tighter. It is advised
            to always go for half a size up when purchasing a thicker band, for
            the ring to be comfortable.
          </p>
        </section>

        <section className="mb-8">
          <p className="sm:ml-10 text-xs sm:text-sm ">
            <i>
              {" "}
              Please note that the information above is provided for guidance
              only and Jupi Diamonds is not responsible for any errors that
              occur as a result of using this information.
            </i>
          </p>
        </section>

        <div className="container mx-auto sm:px-4 py-4 sm:py-8">
          <h1 className="text-xl font-medium text-center mb-3 sm:mb-6 text-black">
            Ring Size Chart
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-2 text-xs sm:text-sm border-gray-200 table-fixed cursor-pointer">
              <thead>
                <tr className="bg-gray text-black text-xs sm:text-sm">
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    Inside Diameter (mm)
                  </th>
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    United States & Canada
                  </th>
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    Europe
                  </th>
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    UK, Australia & South Africa
                  </th>
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    India
                  </th>
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    China
                  </th>
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    Singapore & Japan
                  </th>
                  <th className="py-3 px-4 border-2 border-gray-200 text-center font-medium">
                    Hong Kong
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 ">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.05
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    3
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    44
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    F
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    4
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    4
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.24
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    3.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    45
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    F.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.45
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    3.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    G
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    7.5
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.65
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    3.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    46
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    G.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.88
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    4
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    47
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    H
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    7
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    7
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15.09
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    4.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    H.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15.29
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    4.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    48
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    I
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15.49
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    4.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    J
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15.70
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    49
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    J.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15.90
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    5.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    50
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    K
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16.10
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    5.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    K.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16.31
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    5.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    51
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    L
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16.51
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    52
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    L.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    13
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16.71
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    M
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    13
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16.92
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    53
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    M.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    13
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    13
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.5
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17.12
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    6.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    N
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17.32
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    7
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    54
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    N.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17.53
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    7.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    55
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    O
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17.73
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    7.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    O.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17.93
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    7.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    56
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    P
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18.14
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    57
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    P.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    16
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18.34
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8.1
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Q
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18.54
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Q.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    R
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18.95
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    8.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    58
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    R.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    17
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19.15
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    59
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    S
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20.5
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19.35
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    S.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    18
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19.56
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    60
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    T
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19.76
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    9.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    61
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    T.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    19.96
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    U
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20.17
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    62
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    U.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    21
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    21
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    23
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20.37
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    V
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20.57
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    10.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    63
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    V.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    24
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20.78
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    64
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    W
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    25
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    20.98
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    W.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    21.18
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    65
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    X
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    21
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    23
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    26
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    21.39
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    11.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    66
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    X.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    21.59
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Y
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    27.5
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    21.79
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    67
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Z
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22.00
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Z.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22.20
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    12.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    68
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    24
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22.40
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    13
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    69
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22.61
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    13.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    70
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Z1
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    30
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    22.81
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    13.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    23.01
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    71
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Z2
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    23.22
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.25
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Z3
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    23.42
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.5
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    23.62
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    14.75
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    Z4
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    24.23
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    15
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                  <td className="py-2 px-4 border-2 border-gray-200 text-center">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RingSizeGuide;
