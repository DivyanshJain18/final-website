import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ScrollToTop } from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import ITServices from './pages/ITServices';
import FAQPage from './pages/FAQPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

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
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/it-services" element={<ITServices />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQPage />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}
