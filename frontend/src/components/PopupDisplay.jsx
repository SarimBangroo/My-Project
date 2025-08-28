import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import axios from 'axios';

const PopupDisplay = ({ currentPage = 'home' }) => {
  const [popups, setPopups] = useState([]);
  const [visiblePopup, setVisiblePopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchActivePopups();
  }, []);

  useEffect(() => {
    if (popups.length > 0) {
      // Find the first popup that should be shown on the current page
      const pagePopup = popups.find(popup => 
        popup.showOnPages.includes(currentPage) && shouldShowPopup(popup)
      );
      
      if (pagePopup) {
        // Delay showing the popup slightly for better UX
        const timer = setTimeout(() => {
          setVisiblePopup(pagePopup);
          setShowPopup(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [popups, currentPage]);

  useEffect(() => {
    if (visiblePopup && showPopup) {
      // Auto-hide popup after display duration
      const timer = setTimeout(() => {
        handleClosePopup();
      }, visiblePopup.displayDuration);
      
      return () => clearTimeout(timer);
    }
  }, [visiblePopup, showPopup]);

  const fetchActivePopups = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/popups`);
      setPopups(response.data);
    } catch (error) {
      console.error('Error fetching popups:', error);
    }
  };

  const shouldShowPopup = (popup) => {
    // Check if popup was already shown recently (cookie check)
    const cookieKey = `popup_${popup.id}_shown`;
    const lastShown = localStorage.getItem(cookieKey);
    
    if (lastShown) {
      const lastShownTime = new Date(lastShown);
      const expiryTime = new Date(lastShownTime.getTime() + (popup.cookieExpiry * 60 * 60 * 1000));
      
      if (new Date() < expiryTime) {
        return false; // Don't show popup if still within cookie expiry period
      }
    }
    
    // Check if popup is within its date range
    const now = new Date();
    const startDate = new Date(popup.startDate);
    const endDate = popup.endDate ? new Date(popup.endDate) : null;
    
    if (now < startDate) return false;
    if (endDate && now > endDate) return false;
    
    return true;
  };

  const handleClosePopup = () => {
    if (visiblePopup) {
      // Set cookie to remember that popup was shown
      const cookieKey = `popup_${visiblePopup.id}_shown`;
      localStorage.setItem(cookieKey, new Date().toISOString());
    }
    
    setShowPopup(false);
    setTimeout(() => {
      setVisiblePopup(null);
    }, 300); // Delay to allow animation
  };

  const handlePopupClick = () => {
    if (visiblePopup?.linkUrl) {
      window.open(visiblePopup.linkUrl, '_blank');
    }
    handleClosePopup();
  };

  if (!visiblePopup || !showPopup) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        showPopup ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClosePopup}
    >
      <div 
        className={`relative max-w-md w-full mx-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
          showPopup ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{ 
          backgroundColor: visiblePopup.backgroundColor,
          color: visiblePopup.textColor 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40"
          onClick={handleClosePopup}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
        
        <div className="p-6 text-center">
          {/* Image */}
          {visiblePopup.imageUrl && (
            <div className="mb-4">
              <img 
                src={visiblePopup.imageUrl} 
                alt={visiblePopup.title}
                className="w-20 h-20 object-cover rounded-full mx-auto"
              />
            </div>
          )}
          
          {/* Content */}
          <h2 className="text-xl font-bold mb-3">{visiblePopup.title}</h2>
          <p className="text-sm opacity-90 mb-6 leading-relaxed">
            {visiblePopup.content}
          </p>
          
          {/* Action Button */}
          <Button
            onClick={handlePopupClick}
            className="px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: visiblePopup.buttonColor,
              color: '#ffffff'
            }}
          >
            {visiblePopup.buttonText}
          </Button>
          
          {/* Type Badge */}
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 text-xs rounded-full ${
              visiblePopup.popupType === 'offer' ? 'bg-green-500 bg-opacity-20' :
              visiblePopup.popupType === 'announcement' ? 'bg-blue-500 bg-opacity-20' :
              visiblePopup.popupType === 'news' ? 'bg-purple-500 bg-opacity-20' :
              visiblePopup.popupType === 'alert' ? 'bg-red-500 bg-opacity-20' :
              'bg-gray-500 bg-opacity-20'
            }`}>
              {visiblePopup.popupType.charAt(0).toUpperCase() + visiblePopup.popupType.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupDisplay;