import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { ScrollToTop } from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import ITServices from './pages/ITServices';
import FAQPage from './pages/FAQPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import PCBuilder from './pages/PCBuilder';
import ThreeDPrintersFilaments from './pages/ThreeDPrintersFilaments';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BecomeAReseller from './pages/BecomeAReseller';
import Careers from './pages/Careers';
import CategoryProductRouter from './pages/CategoryProductRouter';

import { Layout } from './components/Layout';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminSetup from './pages/admin/Setup';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminSubcategories from './pages/admin/Subcategories';
import AdminSubsubcategories from './pages/admin/Subsubcategories';
import AdminNestedSubcategories from './pages/admin/NestedSubcategories';
import AdminOrders from './pages/admin/Orders';

// Placeholder components for now
const Categories = () => (
  <Layout>
    <div className="text-white">Categories Page</div>
  </Layout>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/pc-builder" element={<PCBuilder />} />
                <Route path="/3d-printers-filaments" element={<ThreeDPrintersFilaments />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/3d-printers/:slug" element={<CategoryProductRouter />} />
                <Route path="/robotic-components/:slug" element={<CategoryProductRouter />} />
                <Route path="/computer-components/:slug" element={<CategoryProductRouter />} />
                <Route path="/tools/:slug" element={<CategoryProductRouter />} />
                <Route path="/c/:categorySlug/:slug" element={<CategoryProductRouter />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/cart" element={<Cart />} />
                
                <Route path="/about" element={<About />} />
                <Route path="/it-services" element={<ITServices />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/become-a-reseller" element={<BecomeAReseller />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />

                {/* Admin Routes */}
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="subcategories" element={<AdminSubcategories />} />
                  <Route path="subsubcategories" element={<AdminSubsubcategories />} />
                  <Route path="nested-subcategories" element={<AdminNestedSubcategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
              </Routes>
            </CartProvider>
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
