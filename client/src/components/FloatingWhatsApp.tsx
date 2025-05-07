import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  // Set initial position to left side at 70% of screen height
  const defaultPosition = {
    x: 15, // Closer to edge (15px instead of 20px)
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
    
    // Show message shortly after component mounts
    const timer = setTimeout(() => {
      setShowMessage(true);
      
      // Auto-hide message after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }, 1500);
    
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
      snappedX = viewportWidth - (buttonRef.current?.offsetWidth || 60) - 15; // Closer to edge
    } else {
      // Snap to left side
      snappedX = 15; // Closer to edge
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
          className={`absolute ${isOnRightSide ? 'right-16' : 'left-16'} top-0 transform -translate-y-1/4 bg-white text-gray-800 p-3 rounded-lg shadow-md animate-fadeIn max-w-[180px] text-sm`}
          style={{
            backgroundColor: '#DCF8C6', // WhatsApp message bubble color
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        >
          <div className="relative">
            {/* Triangle for the message bubble */}
            <div 
              className={`absolute top-1/2 ${isOnRightSide ? 'right-full -mr-1.5' : 'left-full -ml-1.5'} -translate-y-1/2`}
              style={{
                width: '0',
                height: '0',
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderRight: isOnRightSide ? 'none' : '8px solid #DCF8C6',
                borderLeft: isOnRightSide ? '8px solid #DCF8C6' : 'none',
              }}
            ></div>
            
            <p className="font-medium mb-1">Hi there! 👋</p>
            <p>Chat with us or call us now</p>
          </div>
        </div>
      )}
      
      {/* WhatsApp Button */}
      <div 
        className="rounded-full bg-white p-3 shadow-md flex items-center justify-center"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleWhatsAppClick}
      >
        <FaWhatsapp 
          className="text-[#25D366] h-7 w-7 md:h-8 md:w-8" 
          aria-hidden="true" 
        />
      </div>
      <span className="sr-only">Contact us on WhatsApp</span>
    </div>
  );
};

export default FloatingWhatsApp;