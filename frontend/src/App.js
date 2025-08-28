import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { SiteSettingsProvider } from './hooks/useSiteSettings';
import PopupDisplay from './components/PopupDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Testimonials from './pages/Testimonials';
import BookCab from './pages/BookCab';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import TeamLogin from './pages/TeamLogin';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPackages from './pages/admin/AdminPackages';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminImages from './pages/admin/AdminImages';
import AdminBookings from './pages/admin/AdminBookings';
import AdminTeam from './pages/admin/AdminTeam';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import AdminPopups from './pages/admin/AdminPopups';
import AdminBlog from './pages/admin/AdminBlog';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminMediaManager from './pages/admin/AdminMediaManager';

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <BrowserRouter>
          <SiteSettingsProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <Home />
                  <Footer />
                  <PopupDisplay currentPage="home" />
                </>
              } />
              <Route path="/packages" element={
                <>
                  <Header />
                  <Packages />
                  <Footer />
                  <PopupDisplay currentPage="packages" />
                </>
              } />
              <Route path="/packages/:id" element={
                <>
                  <Header />
                  <PackageDetail />
                  <Footer />
                  <PopupDisplay currentPage="package-detail" />
                </>
              } />
              <Route path="/testimonials" element={
                <>
                  <Header />
                  <Testimonials />
                  <Footer />
                  <PopupDisplay currentPage="testimonials" />
                </>
              } />
              <Route path="/book-cab" element={
                <>
                  <Header />
                  <BookCab />
                  <Footer />
                  <PopupDisplay currentPage="book-cab" />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <Contact />
                  <Footer />
                  <PopupDisplay currentPage="contact" />
                </>
              } />
              <Route path="/blog" element={
                <>
                  <Header />
                  <Blog />
                  <Footer />
                  <PopupDisplay currentPage="blog" />
                </>
              } />
              <Route path="/blog/:slug" element={
                <>
                  <Header />
                  <BlogPost />
                  <Footer />
                </>
              } />
              
              {/* Authentication Routes */}
              <Route path="/team/login" element={<TeamLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/packages" element={<AdminPackages />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/images" element={<AdminImages />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/team" element={<AdminTeam />} />
              <Route path="/admin/site-settings" element={<AdminSiteSettings />} />
              <Route path="/admin/popups" element={<AdminPopups />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/vehicles" element={<AdminVehicles />} />
              <Route path="/admin/media" element={<AdminMediaManager />} />
            </Routes>
            <Toaster />
          </SiteSettingsProvider>
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
}

export default App;