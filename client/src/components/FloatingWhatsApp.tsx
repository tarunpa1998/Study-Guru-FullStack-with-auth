import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  // Set initial position to left side at 70% of screen height
  const defaultPosition = {
    x: 4, // Extremely close to edge (4px instead of 8px)
    y: Math.round(window.innerHeight * 0.7)
  };
  
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [showMessage, setShowMessage] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Load saved position from localStorage on component mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('whatsappButtonPosition');
    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        setPosition(parsedPosition);
      } catch (e) {
        console.error('Error parsing saved position:', e);
      }
    }
    
    // Show message 8 seconds after component mounts
    const timer = setTimeout(() => {
      setShowMessage(true);
      
      // Auto-hide message after 8 seconds
      const hideTimer = setTimeout(() => {
        setShowMessage(false);
      }, 8000);
      
      return () => clearTimeout(hideTimer);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('whatsappButtonPosition', JSON.stringify(position));
  }, [position]);

  // Handle mouse/touch down events to start dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setShowMessage(false); // Hide message when dragging starts
    
    // Get the starting position based on event type (mouse or touch)
    if ('clientX' in e) {
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    } else {
      const touch = e.touches[0];
      setStartPosition({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
    
    // Prevent default behavior
    e.preventDefault();
  };

  // Handle mouse/touch move events during dragging
  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    let clientX, clientY;
    
    // Get coordinates based on event type
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    }
    
    // Calculate new position with smoother animation
    const newX = clientX - startPosition.x;
    const newY = clientY - startPosition.y;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    
    // Determine which side to snap to (left or right)
    let snappedX = newX;
    if (newX > viewportWidth / 2) {
      // Snap to right side
      snappedX = viewportWidth - (buttonRef.current?.offsetWidth || 50) - 4; // Extremely close to edge
    } else {
      // Snap to left side
      snappedX = 4; // Extremely close to edge
    }
    
    // Keep button within vertical bounds of the viewport
    const buttonHeight = buttonRef.current?.offsetHeight || 60;
    const maxY = window.innerHeight - buttonHeight / 2 - 20;
    const minY = buttonHeight / 2 + 20;
    const boundedY = Math.max(minY, Math.min(newY, maxY));
    
    setPosition({
      x: snappedX,
      y: boundedY
    });
  };

  // Handle mouse/touch up events to stop dragging
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag, { passive: false });
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  // Handle click on the WhatsApp button
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // Only navigate if not currently dragging
    if (!isDragging) {
      window.open('https://wa.me/1234567890', '_blank');
    }
    e.stopPropagation();
  };

  // Calculate which side the button is on to position the message bubble
  const isOnRightSide = position.x > window.innerWidth / 2;

  return (
    <div
      ref={buttonRef}
      className={`fixed z-50 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
        transition: isDragging ? 'none' : 'transform 0.2s ease, top 0.3s ease, left 0.3s ease'
      }}
    >
      {/* WhatsApp Chat Bubble */}
      {showMessage && (
        <div 
          className={`absolute ${isOnRightSide ? 'right-12' : 'left-12'} top-0 transform -translate-y-1/2 animate-bubbleIn`}
          style={{
            maxWidth: '260px',
            minWidth: '200px',
          }}
        >
          <div 
            className="relative py-2 px-3 text-sm text-black dark:text-black"
            style={{
              backgroundColor: '#DCF8C6', // WhatsApp message bubble color
              borderRadius: '7.5px',
              boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
              width: 'fit-content',
            }}
          >
            {/* Triangle for the message bubble */}
            <div 
              className={`absolute top-1/2 ${isOnRightSide ? 'right-full -mr-1' : 'left-full -ml-1'} -translate-y-1/2`}
              style={{
                width: '0',
                height: '0',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: isOnRightSide ? 'none' : '6px solid #DCF8C6',
                borderLeft: isOnRightSide ? '6px solid #DCF8C6' : 'none',
              }}
            ></div>
            
            <p className="font-medium mb-1 text-black dark:text-black">Hi there! 👋</p>
            <p className="text-black dark:text-black">Chat with us or call us now</p>
            
            {/* WhatsApp timestamp */}
            <div className="text-right mt-1" style={{ fontSize: '11px', color: 'rgba(0,0,0,0.45)' }}>
              {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              <span className="ml-1">✓</span>
            </div>
          </div>
        </div>
      )}
      
      {/* WhatsApp Button - With transparent background and outline */}
      <div 
        className="rounded-full flex items-center justify-center"
        style={{ 
          width: '50px', 
          height: '50px',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(5px)',
          border: '1.5px solid rgba(255,255,255,0.7)'
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleWhatsAppClick}
      >
        <FaWhatsapp 
          className="h-9 w-9" 
          style={{
            color: '#25D366',
            filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.2))'
          }}
          aria-hidden="true" 
        />
      </div>
      <span className="sr-only">Contact us on WhatsApp</span>
    </div>
  );
};

export default FloatingWhatsApp;