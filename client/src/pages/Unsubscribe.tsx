import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Unsubscribe = () => {
  const [location] = useLocation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Get email from URL parameters
    const url = new URL(window.location.href);
    const emailParam = url.searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleUnsubscribe = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe');
      }

      setIsUnsubscribed(true);
      
      // If user was logged in with this email, update localStorage
      const userEmail = localStorage.getItem('user_email');
      if (userEmail === email) {
        localStorage.removeItem('newsletter_subscribed');
      }
      
      toast({
        title: 'Unsubscribed Successfully',
        description: 'You have been unsubscribed from our newsletter.',
        variant: 'default',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Unsubscribe Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="bg-card rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isUnsubscribed ? 'Unsubscribed Successfully' : 'Unsubscribe from Newsletter'}
        </h1>
        
        {isUnsubscribed ? (
          <div className="text-center">
            <p className="mb-4">
              You have been successfully unsubscribed from our newsletter.
            </p>
            <p className="text-muted-foreground">
              We're sorry to see you go. If you change your mind, you can always subscribe again.
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-center">
              Are you sure you want to unsubscribe from our newsletter? You'll no longer receive updates on scholarships, educational resources, and expert tips.
            </p>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            
            <div className="flex justify-center">
              <Button
                onClick={handleUnsubscribe}
                disabled={isLoading}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                {isLoading ? 'Processing...' : 'Unsubscribe'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
