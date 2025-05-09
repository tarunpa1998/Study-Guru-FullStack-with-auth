import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  options?: string[];
  countries?: string[];
}

const HomeChatBot = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Hi there! 👋 Say hi for more information' 
    }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startChat = () => {
    setIsExpanded(true);
    addMessage('bot', 'Great to meet you! What\'s your full name?');
    setShowInput(true);
    setShowOptions(false);
    setCurrentStep(1);
  };

  const addMessage = (type: 'bot' | 'user', text: string, options?: string[]) => {
    setLoading(false);
    setMessages(prev => [
      ...prev, 
      { 
        id: Date.now(), 
        type, 
        text,
        options
      }
    ]);
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
          setLoading(false);
        }, 500);
      }
      setUserInput('');
      return;
    }
    
    // Add user's message to chat
    addMessage('user', userInput);
    
    // Show note about demo functionality
    setTimeout(() => {
      addMessage('bot', 'This chatbot is a demo and not fully functional. Please use the WhatsApp button or Contact form to get in touch with us directly.');
    }, 1000);
    
    setUserInput('');
  };

  const handleInitialHi = () => {
    setUserInput('hi');
    handleUserInput(new Event('submit') as any);
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
          <div className={`relative flex flex-col items-center transition-all duration-300 ease-in-out ${isExpanded ? 'min-h-[500px]' : 'min-h-[200px]'}`}>
            {/* Main chat container */}
            <motion.div 
              layout
              initial={{ height: 'auto', width: 'auto' }}
              animate={{ 
                height: isExpanded ? '500px' : 'auto',
                width: isExpanded ? '100%' : '100%'
              }}
              transition={{ duration: 0.3 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full border border-slate-200 dark:border-slate-700`}
            >
              {/* Chat header */}
              <motion.div 
                layout
                className="bg-gradient-to-r from-primary-700 to-primary-600 p-4 text-white flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <motion.div
                      animate="wave"
                      variants={waveAnimation}
                    >
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                      </svg>
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold">StudyGuru Chat</h3>
                    <p className="text-xs text-white/80">We're here to help!</p>
                  </div>
                </div>
                {isExpanded && (
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </motion.div>
              
              {/* Chat messages */}
              {isExpanded && (
                <motion.div 
                  layout
                  className="flex-1 p-4 overflow-y-auto"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        layout
                        variants={bubbleVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'bot' && (
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-2 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                          </div>
                        )}
                        
                        <div>
                          <div className={`rounded-2xl py-3 px-4 max-w-xs md:max-w-md inline-block ${
                            message.type === 'user' 
                              ? 'bg-primary-600 text-white ml-2' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                          }`}>
                            <p>{message.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Loading indicator */}
                    {loading && (
                      <motion.div
                        variants={bubbleVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-start mb-4"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                        <div className="rounded-2xl py-2 px-4 bg-slate-100 dark:bg-slate-700">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-2 w-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={chatEndRef} />
                  </AnimatePresence>
                </motion.div>
              )}
              
              {/* Chat input area */}
              {isExpanded ? (
                <motion.div 
                  layout
                  className="p-4 border-t border-slate-200 dark:border-slate-700"
                >
                  {showInput && (
                    <form onSubmit={handleUserInput} className="flex items-center gap-2">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Type your message..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button type="submit" size="icon" className="h-10 w-10 rounded-full bg-primary-600 hover:bg-primary-700">
                        <SendHorizontal className="h-5 w-5" />
                      </Button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6 flex flex-col items-center"
                >
                  <Button 
                    onClick={handleInitialHi}
                    variant="outline"
                    className="bg-transparent border-2 border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold rounded-full px-8 py-6 transition-all hover:scale-105 w-full flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">👋</span> 
                    <span className="text-lg">Say Hi</span>
                  </Button>
                  <p className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">
                    Note: This chatbot is a demo and not fully functional
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