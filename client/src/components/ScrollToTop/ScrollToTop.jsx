import { useState, useEffect } from "react";
import { IoCaretUpCircle } from "react-icons/io5";
import { useLocation } from "react-router-dom"; 

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    const currentUrl = location.pathname + location.search;
    
    if (currentUrl.includes('/shop-all?') || currentUrl === '/shop-all') {
      setShouldHide(true);
    } else {
      setShouldHide(false);
    }
  }, [location]); 

  const toggleVisibility = () => {
    if (shouldHide) return;
    
    if (window.pageYOffset > window.innerHeight / 2) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const totalScroll = docHeight - windowHeight;
    const percentage = (scrollTop / totalScroll) * 100;
    setScrollPercentage(percentage);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!shouldHide) {
      window.addEventListener("scroll", toggleVisibility);
      toggleVisibility();
    }
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [shouldHide]);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference;

  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-20">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="group relative bg-[#C68B73]/70 backdrop-blur-md border border-white/20 cp rounded-full p-2 shadow-lg 
                transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] 
                hover:bg-[#C68B73]/90 hover:shadow-glow hover:border-white/40
                active:scale-90 focus:outline-none"
          aria-label="Scroll to top"
        >
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="25"
              cy="25"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-white transition-all duration-300 ease-out"
            />
          </svg>

          <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/30 group-hover:animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>

          <IoCaretUpCircle className="relative w-7 sm:w-10 h-7 sm:h-10 text-white drop-shadow-md transition-transform duration-300 " />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;