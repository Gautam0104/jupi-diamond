import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import { Toaster } from "sonner";
import { AuthContextProvider } from "./Context/Auth.jsx";
import { CurrencyProvider } from "./Context/CurrencyContext.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary.jsx";
import { DashboardProvider } from "./Context/DashboardContext.jsx";
import { WishlistProvider } from "./Context/WishlistContext.jsx";
import { CompareProvider } from "./Context/CompareContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      {/* <ErrorBoundary> */}
      <DashboardProvider>
        <CompareProvider>
        <WishlistProvider>
          <CurrencyProvider>
            <CartProvider>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
              />
              <Toaster richColors position="top-right" />
              <App />
            </CartProvider>
          </CurrencyProvider>
        </WishlistProvider>
        </CompareProvider>
      </DashboardProvider>
      {/* </ErrorBoundary> */}
    </AuthContextProvider>
  </BrowserRouter>
);
