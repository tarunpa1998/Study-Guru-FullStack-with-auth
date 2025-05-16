import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';

// Animation variants
const bubbleVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      damping: 15,
      stiffness: 200,
      duration: 0.4
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { 
      duration: 0.2 
    } 
  }
};

const waveAnimation = {
  wave: {
    rotate: [0, 15, -5, 15, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
      repeatDelay: 1,
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const typingIndicatorVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 15, 
      stiffness: 200,
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: -10, 
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    } 
  }
};

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  options?: string[];
  countries?: string[];
}

interface FormData {
  name: string;
  location: string;
  studyLevel: string;
  destinationCountry: string | null;
  subject: string;
  languageScore: string;
  startDate: string;
}

interface ChatBotProps {
  title?: string;
  subtitle?: string;
  initialMessage?: string;
  onMessageSend?: (message: string) => void;
  onOptionSelect?: (option: string) => void;
  className?: string;
  showContactInfo?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  contactPageUrl?: string;
  useStudyAbroadFlow?: boolean;
}

const ChatBot = ({
  title = "Study Guru Chat",
  subtitle = "We're here to help!",
  initialMessage = "Great to meet you! What's your full name?", // Changed default message
  onMessageSend,
  onOptionSelect,
  className = "",
  showContactInfo = false,
  contactEmail = "support@studyguruindia.com",
  contactPhone = "+91 99999-99999",
  whatsappNumber = "919999999999",
  contactPageUrl = "/contact",
  useStudyAbroadFlow = false
}: ChatBotProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState('350px');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    studyLevel: '',
    destinationCountry: null,
    subject: '',
    languageScore: '',
    startDate: ''
  });
  const [shouldShowContactInfo, setShouldShowContactInfo] = useState(false);
  
  // Study level options
  const studyLevelOptions = ["Bachelor's", "Master's", "PhD", "Diploma or Certification", "Other"];
  
  // Country options
  const countryOptions = [
    "USA", "UK", "Canada", "Australia", "Germany", 
    "France", "New Zealand", "Singapore", "Ireland", "Other"
  ];
  
  // Language score options
  const languageScoreOptions = [
    "IELTS 6.0-6.5", "IELTS 7.0-7.5", "IELTS 8.0+", 
    "TOEFL 80-90", "TOEFL 90-100", "TOEFL 100+",
    "PTE 50-60", "PTE 60-70", "PTE 70+",
    "Not taken yet", "Other"
  ];
  
  // Time options
  const timeOptions = [
    "Next 3 months", "3-6 months", "6-12 months", "Next year", "Not decided yet"
  ];
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Handle message scrolling and autofocus
  useEffect(() => {
    if (chatEndRef.current && messagesContainerRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      
      if (messagesContainerRef.current.scrollTo) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
    
    if (showInput && inputRef.current && isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [messages, showInput, isExpanded]);
  
  // Handle dynamic height based on message count
  useEffect(() => {
    if (messages.length === 0) {
      setExpandedHeight('320px');
    } else if (messages.length <= 2) {
      setExpandedHeight('420px');
    } else if (messages.length <= 4) {
      setExpandedHeight('480px');
    } else {
      setExpandedHeight('520px');
    }
  }, [messages.length]);
  
  // Handle keyboard events
  useEffect(() => {
    const originalViewportMeta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
    
    const handleFocus = () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      setKeyboardOpen(true);
      
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.dataset.scrollY = window.scrollY.toString();
      
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    };
    
    const handleBlur = () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta && originalViewportMeta) {
        viewportMeta.setAttribute('content', originalViewportMeta);
      }
      
      setKeyboardOpen(false);
      
      const scrollY = document.body.dataset.scrollY || '0';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY));
    };
    
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
      inputRef.current.addEventListener('blur', handleBlur);
    }
    
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus);
        inputRef.current.removeEventListener('blur', handleBlur);
      }
      
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta && originalViewportMeta) {
        viewportMeta.setAttribute('content', originalViewportMeta);
      }
    };
  }, []);

  const startChat = () => {
    setIsExpanded(true);
    addMessage('bot', initialMessage);
    setShowInput(true);
    setShowOptions(false);
    setCurrentStep(1);
  };

  const addMessage = (type: 'bot' | 'user', text: string, options?: string[], countries?: string[]) => {
    const newMessageId = Date.now() + Math.random();
    
    setLoading(false);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: newMessageId,
          type, 
          text,
          options,
          countries
        }
      ]);
    }, 50);
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput.trim() === '' && currentStep !== 0) return;
    
    // Initial greeting
    if (currentStep === 0) {
      if (userInput.toLowerCase().trim() === 'hi' || userInput.toLowerCase().trim() === 'hello') {
        startChat();
      } else {
        addMessage('user', userInput);
        setLoading(true);
        setTimeout(() => {
          addMessage('bot', 'Please say "Hi" to start the conversation 😊');
        }, 2000);
      }
      setUserInput('');
      return;
    }
    
    // If using custom handlers
    if (!useStudyAbroadFlow && onMessageSend) {
      addMessage('user', userInput);
      onMessageSend(userInput);
      setUserInput('');
      return;
    }
    
    // If using study abroad flow
    if (useStudyAbroadFlow) {
      processUserInput(userInput);
    } else {
      // Default behavior
      addMessage('user', userInput);
      setLoading(true);
      setTimeout(() => {
        addMessage('bot', 'Thanks for your message! This is a demo response.');
      }, 2000);
    }
    
    setUserInput('');
  };

  const processUserInput = (input: string) => {
    addMessage('user', input);
    
    setLoading(true);
    
    setTimeout(() => {
      switch (currentStep) {
        case 1: // Name collection
          setFormData(prev => ({ ...prev, name: input }));
          addMessage('bot', `Thanks, ${input}! Where are you from?`);
          setCurrentStep(2);
          break;
          
        case 2: // Location collection
          setFormData(prev => ({ ...prev, location: input }));
          addMessage('bot', 'Awesome! What level of study are you planning for?', studyLevelOptions);
          setShowOptions(true);
          setShowInput(false);
          setCurrentStep(3);
          break;
          
        case 3: // Custom study level
          setFormData(prev => ({ ...prev, studyLevel: input }));
          addMessage('bot', 'Do you have a specific country in mind for your studies?', ['Yes', 'No']);
          setShowOptions(true);
          setShowInput(false);
          setCurrentStep(4);
          break;
          
        case 5: // Subject collection
          setFormData(prev => ({ ...prev, subject: input }));
          addMessage('bot', 'Have you taken any language proficiency tests (IELTS/TOEFL/PTE)?', languageScoreOptions);
          setShowOptions(true);
          setShowInput(false);
          setCurrentStep(6);
          break;
          
        default:
          addMessage('bot', 'I didn\'t understand that. Please follow the prompts.');
          break;
      }
    }, 2000);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    
    if (option === 'Other' && currentStep !== 8) {
      setShowInput(true);
      setShowOptions(false);
      return;
    }
    
    processOption(option);
  };

  const processOption = (option: string) => {
    addMessage('user', option);
    
    setLoading(true);
    setTimeout(() => {
      switch (currentStep) {
        case 3: // Study level selection
          setFormData(prev => ({ ...prev, studyLevel: option }));
          addMessage('bot', 'Do you have a specific country in mind for your studies?', ['Yes', 'No']);
          setCurrentStep(4);
          break;
          
        case 4: // Destination country question
          if (option === 'Yes') {
            addMessage('bot', 'Which country are you aiming for?', undefined, countryOptions);
            setShowCountries(true);
            setShowOptions(false);
          } else {
            setFormData(prev => ({ ...prev, destinationCountry: null }));
            addMessage('bot', 'No problem! Some top destinations are USA, UK, Canada, Australia, and Germany. You can explore more on our country pages.');
            addMessage('bot', 'What subject or field are you interested in?');
            setShowInput(true);
            setShowOptions(false);
            setCurrentStep(5);
          }
          break;
          
        case 6: // Language score
          setFormData(prev => ({ ...prev, languageScore: option }));
          addMessage('bot', 'Perfect! One last question — when are you planning to start your studies abroad?', timeOptions);
          setCurrentStep(7);
          break;
          
        case 7: // Start date
          setFormData(prev => ({ ...prev, startDate: option }));
          addMessage('bot', 'Thank you for sharing your details! Our education experts will review your preferences and get in touch shortly. You\'re one step closer to studying abroad!');
          
          setTimeout(() => {
            addMessage('bot', 'Would you like to book a free consultation with our expert?', ['Yes, Book Now', 'No, thanks']);
            setCurrentStep(8);
          }, 2000);
          break;
          
        case 8: // Final CTA response
          if (option === 'Yes, Book Now') {
            addMessage('bot', 'Great! Please visit our contact page to schedule your free consultation. Our experts will help you plan your study abroad journey.');
            addMessage('bot', 'You can also reach us directly:');
            setShowInput(false);
            setShowOptions(false);
            setShouldShowContactInfo(true);
            setCurrentStep(9);
          } else {
            addMessage('bot', 'No problem! Feel free to browse our website for more information about studying abroad. We\'re here to help whenever you\'re ready.');
            setShowInput(false);
            setShowOptions(false);
            setCurrentStep(9);
          }
          break;
          
        default:
          break;
      }
    }, 2000);
  };

  const handleCountrySelect = (country: string) => {
    if (country === 'Other') {
      setShowInput(true);
      setShowCountries(false);
      return;
    }
    
    addMessage('user', country);
    setFormData(prev => ({ ...prev, destinationCountry: country }));
    
    setLoading(true);
    setTimeout(() => {
      addMessage('bot', 'What subject or field are you interested in?');
      setShowCountries(false);
      setShowInput(true);
      setCurrentStep(5);
    }, 2000);
  };

  const handleInitialHi = () => {
    setExpandedHeight('280px');
    setIsExpanded(true);
    
    setTimeout(() => {
      addMessage('user', 'Hi');
      
      setLoading(true);
      
      setTimeout(() => {
        addMessage('bot', initialMessage);
        setShowInput(true);
        setShowOptions(false);
        setCurrentStep(1);
      }, 2000);
    }, 300);
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className={`relative flex flex-col items-center transition-all duration-500 ease-in-out ${isExpanded ? 'min-h-[350px]' : 'min-h-[320px]'}`}>
        {/* Main chat container */}
        <motion.div 
          layout
          initial={{ height: 'auto', width: 'auto' }}
          animate={{ 
            height: isExpanded ? expandedHeight : 'auto',
            width: '100%'
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className={`bg-card border border-border rounded-3xl shadow-xl overflow-hidden flex flex-col w-full ${keyboardOpen ? 'keyboard-visible' : ''}`}
        >
          {/* Chat header */}
          <motion.div 
            layout
            className="p-5 bg-primary text-primary-foreground flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mr-4">
                <motion.div
                  animate="wave"
                  variants={waveAnimation}
                >
                  <svg className="h-8 w-8 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                  </svg>
                </motion.div>
              </div>
              <div>
                <h3 className="font-bold text-xl font-handwriting">{title}</h3>
                <p className="text-sm text-primary-foreground/80">{subtitle}</p>
              </div>
            </div>
            {isExpanded && (
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </motion.div>
          
          {/* Chat messages area */}
          {isExpanded && (
            <motion.div 
              layout
              className="flex-1 p-4 overflow-y-auto messages-container-wrapper bg-card"
              style={{ maxHeight: "350px" }} 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div ref={messagesContainerRef} className="messages-container">
                {/* All chat messages */}
                {messages.map((message) => (
                  <motion.div
                    key={`message-${message.id}`}
                    layout
                    variants={bubbleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      </div>
                    )}
                    
                    <div>
                      <div className={`rounded-2xl py-3 px-5 max-w-xs md:max-w-md inline-block ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-2' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        <p>{message.text}</p>
                      </div>
                      
                      {/* Options buttons if any */}
                      {message.options && showOptions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.options.map((option, idx) => (
                            <button
                              key={idx}
                              className="py-2 px-4 bg-accent hover:bg-accent/80 text-accent-foreground rounded-full text-sm transition-colors duration-200 border border-border"
                              onClick={() => handleOptionSelect(option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Country options */}
                      {message.countries && showCountries && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {message.countries.map((country, idx) => (
                            <button
                              key={idx}
                              className="py-2 px-4 bg-accent hover:bg-accent/80 text-accent-foreground rounded-full text-sm transition-colors duration-200 border border-border"
                              onClick={() => handleOptionSelect(country)}
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
                
              {/* Loading indicator in separate AnimatePresence */}
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="typing-indicator"
                    variants={typingIndicatorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex justify-start mb-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </div>
                    <div className="rounded-2xl py-3 px-5 bg-secondary text-secondary-foreground">
                      <div className="flex items-center space-x-2">
                        <div className="h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
                
              {/* Contact section */}
              {shouldShowContactInfo && currentStep === 9 && (
                <motion.div
                  key="contact-section"
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-8 bg-muted rounded-xl p-4 shadow-md"
                >
                  <h3 className="font-bold text-lg mb-2 text-foreground">Contact Us</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-foreground">{contactEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-foreground">{contactPhone}</span>
                    </div>
                    <div className="flex mt-4 gap-2">
                      <button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                        onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" className="mr-2">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg"
                        onClick={() => window.location.href = contactPageUrl}
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Add a separate section for initial contact info when showContactInfo is true but no conversation has started */}
              {showContactInfo && messages.length === 0 && (
                <motion.div
                  key="initial-contact-section"
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 bg-muted rounded-xl p-4 shadow-md"
                >
                  <h3 className="font-bold text-lg mb-2 text-foreground">Contact Us</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-foreground">{contactEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-foreground">{contactPhone}</span>
                    </div>
                    <div className="flex mt-4 gap-2">
                      <button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                        onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg"
                        onClick={() => window.location.href = contactPageUrl}
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={chatEndRef} />
            </motion.div>
          )}
          
          {/* Chat input area */}
          {isExpanded ? (
            <motion.div 
              layout
              className="p-4 border-t border-border"
            >
              {showInput && (
                <form onSubmit={handleUserInput} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 py-3 px-4 rounded-full bg-muted text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-colors"
                  >
                    <SendHorizontal className="h-5 w-5" />
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div 
              variants={bubbleVariants}
              initial="hidden"
              animate="visible"
              className="p-8 pb-4 flex flex-col items-center"
            >
              <button 
                onClick={handleInitialHi}
                className="bg-transparent border border-primary hover:bg-accent text-foreground text-lg font-medium rounded-full px-10 py-4 transition-all duration-300 hover:scale-105 w-full flex items-center justify-center gap-3 relative overflow-hidden"
              >
                <motion.span
                  animate={{
                    rotate: [0, 20, -20, 20, 0],
                    transition: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }
                  }}
                  className="text-2xl"
                >
                  👋
                </motion.span> 
                <span className="font-handwriting text-xl">Say Hi</span>
              </button>
              <p className="text-sm text-center mt-2 mb-0 text-muted-foreground">
                Chat with our education consultant
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatBot;









