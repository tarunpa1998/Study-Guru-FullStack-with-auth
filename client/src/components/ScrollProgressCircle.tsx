import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollProgressCircle = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      
      // Calculate scroll percentage
      const percentage = Math.min(100, Math.round((scrolled / windowHeight) * 100));
      setScrollPercentage(percentage);
      
      // Show the button only when user has scrolled down a bit
      setIsVisible(scrolled > 300);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial calculation
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate the stroke-dashoffset based on the scroll percentage
  const circumference = 2 * Math.PI * 18; // 2 * PI * radius
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Only render the component when it's visible
  if (!isVisible) return null;

  return (
    <div className="scroll-progress-container" onClick={scrollToTop}>
      <svg className="scroll-progress-circle" width="50" height="50" viewBox="0 0 50 50">
        {/* Background circle */}
        <circle className="background" r="18" cx="25" cy="25" fill="transparent" />
        
        {/* Progress circle */}
        <circle 
          r="18" 
          cx="25" 
          cy="25" 
          fill="transparent"
          style={{ strokeDashoffset }}
        />
      </svg>
      <div className="scroll-to-top-button">
        <ChevronUp size={20} className="text-primary" />
      </div>
    </div>
  );
};

export default ScrollProgressCircle;