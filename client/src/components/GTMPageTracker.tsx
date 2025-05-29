import { useEffect } from 'react';
import { useLocation } from 'wouter';

// Define the dataLayer type to avoid TypeScript errors
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const GTMPageTracker = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Push page view event to dataLayer
    window.dataLayer.push({
      event: 'pageview',
      page: {
        path: location,
        title: document.title,
        url: window.location.href
      }
    });
  }, [location]);

  return null; // This component doesn't render anything
};

export default GTMPageTracker;


