import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import FeaturesSection from "./FeaturesSection";
import TrendingCollection from "./TrendingCollection";
import DiamondShape from "./DiamondShape";
import Caret from "./Caret";
import RingStyle from "./RingStyle";
import MensCollection from "./MensCollection";
import GiftsByOccasion from "./Gifts";
import DailyWear from "./DailyWear";
import TestimonialCarousel from "./TestimonialCarousel";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";
import { fetchIndexPageData } from "../../api/Public/publicApi";
import { Skeleton } from "../../components/ui/skeleton";

const Home = React.memo(() => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchIndexPageData();
        setPageData(response.data.data);

        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="relative w-full h-[600px] bg-gray-400 overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />

        <div className="relative z-10 flex flex-col justify-center h-full px-8 max-w-7xl mx-auto text-left space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4 md:w-1/2 rounded" />
            <Skeleton className="h-10 w-2/3 md:w-1/3 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 md:w-2/3" />
            <Skeleton className="h-4 w-2/3 md:w-1/2" />
            <Skeleton className="h-4 w-1/2 md:w-1/3" />
          </div>

          <Skeleton className="h-10 w-40 rounded-full mt-4" />
        </div>
      </div>
    );

  return (
    <>
      <SEOProvider
        title="Jupi Diamonds Store | Exquisite Collections for Every Occasion"
        description="Discover our premium collection of jewelry including diamond rings, gold necklaces, and more. Handcrafted pieces for weddings, engagements, and daily wear."
        keywords={[
          "luxury jewelry",
          "diamond rings",
          "gold necklaces",
          "wedding jewelry",
          "engagement rings",
          "handcrafted jewelry",
          "premium jewelry collection",
        ]}
        image="/jupi-logo.png"
        url={window.location.href}
      />
      <Banner banners={pageData?.banner} />
      <FeaturesSection />
      <TrendingCollection products={pageData?.trendingProduct} />
      <DiamondShape shapes={pageData?.shpByDiamondShape} />
      <RingStyle styles={pageData?.shopByRingStyle} />
      <Caret />
      <MensCollection collections={pageData?.menCollection} />
      <GiftsByOccasion occasions={pageData?.occasions} />
      <DailyWear />
      <TestimonialCarousel reviews={pageData?.reviewFeedBack} />
    </>
  );
});

export default Home;
