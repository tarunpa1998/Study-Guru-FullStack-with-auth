import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ProtectedRoute } from "./lib/ProtectedRoute";
import { AdminProtectedRoute } from "./lib/AdminProtectedRoute";
import GTMPageTracker from './components/GTMPageTracker';   
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollProgressCircle from "@/components/ScrollProgressCircle";
import Home from "@/pages/Home";
import ScholarshipsList from "@/pages/ScholarshipsList";
import ScholarshipDetail from "@/pages/ScholarshipDetail";
import ArticlesList from "@/pages/ArticlesList";
import ArticleDetail from "@/pages/ArticleDetail";
import CountriesList from "@/pages/CountriesList";
import CountryDetail from "@/pages/CountryDetail";
import UniversitiesList from "@/pages/UniversitiesList";
import UniversityDetail from "@/pages/UniversityDetail";
import NewsList from "@/pages/NewsList";
import NewsDetail from "@/pages/NewsDetail";
import SearchResults from "@/pages/SearchResults";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

// Import the new pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Unsubscribe from './pages/Unsubscribe';

import { useEffect } from "react";
import NewsletterPopup from './components/NewsletterPopup';

// Add type declaration for window.__ow
declare global {
  interface Window {
    __ow: any;
  }
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');
  
  // Add this effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      
      <Route path="/scholarships" component={ScholarshipsList} />
      <Route path="/scholarships/:slug" component={ScholarshipDetail} />
      
      <Route path="/articles" component={ArticlesList} />
      <Route path="/articles/:slug" component={ArticleDetail} />
      
      <Route path="/countries" component={CountriesList} />
      <Route path="/countries/:slug" component={CountryDetail} />
      
      <Route path="/universities" component={UniversitiesList} />
      <Route path="/universities/:slug" component={UniversityDetail} />
      
      <Route path="/news" component={NewsList} />
      <Route path="/news/:slug" component={NewsDetail} />
      
      <Route path="/search" component={SearchResults} />
      
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <ProtectedRoute path="/profile" component={Profile} />
      
      {/* Admin routes - completely separate from the regular auth system */}
      <Route path="/admin/login" component={AdminLogin} />
      {/* Simple root admin route handler */}
      <Route path="/admin">
        {() => {
          // This root admin route will just redirect to dashboard
          const [, navigate] = useLocation();
          const token = localStorage.getItem('adminToken');
          
          // Use effect to handle navigation
          useEffect(() => {
            if (!token) {
              navigate('/admin/login');
            } else {
              navigate('/admin/dashboard');
            }
          }, [navigate, token]);
          
          // Return loading spinner while redirecting
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          );
        }}
      </Route>
      <AdminProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/articles" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/news" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/scholarships" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/countries" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/universities" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/drafts" component={AdminDashboard} />
      
      {/* Legal pages */}
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/unsubscribe" component={Unsubscribe} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  useEffect(() => {
    if (!isAdminRoute) {
      // ChatBot script
      window.__ow = window.__ow || {};
      window.__ow.organizationId = "a0017c0b-41d8-4a26-9506-2ae4aed745ca";
      window.__ow.template_id = "ddbba88c-50ab-4536-91af-97eedae520f9";
      window.__ow.integration_name = "manual_settings";
      window.__ow.product_name = "chatbot";
      
      const script = document.createElement('script');
      script.src = "https://cdn.openwidget.com/openwidget.js";
      script.async = true;
      document.head.appendChild(script);
      
      return () => {
        // Cleanup on unmount
        document.head.removeChild(script);
      };
    }
  }, [isAdminRoute]);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <GTMPageTracker />
              <div className="flex flex-col min-h-screen bg-background text-foreground">
                {!isAdminRoute && <Navbar />}
                <div className="flex-grow">
                  <Router />
                </div>
                {!isAdminRoute && <Footer />}
                {!isAdminRoute && <FloatingWhatsApp />}
                {!isAdminRoute && <ScrollProgressCircle />}
                {!isAdminRoute && <NewsletterPopup />}
                
                {/* Start of ChatBot (www.chatbot.com) code */}
                {!isAdminRoute && (
                  <>
                    <script dangerouslySetInnerHTML={{
                      __html: `
                        window.__ow = window.__ow || {};
                        window.__ow.organizationId = "a0017c0b-41d8-4a26-9506-2ae4aed745ca";
                        window.__ow.template_id = "ddbba88c-50ab-4536-91af-97eedae520f9";
                        window.__ow.integration_name = "manual_settings";
                        window.__ow.product_name = "chatbot";   
                        ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[OpenWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.openwidget.com/openwidget.js",t.head.appendChild(n)}};!n.__ow.asyncInit&&e.init(),n.OpenWidget=n.OpenWidget||e}(window,document,[].slice))
                      `
                    }} />
                  </>
                )}
                {/* End of ChatBot code */}
              </div>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
