import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create SiteSettings Context
const SiteSettingsContext = createContext();

// Custom hook to use site settings
export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

// SiteSettings Provider component
export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/site-settings`);
      setSiteSettings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err.message);
      // Set fallback default settings
      setSiteSettings({
        contactInfo: {
          phone: ["+91 8899988816" "+91 9682669235"],
          email: ["info@gmbtravelskashmir.com", "gmbtourandtravels@gmail.com"],
          address: ["Main Office: Fateh Kadal G.M Bangroo Building Near J&K Bank Srinagar, Kashmir, India", "Branch: Dal Lake Area"],
          workingHours: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sun: 10:00 AM - 6:00 PM"],
          whatsapp: "+918899988816"
        },
        socialMedia: {
          facebook: "",
          instagram: "",
          twitter: "",
          youtube: "",
          linkedin: ""
        },
        companyInfo: {
          name: "G.M.B Travels Kashmir",
          tagline: "Discover Paradise on Earth",
          description: "Your trusted partner for exploring the magnificent beauty of Kashmir. We create unforgettable experiences that last a lifetime.",
          logoUrl: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u7oxyvzc_logo.jpg",
          aboutText: "With years of experience in Kashmir tourism, G.M.B Travels Kashmir has been the trusted companion for travelers seeking authentic experiences in the paradise on earth.",
          missionStatement: "We specialize in creating unforgettable journeys through Kashmir's breathtaking landscapes, from the serene Dal Lake to the snow-capped peaks of Gulmarg."
        },
        heroSection: {
          title: "Experience the Beauty of",
          subtitle: "Kashmir",
          description: "Discover the pristine valleys, serene lakes, and majestic mountains of Kashmir with our expertly crafted tour packages",
          backgroundImage: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg",
          ctaButtonText: "Explore Packages",
          secondaryCtaText: "Contact Us"
        },
        mapSettings: {
          embedUrl: "",
          latitude: 34.0837,
          longitude: 74.7973,
          zoomLevel: 12,
          address: "Srinagar, Kashmir, India"
        },
        seoSettings: {
          homeTitle: "G.M.B Travels Kashmir - Experience Paradise on Earth",
          homeDescription: "Discover Kashmir's beauty with our expertly crafted tour packages. Book your dream vacation today!",
          homeKeywords: ["Kashmir tours", "Kashmir travel", "Dal Lake", "Gulmarg", "Srinagar tours"],
          siteUrl: "https://gmbtravelskashmir.com",
          ogImage: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg"
        },
        businessStats: {
          yearsExperience: 10,
          happyCustomers: 500,
          tourPackages: 50,
          supportAvailability: "24/7"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const refreshSettings = () => {
    fetchSiteSettings();
  };

  const value = {
    siteSettings,
    loading,
    error,
    refreshSettings
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
