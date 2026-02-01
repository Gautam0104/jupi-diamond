import React, { useContext, useEffect, useState } from "react";
import { getMyGiftCards } from "../../../api/Public/publicApi";
import { CurrencyContext } from "../../../Context/CurrencyContext";
import { format, isAfter } from "date-fns";
import { Skeleton } from "../../../components/ui/skeleton";
import { ImGift } from "react-icons/im";
import { toast } from "sonner";

const MyGifts = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return isAfter(new Date(), new Date(expiryDate));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getMyGiftCards();
      setGifts(response.data?.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl tracking-wider text-xs sm:text-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">My Gifts</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:py-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-white px-3 sm:px-6 lg:px-3 xl:px-6 pt-6 pb-4 shadow-lg ring-1 ring-gray-200 rounded-lg"
            >
              <div className="absolute top-6 right-3 sm:right-6 lg:right-3 xl:right-6 z-0 h-16 w-16 rounded-full bg-gray-200 animate-pulse" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-24 bg-gray-200" />
                    <Skeleton className="h-5 w-32 bg-gray-200" />
                  </div>
                  <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-full border-2 border-gray-200 bg-gray-100 ml-4">
                    <Skeleton className="h-14 w-14 rounded-full bg-gray-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between w-full items-center bg-gray-50 rounded-lg px-3 py-1.5">
                    <Skeleton className="h-4 w-12 bg-gray-200" />
                    <Skeleton className="h-6 w-24 bg-gray-200" />
                  </div>
                  <div className="flex justify-between w-full items-center bg-gray-50 rounded-lg px-3 py-1.5">
                    <Skeleton className="h-4 w-12 bg-gray-200" />
                    <Skeleton className="h-6 w-20 bg-gray-200" />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-20 bg-gray-200" />
                    <Skeleton className="h-3 w-32 bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : gifts.length === 0 ? (
        <div className="text-center py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <ImGift className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="mt-4 imperial text-lg font-semibold text-black">
              No gift cards yet
            </h3>
            <p className="mt-2 marcellus text-gray-600">
              Your gift card collection is empty. When you receive one, it will
              appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-4 sm:py-4">
          {gifts.map((gift) => {
            const expired = isExpired(gift.expiresAt);
            return (
              <div
                key={gift.id}
                className={`group relative cursor-pointer overflow-hidden ${
                  expired ? "bg-gray-100" : "bg-white"
                } px-3 sm:px-6 lg:px-3 xl:px-6 pt-6 pb-2 sm:pb-4 shadow-lg ring-1 ${
                  expired ? "ring-gray-300" : "ring-gray-200"
                } transition-all duration-300 ${
                  expired ? "" : "hover:-translate-y-1 hover:shadow-xl"
                } rounded-lg`}
                aria-label={`Gift card ${gift.code} worth ${displayPrice(
                  gift.value
                )}`}
                onClick={() => {
                  // Copy the code to clipboard
                  navigator.clipboard
                    .writeText(gift.code)
                    .then(() => {
                      toast("Code copied to clipboard!");
                    })
                    .catch((err) => {
                      console.error("Failed to copy code: ", err);
                      toast.error("Failed to copy code");
                    });
                }}
              >
                <span
                  className={`absolute top-6 right-3 sm:right-6 lg:right-3 xl:right-6 z-0 h-14 sm:h-16 w-14 sm:w-16 rounded-full ${
                    expired ? "bg-gray-400" : "bg-[#C68B73]"
                  } transition-all duration-500 ${
                    expired ? "" : "group-hover:scale-[12]"
                  }`}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`text-2xl imperial font-semibold ${
                          expired ? "text-gray-600" : "text-gray-900"
                        } ${
                          expired ? "" : "group-hover:text-white"
                        } transition-colors duration-300`}
                      >
                        Gift
                      </h3>
                      <p
                        className={`text-md marcellus font-semibold ${
                          expired ? "text-gray-500" : "text-gray-700"
                        } ${
                          expired ? "" : "group-hover:text-white/90"
                        } transition-colors duration-300`}
                      >
                        VOUCHER CARD{" "}
                        <span>
                          {gift.isRedeemed === true ? "- Redeemed" : ""}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`grid h-14 sm:h-16 w-14 sm:w-16 flex-shrink-0 place-items-center rounded-full border-2 ${
                        expired ? "border-gray-400" : "border-[#C68B73]"
                      } bg-white transition-all duration-300 ${
                        expired ? "" : "group-hover:bg-white"
                      } ml-4`}
                      aria-hidden="true"
                    >
                      <img
                        src="/gift.png"
                        alt=""
                        className="h-10 sm:h-14 w-auto"
                        loading="lazy"
                      />
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div
                      className={`flex justify-between w-full items-center ${
                        expired ? "bg-gray-200" : "bg-gray-50"
                      } ${
                        expired ? "" : "group-hover:bg-white/10"
                      } rounded-lg px-3 py-1.5 transition-colors duration-300`}
                    >
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          expired ? "text-gray-500" : "text-gray-600"
                        } ${
                          expired ? "" : "group-hover:text-white/90"
                        } marcellus`}
                      >
                        Code
                      </span>
                      <span
                        className={`text-md sm:text-lg marcellus font-bold ${
                          expired ? "text-gray-600" : "text-gray-800"
                        } ${expired ? "" : "group-hover:text-white"}`}
                      >
                        {gift.code}
                      </span>
                    </div>

                    <div
                      className={`flex justify-between w-full items-center ${
                        expired ? "bg-gray-200" : "bg-gray-50"
                      } ${
                        expired ? "" : "group-hover:bg-white/10"
                      } rounded-lg px-3 py-1.5 transition-colors duration-300`}
                    >
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          expired ? "text-gray-500" : "text-gray-600"
                        } ${
                          expired ? "" : "group-hover:text-white/90"
                        } marcellus`}
                      >
                        Value
                      </span>
                      <span
                        className={`text-md sm:text-lg font-bold ${
                          expired ? "text-gray-600" : "text-[#C68B73]"
                        } ${expired ? "" : "group-hover:text-white"} imperial`}
                      >
                        {displayPrice(gift.value)}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`mt-4 pt-2 border-t ${
                      expired ? "border-gray-300" : "border-gray-100"
                    } ${
                      expired ? "" : "group-hover:border-white/20"
                    } transition-colors duration-300`}
                  >
                    <p
                      className={`flex justify-between items-center text-xs sm:text-sm lg:text-xs xl:text-sm ${
                        expired ? "text-gray-500" : "text-gray-500"
                      } ${
                        expired ? "" : "group-hover:text-white/80"
                      } marcellus`}
                    >
                      {gift.expiresAt ? (
                        <>
                          <span className="font-medium">
                            <span
                              className={`${
                                expired
                                  ? ""
                                  : "xl:text-gray-500 xl:group-hover:text-black/80"
                              }`}
                            >
                              Exp
                            </span>
                            ires on
                          </span>
                          <time
                            className={`font-medium ${
                              expired ? "text-red-600" : ""
                            }`}
                          >
                            {format(gift.expiresAt, "dd MMM yyyy, hh:mm a")}
                          </time>
                        </>
                      ) : (
                        <span className="font-medium">No expiry date</span>
                      )}
                    </p>
                    <p
                      className={`flex justify-between mt-2 items-center text-xs sm:text-sm lg:text-xs xl:text-sm ${
                        expired ? "text-gray-500" : "text-gray-500"
                      } ${
                        expired ? "" : "group-hover:text-white/80"
                      } marcellus`}
                    >
                      {gift.redeemedAt && (
                        <>
                          <span className="font-medium">
                            <span
                              className={`${
                                expired
                                  ? ""
                                  : "xl:text-gray-500 xl:group-hover:text-black/80"
                              }`}
                            >
                              Red
                            </span>
                            eemes on
                          </span>
                          <time
                            className={`font-medium ${
                              expired ? "text-red-600" : ""
                            }`}
                          >
                            {format(gift.redeemedAt, "dd MMM yyyy, hh:mm a")}
                          </time>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyGifts;
