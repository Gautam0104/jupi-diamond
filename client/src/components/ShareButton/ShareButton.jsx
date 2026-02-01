import { useState, useRef, useEffect } from "react";
import { FaShare, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  XIcon,
} from "react-share";
import { toast } from "sonner";

const ShareButton = ({
  url,
  title,
  price,
  variantTitle,
  className = "",
  iconSize = "default",
  position = "absolute",
}) => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const popupRef = useRef(null);

  const positionClasses = {
    absolute: "absolute right-4 top-4",
    fixed: "fixed right-4 top-4",
    static: "",
  };

  const iconSizes = {
    small: 20,
    default: 36,
  };

  const shareText = `${title} - ${variantTitle || title} for ${price}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowSharePopup(false);
      }
    };

    if (showSharePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSharePopup]);

  return (
    <>
      <button
        onClick={() => setShowSharePopup(true)}
        className={`${positionClasses[position]} cp bg-white/60 hover:bg-white p-2 rounded-full shadow-md ${className}`}
        aria-label="Share product"
      >
        <FaShare className="text-brown" />
      </button>

      {showSharePopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            ref={popupRef}
            className="bg-white rounded-md p-4 w-full max-w-md animate-fade-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md sm:text-lg font-semibold">
                Share this product
              </h3>
              <button
                onClick={() => setShowSharePopup(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close share menu"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-wrap gap-6 sm:gap-6 lg:gap-10 justify-center">
              <div className="flex flex-col items-center">
                <WhatsappShareButton
                  url={url}
                  title={shareText}
                  className="rounded-sm transition-transform hover:scale-110"
                >
                  <WhatsappIcon size={iconSizes[iconSize]} round={false} borderRadius={10} />
                </WhatsappShareButton>
                <span className="text-[10px] sm:text-xs mt-2">WhatsApp</span>
              </div>

              <div className="flex flex-col items-center">
                <TwitterShareButton
                  url={url}
                  title={shareText}
                  className="rounded-sm transition-transform hover:scale-110"
                >
                  <XIcon size={iconSizes[iconSize]} round={false} borderRadius={10} />
                </TwitterShareButton>
                <span className="text-[10px] sm:text-xs mt-2">Twitter</span>
              </div>
              <div className="flex flex-col items-center">
                <FacebookShareButton
                  url={url}
                  quote={shareText}
                  className="rounded-sm transition-transform hover:scale-110"
                >
                  <FacebookIcon size={iconSizes[iconSize]} round={false} borderRadius={10} />
                </FacebookShareButton>
                <span className="text-[10px] sm:text-xs mt-2">Facebook</span>
              </div>

              <div className="flex flex-col items-center">
                <EmailShareButton
                  url={url}
                  subject={`${title} - Jewelry Piece`}
                  body={`${shareText}\n\n`}
                  className="rounded-sm transition-transform hover:scale-110"
                >
                  <EmailIcon size={iconSizes[iconSize]} round={false} borderRadius={10} />
                </EmailShareButton>
                <span className="text-[10px] sm:text-xs mt-2">Email</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex border rounded-md overflow-hidden">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs sm:text-sm border-none outline-none bg-gray-50"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="bg-brown text-white px-4 py-2 text-xs sm:text-sm hover:bg-brown-dark transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
