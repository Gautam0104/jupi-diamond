import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const Failed = () => {
  useEffect(() => {
     window.scrollTo(0, 0);
    gsap.fromTo(".failed-container", 
      { 
        opacity: 0,
        rotationY: 90,
        transformPerspective: 1000,
        transformOrigin: "right center"
      },
      { 
        opacity: 1,
        rotationY: 0,
        duration: 1.2,
        ease: "back.out(1.7)"
      }
    );

    const xMark = document.querySelectorAll(".failed-x path");
    const pathLengths = Array.from(xMark).map(path => path.getTotalLength());
    
    gsap.set(xMark, {
      strokeDasharray: (i) => pathLengths[i],
      strokeDashoffset: (i) => pathLengths[i]
    });

    gsap.fromTo(".failed-icon", 
      { 
        scale: 0,
        rotationX: -180,
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
          gsap.to(xMark, {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: "power2.inOut",
            stagger: 0.1
          });
        }
      }
    );

    gsap.fromTo(".failed-text", 
      { 
        opacity: 0,
        y: 30,
        z: -50,
        rotationX: -45
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

    const buttons = document.querySelectorAll(".failed-btn");
    buttons.forEach(btn => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          y: -2,
          z: 10,
          boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
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
    });
  }, []);

  return (
    <div className="min-h-[60vh] sm:min-h-[80vh] bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center px-4 py-4 perspective-1000">
      <div className="failed-container max-w-md w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 sm:p-8 text-center transform-style-preserve-3d">
        <div className="failed-icon w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-[inset_0_-3px_6px_rgba(0,0,0,0.1)] transform-style-preserve-3d">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 transform translate-z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              className="failed-x"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6"
            />
            <path
              className="failed-x"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 6l12 12"
            />
          </svg>
          <div className="absolute inset-0 rounded-full border-2 border-red-300 opacity-30 transform translate-z-5"></div>
        </div>
        
        <h1 className="failed-text text-xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 transform translate-z-0">
          Payment Failed <span className="inline-block animate-pulse">❌</span>
        </h1>
        <p className="failed-text text-xs  sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 transform translate-z-0">
          We're sorry, but there was an issue processing your payment for Jupi Diamonds.
        </p>
        <p className="failed-text text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 transform translate-z-0">
          Please try again or contact our support team for assistance.
        </p>
        
        <div className="space-x-3 sm:space-x-4">
          <Link
            to="/checkout"
            className="failed-btn inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium sm:font-semibold text-xs sm:text-sm lg:text-base py-2 px-4 sm:py-2 sm:px-6 rounded-lg shadow-md transition-all duration-300 transform translate-z-0"
          >
            Try Again
          </Link>
          <Link
            to="/contact-us"
            className="failed-btn inline-block bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-medium sm:font-semibold text-xs sm:text-sm lg:text-base py-2 px-4 sm:py-2 sm:px-6 rounded-lg shadow-md transition-all duration-300 transform translate-z-0"
          >
            Contact Support
          </Link>
        </div>
        
        <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-red-200 rounded-lg opacity-20 transform rotate-45 translate-z-10"></div>
        <div className="absolute -top-4 -right-4 w-10 h-10 sm:w-12 sm:h-12 bg-red-300 rounded-full opacity-20 transform translate-z-5"></div>
      </div>
    </div>
  );
};

export default Failed;