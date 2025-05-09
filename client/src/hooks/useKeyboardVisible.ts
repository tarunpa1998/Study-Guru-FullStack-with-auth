import { useState, useEffect } from 'react';

/**
 * Custom hook to detect when mobile keyboard is visible
 * Only works reliably on mobile devices, returns false on desktop
 */
export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  useEffect(() => {
    // Function to check if we're on a mobile device
    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    // Only add listeners if we're on a mobile device
    if (!isMobile()) return;
    
    const handleFocus = () => {
      // When an input is focused, the keyboard is likely visible
      setIsKeyboardVisible(true);
      document.body.classList.add('keyboard-open');
    };
    
    const handleBlur = () => {
      // When an input loses focus, the keyboard is likely hidden
      setIsKeyboardVisible(false);
      document.body.classList.remove('keyboard-open');
    };
    
    // Get all input fields and textareas
    const inputs = document.querySelectorAll('input, textarea');
    
    // Add event listeners to all inputs
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });
    
    // Alternative approach for iOS which has better detection
    // when virtual keyboard appears/disappears
    const handleResize = () => {
      // On iOS, the window height decreases when keyboard appears
      // Visual viewport API is more reliable but not supported everywhere
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        
        // If viewport height is significantly less than window height
        // then keyboard is likely visible
        if (windowHeight - viewportHeight > 150) {
          setIsKeyboardVisible(true);
          document.body.classList.add('keyboard-open');
        } else {
          setIsKeyboardVisible(false);
          document.body.classList.remove('keyboard-open');
        }
      }
    };
    
    // Add resize event for iOS keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }
    
    // Clean up event listeners
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      
      document.body.classList.remove('keyboard-open');
    };
  }, []);
  
  return isKeyboardVisible;
}