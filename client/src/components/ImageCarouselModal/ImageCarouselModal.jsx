import { useEffect, useRef, useState } from "react";
import { FaSearchMinus, FaSearchPlus, FaTimes } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaExpand } from "react-icons/fa6";

const ImageCarouselModal = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const imageRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    resetZoom();
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    resetZoom();
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 1));
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    resetZoom();
  }, [currentIndex]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      setShowControls(true);
      timer = setTimeout(() => setShowControls(false), 3000);
    };

    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center marcellus"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className={`absolute  left-5 sm:left-4 z-10 bg-white hover:bg-black/50 text-black hover:text-white cp p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out ${showControls ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <FaChevronLeft className="size-6 sm:size-8"  />
        </button>

        {/* Main Image Container */}
        <div 
          className="relative overflow-hidden max-w-[90vw] max-h-[90vh]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {images[currentIndex].endsWith(".mp4") ? (
            <video
              src={images[currentIndex]}
              autoPlay
              loop
              muted
              playsInline
              className="object-contain max-w-full max-h-[80vh]"
            />
          ) : (
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt={`Jewelry view ${currentIndex + 1}`}
              className="object-contain max-w-full max-h-[80vh] cursor-grab"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
              }}
            />
          )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className={`absolute right-5 sm:right-4 z-10 bg-white hover:bg-black/50 text-black hover:text-white cp p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out  ${showControls ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <FaChevronRight className="size-6 sm:size-8" />
        </button>

        {/* Dot Indicators */}
        <div className={`absolute bottom-8 left-0 right-0 flex justify-center gap-3 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${currentIndex === idx ? 'bg-brown w-6' : 'bg-black/70 opacity-70'}`}
            />
          ))}
        </div>

        {/* Control Buttons */}
        <div className={`absolute top-6 right-6 flex gap-3 z-10 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              zoomIn();
            }}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            disabled={scale >= 3}
            style={{ 
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            title="Zoom in"
          >
            <FaSearchPlus size={18} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              zoomOut();
            }}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            disabled={scale <= 1}
            style={{ 
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            title="Zoom out"
          >
            <FaSearchMinus size={18} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            style={{ 
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <FaExpand size={18} />
          </button>
          <button 
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
            style={{ 
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            title="Close"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Image Counter */}
        <div className={`absolute bottom-20 text-black text-sm font-medium tracking-wider transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-brown">{currentIndex + 1}</span> / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselModal;