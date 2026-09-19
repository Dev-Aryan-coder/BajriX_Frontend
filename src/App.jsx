import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home/HomePage';
import AboutUsPage from './pages/About/AboutUsPage';
import ServicesPage from './pages/Services/ServicesPage';
import ContactUsPage from './pages/Contact/ContactUsPage';
import ProductListPage from './pages/Products/ProductListPage';
import ProductDetailPage from './pages/Products/ProductDetailPage';
import SellerDashboardPage from './pages/Seller/SellerDashboardPage';
import AddListingPage from './pages/Seller/AddListingPage';
import EditListingPage from './pages/Seller/EditListingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import './App.css';

/**
 * Main Application Component:
 * Sets up client-side routing with all buyer and seller pages,
 * sticky pill Navbar, and consistent branding.
 */
function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="app-main-content">
          <Routes>
            {/* Buyer routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactUsPage />} />

            {/* Seller dashboard and listing management */}
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/listings/new" element={<AddListingPage />} />
            <Route path="/seller/add-listing" element={<AddListingPage />} />
            <Route path="/seller/listings/:id/edit" element={<EditListingPage />} />
            <Route path="/seller/edit-listing/:id" element={<EditListingPage />} />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/seller/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/seller/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
