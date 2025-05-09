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
      duration: 0.2,
      ease: "easeInOut"
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

// Component implementation
const HomeChatBot = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    studyLevel: '',
    destinationCountry: null,
    subject: '',
    languageScore: '',
    startDate: ''
  });
  const [showInput, setShowInput] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [showCountries, setShowCountries] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Study level options
  const studyLevelOptions = ["Bachelor's", "Master's", "PhD", "Diploma or Certification", "Other"];
  
  // Country options
  const countryOptions = [
    "USA", "UK", "Canada", "Australia", "Germany", 
    "France", "New Zealand", "Singapore", "Ireland", "Other"
  ];
  
  // Time options
  const timeOptions = ["Within 6 months", "This year", "Next year", "Not sure yet"];
  
  // Language score options
  const languageScoreOptions = ["Yes", "No", "Planning to take it soon"];

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Focus on the input field after adding messages if input is visible
    if (showInput && inputRef.current && isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [messages, showInput, isExpanded]);

  const startChat = () => {
    setIsExpanded(true);
    addMessage('bot', 'Great to meet you! What\'s your full name?');
    setShowInput(true);
    setShowOptions(false);
    setCurrentStep(1);
  };

  const addMessage = (type: 'bot' | 'user', text: string, options?: string[], countries?: string[]) => {
    const newMessageId = Date.now() + Math.random(); // Ensure unique IDs
    
    // Add message to chat
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
    
    // Ensure loading indicator is removed after message is added
    // Using a longer delay to ensure animation completes
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't process empty input
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
          // Loading state is handled by addMessage function
        }, 500);
      }
      setUserInput('');
      return;
    }
    
    // Handle regular user input based on current step
    processUserInput(userInput);
    setUserInput('');
  };

  const processUserInput = (input: string) => {
    // Add user's message to chat
    addMessage('user', input);
    
    // Show loading indicator
    setLoading(true);
    
    // Process based on current step
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
          
        case 3: // Study level (Other option)
          setFormData(prev => ({ ...prev, studyLevel: input }));
          addMessage('bot', 'Got it. Do you already have a destination country in mind?', ['Yes', 'No']);
          setShowOptions(true);
          setShowInput(false);
          setCurrentStep(4);
          break;
          
        case 4: // Destination country (Other option)
          setFormData(prev => ({ ...prev, destinationCountry: input }));
          addMessage('bot', 'What subject or field are you interested in?');
          setShowCountries(false);
          setShowInput(true);
          setCurrentStep(5);
          break;
          
        case 5: // Subject collection
          setFormData(prev => ({ ...prev, subject: input }));
          addMessage('bot', 'Do you already have your IELTS/TOEFL score or plan to take it?', languageScoreOptions);
          setShowOptions(true);
          setShowInput(false);
          setCurrentStep(6);
          break;
          
        default:
          addMessage('bot', 'I didn\'t understand that. Please follow the prompts.');
          break;
      }
      // Loading state is handled by addMessage function
    }, 1000);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    
    // If user selects "Other", show input field for custom entry
    if (option === 'Other') {
      setShowInput(true);
      setShowOptions(false);
      return;
    }
    
    // Otherwise, process the selected option
    processOption(option);
  };

  const processOption = (option: string) => {
    addMessage('user', option);
    
    setLoading(true);
    setTimeout(() => {
      switch (currentStep) {
        case 3: // Study level
          setFormData(prev => ({ ...prev, studyLevel: option }));
          addMessage('bot', 'Got it. Do you already have a destination country in mind?', ['Yes', 'No']);
          setShowOptions(true);
          setShowInput(false);
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
          
          // Final CTA
          setTimeout(() => {
            addMessage('bot', 'Would you like to book a free consultation with our expert?', ['Yes, Book Now', 'No, thanks']);
            setCurrentStep(8);
          }, 1000);
          break;
          
        case 8: // Final CTA response
          if (option === 'Yes, Book Now') {
            addMessage('bot', 'Great! Please visit our contact page to schedule your free consultation. Our experts will help you plan your study abroad journey.');
            addMessage('bot', 'You can also reach us directly:');
            setShowInput(false);
            setShowOptions(false);
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
      // Loading state is handled by the addMessage function
    }, 500);
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
      // Loading state is handled by the addMessage function
    }, 500);
  };

  const handleInitialHi = () => {
    // Manually add the user's "hi" message
    addMessage('user', 'Hi');
    
    // Show loading animation
    setLoading(true);
    
    // Animation delay before showing bot response
    setTimeout(() => {
      setIsExpanded(true);
      addMessage('bot', 'Great to meet you! What\'s your full name?');
      setShowInput(true);
      setShowOptions(false);
      setCurrentStep(1);
      // Loading state is handled by the addMessage function
    }, 1000);
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-700 dark:text-primary-400">
            Start Your Study Abroad Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chat with our education advisor to get personalized guidance for your international education plans.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className={`relative flex flex-col items-center transition-all duration-500 ease-in-out ${isExpanded ? 'min-h-[650px]' : 'min-h-[320px]'}`}>
            {/* Main chat container */}
            <motion.div 
              layout
              initial={{ height: 'auto', width: 'auto' }}
              animate={{ 
                height: isExpanded ? '650px' : 'auto',
                width: '100%'
              }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className={`bg-gray-900 dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col w-full`}
            >
              {/* Chat header */}
              <motion.div 
                layout
                className="p-5 text-white flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center mr-4">
                    <motion.div
                      animate="wave"
                      variants={waveAnimation}
                    >
                      <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                      </svg>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl font-handwriting">StudyGuru Chat</h3>
                    <p className="text-sm text-gray-400">We're here to help!</p>
                  </div>
                </div>
                {isExpanded && (
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-white"
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
                  className="flex-1 p-4 overflow-y-auto"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <div className="messages-container">
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
                          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center mr-3 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                          </div>
                        )}
                        
                        <div>
                          <div className={`rounded-2xl py-3 px-5 max-w-xs md:max-w-md inline-block ${
                            message.type === 'user' 
                              ? 'bg-amber-500 text-white ml-2' 
                              : 'bg-slate-700 text-white'
                          }`}>
                            <p>{message.text}</p>
                          </div>
                          
                          {/* Options buttons if any */}
                          {message.options && showOptions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.options.map((option, idx) => (
                                <button
                                  key={idx}
                                  className="py-2 px-4 bg-slate-600 hover:bg-slate-500 text-white rounded-full text-sm transition-colors duration-200 border border-slate-500"
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
                                  className="py-2 px-4 bg-slate-600 hover:bg-slate-500 text-white rounded-full text-sm transition-colors duration-200 border border-slate-500"
                                  onClick={() => handleCountrySelect(country)}
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
                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        key="typing-indicator"
                        variants={typingIndicatorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex justify-start mb-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                        <div className="rounded-2xl py-3 px-5 bg-slate-700 text-white">
                          <div className="flex items-center space-x-2">
                            <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                    
                  {/* Final contact section */}
                  {currentStep === 9 && (
                    <motion.div
                      key="contact-section"
                      variants={bubbleVariants}
                      initial="hidden"
                      animate="visible"
                      className="mt-8 bg-slate-100 dark:bg-slate-700 rounded-xl p-4 shadow-md"
                    >
                        <h3 className="font-bold text-lg mb-2">Contact Us</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>support@studyguruindia.com</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>+91 99999-99999</span>
                          </div>
                          <div className="flex mt-4 gap-2">
                            <button 
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                              onClick={() => window.open('https://wa.me/919999999999', '_blank')}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" className="mr-2">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                              </svg>
                              WhatsApp
                            </button>
                            <button 
                              className="flex-1 border border-slate-500 hover:bg-slate-700 text-white py-2 px-4 rounded-lg"
                              onClick={() => window.location.href = '/contact'}
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
                  className="p-4 border-t border-slate-700"
                >
                  {showInput && (
                    <form onSubmit={handleUserInput} className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-1 py-3 px-4 rounded-full bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        autoFocus
                      />
                      <button 
                        type="submit" 
                        className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center transition-colors"
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
                  className="p-8 flex flex-col items-center"
                >
                  <button 
                    onClick={handleInitialHi}
                    className="bg-transparent border border-amber-400 hover:bg-slate-800 text-white text-lg font-medium rounded-full px-10 py-4 transition-all duration-300 hover:scale-105 w-full flex items-center justify-center gap-3 relative overflow-hidden"
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
                  <p className="text-sm text-center mt-4 text-gray-400">
                    Chat with our education consultant
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeChatBot;