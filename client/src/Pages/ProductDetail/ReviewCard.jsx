import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { fetchReviewsByVariant } from "../../api/Public/publicApi";
import { Skeleton } from "../../components/ui/skeleton";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import useFiltration from "../../Hooks/useFilteration";
import { Button } from "../../components/ui/button"; // Assuming you're using a Button component

const ReviewCard = ({ variantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchReviewsByVariant(variantId, {
        page: 1,
        limit: filters.limit || 5,
      });
      setReviews(response.data.data.reviews);
      // Check if there are more reviews available
      setHasMore(
        response.data.data?.pagination.totalCount > (filters.limit || 5)
      );
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [variantId, filters.limit]);

  const handleViewMore = () => {
    handleFilterChangeHook({
      target: {
        name: "limit",
        value: (parseInt(filters.limit) || 5) + 5,
      },
    });
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading)
    return (
      <div className="mx-auto py-4 xl:p-4 border-b border-orange-100">
        <h2 className="text-lg font-semibold mb-4">Ratings & Reviews</h2>

        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded border-b border-brown mb-4">
            <div className="flex justify-between p-4 bg-[#F1EEEE] items-center mb-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-[80px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </div>

            <div className="p-4 flex flex-col xl:flex-row justify-between items-start gap-4">
              <div className="max-w-4xl w-full space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="w-4 h-4 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-[150px]" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>

              <div className="w-full xl:w-auto">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  if (reviews.length === 0) return null;

  return (
    <div className="mx-auto py-4 xl:p-4 ">
      <h2 className="text-lg font-semibold mb-4">Ratings & Reviews</h2>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded border-b border-brown mb-4"
        >
          <div className="flex justify-between p-4 bg-[#F1EEEE] items-center sm:mb-2">
            <div className="flex items-center text-sm sm:text-base gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                {review.customer.firstName.charAt(0)}
                {review.customer.lastName.charAt(0)}
              </div>
              <span className="font-medium">
                {review.customer.firstName} {review.customer.lastName}
              </span>
            </div>
            <div className="text-sm text-right">
              <p className="text-[10px] sm:text-[11px] text-[#716E6E]">
                Review uploaded
              </p>
              <p className="text-xs sm:text-sm font-medium text-black">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>

          <div className="p-4 flex flex-col xl:flex-row justify-between items-start sm:gap-4">
            <div className="max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <div className="flex text-brown">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }
                      fill="currentColor"
                      stroke="currentColor"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold">
                  {review.reviewTitle || "No title"}
                </span>
              </div>

              <p className="text-gray-700 text-[10px] sm:text-sm mb-4">
                {review.reviewBody || "No review text provided"}
              </p>
            </div>

            {review.images && review.images.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-semibold mb-2">
                  Image Uploaded
                </p>
                <div className="flex flex-wrap gap-2">
                  {review.images.map((image, index) => (
                    <Zoom key={index}>
                      <img
                        src={image}
                        alt={`Review ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/80";
                        }}
                      />
                    </Zoom>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <>
            {/* DESKTOP VIEW */}
            <button
              onClick={handleViewMore}
              className="cursor-pointer hidden md:block bg-white shadow hover:bg-[#F1EEEE] border-b border-[#CE967E]  hover:border-[#F1EEEE]  px-8 py-1.5 text-xs sm:text-sm rounded  text-[#000] hover:text-black font-medium group transition-all duration-300 ease-in-out "
            >
              <div className="relative overflow-hidden">
                <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                  View
                </p>
                <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                  More
                </p>
              </div>
            </button>

            {/* MOBILE VIEW */}
            <button
              onClick={handleViewMore}
              className="cursor-pointer block  md:hidden bg-[#F1EEEE] border-b  border-brown  px-6 py-1.5 text-xs sm:text-sm rounded  text-[#000] hover:text-black font-medium group transition-all duration-300 ease-in-out "
            >
              <div className="relative overflow-hidden">
                <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                  View More
                </p>
                <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                  More
                </p>
              </div>
            </button>
          </>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
