import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] sm:min-h-[60vh] flex items-center justify-center bg-gray-50 poppins">
      <section className="w-full max-w-4xl py-12 px-6 sm:px-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-6">
          <h1 className="text-5xl sm:text-9xl font-bold text-brown opacity-90">
            404
          </h1>

          <h2 className="text-md sm:text-4xl font-bold text-brown">
            Oops! Page Not Found
          </h2>

          <p className="text-sm sm:text-xl text-black max-w-xl">
            The page you're looking for doesn't exist or has been removed.
          </p>

          <Link to="/" className="mt-6">
            <button
              type="button"
              className="px-6 py-2 text-xs sm:text-sm sm:py-3 cursor-pointer flex items-center gap-2 group text-white rounded-lg button-brown  font-medium transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
            >
              <IoArrowBack className="h-5 w-5 group-hover:-translate-x-2 transition-all duration-300 ease-in-out" />
              Back to Home
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
