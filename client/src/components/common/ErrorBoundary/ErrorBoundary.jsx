import React from "react";
import { gsap } from "gsap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.errorCardRef = React.createRef();
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      this.animateError();
    }
  }

  animateError = () => {
    if (!this.errorCardRef.current) return;

    gsap.set(this.errorCardRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.95
    });

    gsap.to(this.errorCardRef.current, {
      duration: 0.6,
      scale: 1,
      opacity: 1,
      y: 0,
      ease: "power3.out",
      onComplete: () => {
        gsap.to(this.errorCardRef.current, {
          duration: 2,
          scale: 1.02,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
      }
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
          <div 
            ref={this.errorCardRef}
            className="max-w-2xl w-full p-8 shadow-sm shadow-amber-700 transition-all duration-300 hover:shadow-md"
          >
            <img
              src="/error.png"
              alt="Error Img"
              loading="lazy"
              className="w-full h-auto max-w-xs mx-auto mb-6"
            />

            <div className="flex flex-col montserrat sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-brown text-xs sm:text-xs lg:text-xs xl:text-xs cp text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none hover:bg-opacity-90"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;