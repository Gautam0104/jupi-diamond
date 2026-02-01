import React, { useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

const Success = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // 3D perspective container animation
    gsap.fromTo(".success-container", 
      { 
        opacity: 0,
        rotationY: -90,
        transformPerspective: 1000,
        transformOrigin: "left center"
      },
      { 
        opacity: 1,
        rotationY: 0,
        duration: 1.2,
        ease: "back.out(1.7)"
      }
    );

    // SVG checkmark drawing animation
    const checkmark = document.querySelector(".success-checkmark");
    const pathLength = checkmark.getTotalLength();
    
    gsap.set(checkmark, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    // 3D icon animation with depth
    gsap.fromTo(".success-icon", 
      { 
        scale: 0,
        rotationX: 180,
        z: -100
      }, 
      { 
        scale: 1,
        rotationX: 0,
        z: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.3,
        onComplete: () => {
          // Animate the checkmark drawing
          gsap.to(checkmark, {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.inOut"
          });
        }
      }
    );

    // 3D text animation with depth
    gsap.fromTo(".success-text", 
      { 
        opacity: 0,
        y: 30,
        z: -50,
        rotationX: 45
      }, 
      { 
        opacity: 1,
        y: 0,
        z: 0,
        rotationX: 0,
        duration: 0.8,
        delay: 0.6,
        stagger: 0.15,
        ease: "power3.out"
      }
    );

    // Add subtle 3D hover effect to button
    const btn = document.querySelector(".success-btn");
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        y: -2,
        z: 10,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
        duration: 0.3
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        y: 0,
        z: 0,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        duration: 0.3
      });
    });
  }, []);

  return (
    <div className="min-h-[60vh] sm:min-h-[80vh] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-4 perspective-1000">
      <div className="success-container max-w-md w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 sm:p-8 text-center transform-style-preserve-3d">
        {/* 3D icon with depth */}
        <div className="success-icon w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-[inset_0_-3px_6px_rgba(0,0,0,0.1)] transform-style-preserve-3d">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 transform translate-z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              className="success-checkmark"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {/* 3D effect for the icon */}
          <div className="absolute inset-0 rounded-full border-2 border-green-300 opacity-30 transform translate-z-5"></div>
        </div>
        
        {/* 3D text elements */}
        <h1 className="success-text text-xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 transform translate-z-0">
          Payment Successful! <span className="inline-block animate-bounce text-lg sm:text-xl">🎉</span>
        </h1>
        <p className="success-text text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 transform translate-z-0">
          Thank you for your purchase at Jupi Diamonds. Your order has been
          confirmed and will be processed soon.
        </p>
        <p className="success-text text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 transform translate-z-0">
          We've sent a confirmation email with your order details.
        </p>
        
        {/* 3D button with hover effect */}
        <Link
          to="/shop-all"
          className="success-btn inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium sm:font-semibold text-sm sm:text-base py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-md transition-all duration-300 transform translate-z-0"
        >
          Continue Shopping
        </Link>
        
        {/* 3D decorative elements */}
        <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-green-200 rounded-lg opacity-20 transform rotate-45 translate-z-10"></div>
        <div className="absolute -top-4 -right-4 w-10 h-10 sm:w-12 sm:h-12 bg-green-300 rounded-full opacity-20 transform translate-z-5"></div>
      </div>
    </div>
  );
};

export default Success;