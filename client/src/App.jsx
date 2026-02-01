import { useState } from "react";
import { useEffect } from "react";
import Home from "./Pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import About from "./Pages/About/Index";
import PrivacyPolicy from "./Pages/LegalDocuments/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "./Pages/LegalDocuments/TermsAndCondition/TermsAndCondition";
import ReturnAndRefund from "./Pages/LegalDocuments/ReturnAndRefund/ReturnAndRefund";
import ShippingPolicy from "./Pages/LegalDocuments/ShippingPolicy/ShippingPolicy";
import FAQPage from "./Pages/Faq/Faq";
import LabGrownDiamondReport from "./Pages/LabGrownDiamondReport/LabGrownDiamondReport";
import RingSizeGuide from "./Pages/RingSizeChart/RingSizeChart";
import LabGrownVsNaturalDiamond from "./Pages/LabGrown/LabGrown";
import FourCDiamonds from "./Pages/FourCDiamonds/FourCDiamonds";
import Wishlist from "./Pages/Wishlist/Wishlist";
import Checkout from "./Pages/Chechkout/Checkout";
import DiamondLoader from "./components/Loaders/LoadingPage";
import NotFound from "./components/NotFound/NotFound";
import Login from "./Pages/User/Login/Login";
import Signup from "./Pages/User/Signup/Signup";
import UserDashboard from "./Pages/User/Dashboard";
import Profile from "./Pages/User/Profile/Profile";
import Address from "./Pages/User/Address/Address";
import OrderHistory from "./Pages/User/OrderHistory/OrderHistory";
import ForgotPassword from "./Pages/User/ForgotPasssword/ForgotPasssword";
import NewPassword from "./Pages/User/NewPassword/NewPassword";
import EmailVerification from "./Pages/User/EmailVerification/EmailVerification";
import Footer from "./components/Footer/Footer";
import ProductPage from "./Pages/Product/ProductPage";
import ProductDetailPage from "./Pages/ProductDetail/ProductDetailPage";
import PaymentOptions from "./Pages/PaymentOption/PaymentOptions";
import Navbar from "./components/Header/Navbar";
import Contact from "./Pages/Contact";
import Test from "./Pages/Test/Test";
import UserRequireAuth from "./Pages/User/Login/UserRequireAuth";
import LoggedInRedirect from "./Pages/User/Login/LoggedInRedirect";
import AdminDashboard from "./Pages/Admin/Dashbaord/Index";
import MainContent from "./Pages/Admin/Dashbaord/MainContent";
import MetalMaster from "./Pages/Admin/MasterPanel/MetalMaster";
import MakingCharge from "./Pages/Admin/MasterPanel/MakingCharge";
import GemstoneMaster from "./Pages/Admin/MasterPanel/GemstoneMaster";
import Categories from "./Pages/Admin/MasterPanel/Categories";
import Collection from "./Pages/Admin/MasterPanel/Collection";
import AllProducts from "./Pages/Admin/Product/AllProducts";
import DraftProducts from "./Pages/Admin/Product/DraftProducts";
import OutOfStock from "./Pages/Admin/Product/OutOfStock";
import AdminLogin from "./Pages/Admin/AdminLogin/AdminLogin";
import Orders from "./Pages/Admin/Orders/Orders";
import CustomOrder from "./Pages/Admin/CustomOrder/CustomOrder";
import UserManagement from "./Pages/Admin/UserManagement/UserManagement";
import Coupon from "./Pages/Admin/Coupon/Coupon";
import Promotion from "./Pages/Admin/Promotion/Promotion";
import Reviews from "./Pages/Admin/Reviews/Reviews";
import AdminRequireAuth from "./Pages/Admin/AdminLogin/AdminRequireAuth.";
import AdminPersist from "./Pages/Admin/AdminLogin/AdminPersist";
import CreateProductForm from "./Pages/TestingProuductUpload/CreateProduct";
import JewelleryType from "./Pages/Admin/MasterPanel/JewelleryType";
import ProductStyle from "./Pages/Admin/MasterPanel/ProductStyle";
import ProductVariantSize from "./Pages/Admin/MasterPanel/ProductVariantSize";
import Occasion from "./Pages/Admin/MasterPanel/Occasion";
import Banners from "./Pages/Admin/CMS/Banners/Banners";
import AddProduct from "./Pages/Admin/Product/AddProduct";
import EditProduct from "./Pages/Admin/Product/EditProduct";
import GlobalDiscount from "./Pages/Admin/MasterPanel/GlobalDiscount";
import ProductDetailsPage from "./Pages/Admin/Product/ProductDetailsPage";
import Role from "./Pages/Admin/RBAC/Role/Role";
import Permission from "./Pages/Admin/RBAC/Permission/Permission";
import Staff from "./Pages/Admin/RBAC/Staff/Staff";
import MaterialColor from "./Pages/Admin/MasterPanel/MaterialColor";
import Support from "./Pages/Admin/Support/Support";
import AdminProfile from "./Pages/Admin/AdminProfile/AdminProfile";
import OrderDetail from "./Pages/Admin/Orders/OrderDetail";
import BangleSizeChart from "./Pages/BangalSizeChart/BangalSizeChart";
import BraceletSizeGuide from "./Pages/BraceletSizeGuide/BraceletSizeGuide";
import NecklacesSizeGuide from "./Pages/NecklacesSizeGuide/NecklacesSizeGuide";
import Success from "./components/common/Succes/Success";
import Failed from "./components/common/Failed/Failed";
import LegalDocs from "./Pages/Admin/CMS/LegalDocs/LegalDocs";
import FooterCmsPage from "./Pages/FooterCmsPage/FooterCmsPage";
import Currency from "./Pages/Admin/CMS/Currency/Currency";
import Shipping from "./Pages/Admin/CMS/Shipping/Shipping";
import BlogPage from "./Pages/Admin/CMS/BlogPage/BlogPage";
import BlogCategory from "./Pages/Admin/CMS/BlogCategory/BlogCategory";
import Blog from "./Pages/Blog/Blog";
import BlogDetail from "./Pages/BlogDetail/BlogDetail";
import MetalVariantHistory from "./Pages/Admin/MasterPanel/MetalVariantHistory";
import Gifts from "./Pages/Admin/Gifts/Gifts";
import OrderHistoryDetail from "./Pages/User/OrderHistory/OrderHistoryDetail";
import Tracking from "./Pages/Tracking/Tracking";
import MyGifts from "./Pages/User/MyGifts/MyGifts";
import CompareProducts from "./Pages/CompareProducts/CompareProducts";
import OrderReport from "./Pages/Admin/Analytics/OrderReport";
import SalesReport from "./Pages/Admin/Analytics/SalesReport";
import GemstoneMasterHistory from "./Pages/Admin/MasterPanel/GemstoneMasterHistory";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading time

    setIsLoading(true);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAuthPage =
    ["/login", "/signup", "/forgot-password"].includes(location.pathname) ||
    location.pathname.startsWith("/user-forgot-password/") ||
    location.pathname.startsWith("/customer/reset/password");

  const isAdminDashboard = location.pathname.startsWith("/admin");

  return (
    <>
      <div className="poppins conatiner mx-auto">
        {isLoading && location.pathname === "/" ? (
          <DiamondLoader />
        ) : (
          <>
            {!isAuthPage && !isAdminDashboard && <Navbar />}
            <Routes>
              <Route element={<LoggedInRedirect />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/auth/verifyemail"
                  element={<EmailVerification />}
                />
                <Route
                  path="/customer/reset/password"
                  element={<NewPassword />}
                />
              </Route>

              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/create" element={<CreateProductForm />} />
              {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              /> */}
              {/* <Route path="/return-and-refund" element={<ReturnAndRefund />} /> */}
              {/* <Route path="/shipping-policy" element={<ShippingPolicy />} /> */}
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/payment-options" element={<PaymentOptions />} />
              <Route path="/shop-all" element={<ProductPage />} />
              <Route
                path="/shop-all/details/:productVariantSlug"
                element={<ProductDetailPage />}
              />
              <Route
                path="/lab-grown-diamond-grading-report"
                element={<LabGrownDiamondReport />}
              />
              <Route path="/rings-size-chart" element={<RingSizeGuide />} />
              <Route path="/bangles-size-chart" element={<BangleSizeChart />} />
              <Route
                path="/bracelets-size-chart"
                element={<BraceletSizeGuide />}
              />
              <Route
                path="/necklaces-size-chart"
                element={<NecklacesSizeGuide />}
              />
              <Route path="/:slug" element={<FooterCmsPage />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route
                path="/lab-grown-vs-natural-diamonds"
                element={<LabGrownVsNaturalDiamond />}
              />
              <Route path="/diamonds-4cs" element={<FourCDiamonds />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/success" element={<Success />} />
              <Route path="/payment/failed" element={<Failed />} />
              <Route path="/track-order/:id" element={<Tracking />} />
              <Route path="/compare" element={<CompareProducts />} />

              <Route element={<UserRequireAuth />}>
                <Route element={<UserDashboard />}>
                  <Route path="/user/profile" element={<Profile />} />
                  <Route path="/user/address-book" element={<Address />} />
                  <Route path="/user/my-gifts" element={<MyGifts />} />
                  <Route
                    path="/user/order-history"
                    element={<OrderHistory />}
                  />
                </Route>
                <Route
                  path="/user/order-history/:id"
                  element={<OrderHistoryDetail />}
                />
              </Route>
              <Route element={<AdminPersist />}>
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>
              <Route element={<AdminRequireAuth />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<MainContent />} />{" "}
                  <Route path="dashboard" element={<MainContent />} />{" "}
                  <Route
                    path="master-panel/metal-master"
                    element={<MetalMaster />}
                  />
                  <Route
                    path="master-panel/metal-variant-history/:id"
                    element={<MetalVariantHistory />}
                  />
                  <Route
                    path="master-panel/material-color"
                    element={<MaterialColor />}
                  />
                  <Route
                    path="master-panel/gemstone-master"
                    element={<GemstoneMaster />}
                  />
                  <Route
                    path="master-panel/gemstone-master-history/:id"
                    element={<GemstoneMasterHistory />}
                  />
                  <Route
                    path="master-panel/making-charge-master"
                    element={<MakingCharge />}
                  />
                  <Route
                    path="master-panel/material-type"
                    element={<Categories />}
                  />
                  <Route
                    path="master-panel/collections"
                    element={<Collection />}
                  />
                  <Route
                    path="master-panel/jewellery-type"
                    element={<JewelleryType />}
                  />
                  <Route
                    path="master-panel/product-style"
                    element={<ProductStyle />}
                  />
                  <Route
                    path="master-panel/global-discount"
                    element={<GlobalDiscount />}
                  />
                  <Route
                    path="master-panel/size-management"
                    element={<ProductVariantSize />}
                  />
                  <Route path="master-panel/occasion" element={<Occasion />} />
                  <Route path="cms/banners" element={<Banners />} />
                  <Route path="cms/important-links" element={<LegalDocs />} />
                  <Route path="cms/currency" element={<Currency />} />
                  <Route path="cms/promotional-script" element={<Shipping />} />
                  <Route path="cms/blog-page" element={<BlogPage />} />
                  <Route path="cms/blog-category" element={<BlogCategory />} />
                  <Route
                    path="product/all-products"
                    element={<AllProducts />}
                  />
                  <Route path="product/add-product" element={<AddProduct />} />
                  <Route
                    path="product/edit-product/:id"
                    element={<EditProduct />}
                  />
                  <Route
                    path="product/product-details/:id"
                    element={<ProductDetailsPage />}
                  />
                  <Route
                    path="product/draft-products"
                    element={<DraftProducts />}
                  />
                  <Route
                    path="product/low-and-out-of-stock-products"
                    element={<OutOfStock />}
                  />
                  <Route path="rbac/roles" element={<Role />} />
                  <Route path="rbac/staff" element={<Staff />} />
                  <Route path="rbac/permissions" element={<Permission />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="gifts" element={<Gifts />} />
                  <Route
                    path="orders/order-details/:id"
                    element={<OrderDetail />}
                  />
                  <Route path="my-profile" element={<AdminProfile />} />
                  <Route path="support" element={<Support />} />
                  {/* <Route path="custom-orders" element={<CustomOrder />} /> */}
                  <Route path="manage-customer" element={<UserManagement />} />
                  <Route path="coupon" element={<Coupon />} />
                  {/* <Route path="promotions" element={<Promotion />} /> */}
                  <Route path="analytics/sales-reports" element={<SalesReport />} />
                  <Route path="analytics/order-reports" element={<OrderReport />} />
                  <Route path="reviews-and-ratings" element={<Reviews />} />

                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            {!isAuthPage && !isAdminDashboard   && <ScrollToTop />}
            {!isAuthPage && !isAdminDashboard && <Footer /> }
          </>
        )}
      </div>
    </>
  );
}

export default App;
