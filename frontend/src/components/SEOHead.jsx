import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '../hooks/useSiteSettings';

const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  ogImage,
  url = window.location.href 
}) => {
  const { siteSettings } = useSiteSettings();
  
  // Get SEO settings or use fallbacks
  const seoSettings = siteSettings?.seoSettings || {
    homeTitle: "G.M.B Travels Kashmir - Experience Paradise on Earth",
    homeDescription: "Discover Kashmir's beauty with our expertly crafted tour packages. Book your dream vacation today!",
    homeKeywords: ["Kashmir tours", "Kashmir travel", "Dal Lake", "Gulmarg", "Srinagar tours"],
    siteUrl: "https://gmbtravelskashmir.com",
    ogImage: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg"
  };

  const companyInfo = siteSettings?.companyInfo || {
    name: "G.M.B Travels Kashmir"
  };

  // Use provided values or fallback to site settings
  const pageTitle = title || seoSettings.homeTitle;
  const pageDescription = description || seoSettings.homeDescription;
  const pageKeywords = keywords.length > 0 ? keywords : seoSettings.homeKeywords;
  const pageOgImage = ogImage || seoSettings.ogImage;
  const pageUrl = url;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords.join(', ')} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageOgImage} />
      <meta property="og:site_name" content={companyInfo.name} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageOgImage} />
      
      {/* Additional SEO tags */}
      <meta name="author" content={companyInfo.name} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": companyInfo.name,
          "description": pageDescription,
          "url": seoSettings.siteUrl,
          "image": pageOgImage,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Srinagar",
            "addressRegion": "Kashmir",
            "addressCountry": "India"
          },
          "sameAs": Object.values(siteSettings?.socialMedia || {}).filter(url => url)
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;