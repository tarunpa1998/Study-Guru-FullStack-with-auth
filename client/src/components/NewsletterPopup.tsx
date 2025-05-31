import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already subscribed
    const checkSubscriptionStatus = async () => {
      const userEmail = localStorage.getItem('user_email');
      
      // If we have a stored email, check subscription status
      if (userEmail) {
        try {
          const response = await fetch('/api/newsletter/check-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.isSubscribed) {
              localStorage.setItem('newsletter_subscribed', 'true');
              return true;
            }
          }
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      }
      
      return localStorage.getItem('newsletter_subscribed') === 'true';
    };
    
    const setupPopup = async () => {
      const hasSubscribed = await checkSubscriptionStatus();
      
      // If already subscribed, don't show popup
      if (hasSubscribed) return;
      
      // Check when the popup was last shown
      const lastShownDate = localStorage.getItem('newsletter_popup_last_shown');
      const hasSeenPopup = localStorage.getItem('newsletter_popup_seen') === 'true';
      
      // Current date for comparison
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Determine if we should show the popup
      let shouldShowPopup = false;
      
      if (!hasSeenPopup) {
        // First-time visitor - show popup after delay
        shouldShowPopup = true;
      } else if (lastShownDate && lastShownDate !== currentDate) {
        // Returning visitor on a different day - show popup again
        // But only if they haven't subscribed yet
        shouldShowPopup = true;
      }
      
      if (shouldShowPopup) {
        // Show popup after 8 seconds
        const timer = setTimeout(() => {
          setIsOpen(true);
          // Update the last shown date
          localStorage.setItem('newsletter_popup_last_shown', currentDate);
        }, 8000);
        
        return () => clearTimeout(timer);
      }
    };
    
    setupPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user has seen the popup
    localStorage.setItem('newsletter_popup_seen', 'true');
  };

  const checkExistingSubscription = async (email: string) => {
    try {
      const response = await fetch('/api/newsletter/check-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.isSubscribed;
      }
      return false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First check if the email is already subscribed
      const isAlreadySubscribed = await checkExistingSubscription(email);
      
      if (isAlreadySubscribed) {
        // If already subscribed, show success message without making another API call
        setSuccessMessage("You're already subscribed to our newsletter!");
        setIsSuccess(true);
        
        // Store the email for future reference
        localStorage.setItem('user_email', email);
        localStorage.setItem('newsletter_subscribed', 'true');
        
        toast({
          title: "Already Subscribed",
          description: "You're already subscribed to our newsletter!",
          variant: "default",
        });
        
        // Close popup after showing success message (longer time - 5 seconds)
        setTimeout(() => {
          handleClose();
        }, 5000);
        
        return;
      }
      
      // If not already subscribed, make API call to subscribe
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to subscribe');
      }
      
      // Store the email for future reference
      localStorage.setItem('user_email', email);
      localStorage.setItem('newsletter_subscribed', 'true');
      
      setSuccessMessage("Thanks for subscribing! 🎉");
      setIsSuccess(true);
      
      // Close popup after showing success message (longer time - 5 seconds)
      setTimeout(() => {
        handleClose();
      }, 5000);
      
      toast({
        title: "Subscription Successful",
        description: "You've been added to our newsletter!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card max-w-md w-full rounded-xl shadow-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="p-6 pt-10 pb-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Stay Updated!</h3>
                  <p className="text-muted-foreground">
                    Subscribe to our newsletter for the latest scholarships, educational resources, and expert tips.
                  </p>
                </div>
                
                {!isSuccess ? (
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Checking...' : 'Subscribe Now'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      {successMessage}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <button
                    onClick={handleClose}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    No thanks, maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;



