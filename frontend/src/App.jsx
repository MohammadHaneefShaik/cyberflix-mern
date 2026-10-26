import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BuilderPage from './pages/BuilderPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={
              <ProtectedRoute><CheckoutPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            {/* Admin routes — all render AdminDashboardPage which reads URL to switch view */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
        {/* CartDrawer reads isOpen state from store */}
        <CartDrawer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141414',
              color: '#E5E5E5',
              border: '1px solid #222222',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '8px',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#141414' } },
            error: { iconTheme: { primary: '#E53E2D', secondary: '#141414' } },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
