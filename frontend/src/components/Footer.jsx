import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Separator } from './ui/separator';
import { useSiteSettings } from '../hooks/useSiteSettings';

const Footer = () => {
  const { siteSettings } = useSiteSettings();

  // Get dynamic content or fallback to defaults
  const companyInfo = siteSettings?.companyInfo || {
    name: 'G.M.B Travels Kashmir',
    tagline: 'Paradise Awaits',
    description: 'Your trusted partner for exploring the magnificent beauty of Kashmir. We create unforgettable experiences that last a lifetime.',
    logo: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u7oxyvzc_logo.jpg'
  };

  const contactInfo = siteSettings?.contactInfo || {
    phone: ['+91 98765 43210'],
    email: ['info@gmbtravelskashmir.com'],
    address: ['Srinagar, Kashmir, India']
  };

  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={companyInfo.logo} 
                alt={companyInfo.name} 
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h5 className="text-lg font-bold">{companyInfo.name}</h5>
                <p className="text-slate-300 text-sm">{companyInfo.tagline}</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {companyInfo.description}
            </p>
          </div>
          
          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/packages" className="hover:text-amber-400 transition-colors">Packages</Link></li>
              <li><Link to="/book-cab" className="hover:text-amber-400 transition-colors">Book Cab</Link></li>
              <li><Link to="/testimonials" className="hover:text-amber-400 transition-colors">Testimonials</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
              <li className="pt-2 border-t border-slate-600 space-y-1">
                <Link to="/admin/login" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                  <span className="mr-1">🔐</span> Admin Login
                </Link>
                <Link to="/team/login" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center">
                  <span className="mr-1">👥</span> Team Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4">Services</h5>
            <ul className="space-y-2 text-slate-300">
              <li>Kashmir Tour Packages</li>
              <li>Hotel & Houseboat Bookings</li>
              <li>Transportation Services</li>
              <li>Adventure Tours</li>
              <li>Cultural Experiences</li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-semibold mb-4">Contact Info</h5>
            <div className="space-y-3 text-slate-300">
              {contactInfo.phone && contactInfo.phone.length > 0 && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" />
                  <span>{contactInfo.phone[0]}</span>
                </div>
              )}
              {contactInfo.email && contactInfo.email.length > 0 && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4" />
                  <span>{contactInfo.email[0]}</span>
                </div>
              )}
              {contactInfo.address && contactInfo.address.length > 0 && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" />
                  <span>{contactInfo.address[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="bg-slate-600 mb-8" />
        
        <div className="text-center text-slate-300">
          <p>&copy; 2024 {companyInfo.name}. All rights reserved. | Experience Paradise on Earth</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;