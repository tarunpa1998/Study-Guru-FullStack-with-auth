import { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Country codes for phone number selection
const countryCodes = [
  { code: '+1', name: 'United States/Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+91', name: 'India' },
  { code: '+61', name: 'Australia' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+81', name: 'Japan' },
  { code: '+86', name: 'China' },
  { code: '+65', name: 'Singapore' },
  { code: '+971', name: 'UAE' },
  { code: '+64', name: 'New Zealand' }
];

// Countries of interest for study abroad
const studyDestinations = [
  { value: 'canada', label: 'Canada' },
  { value: 'usa', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'australia', label: 'Australia' },
  { value: 'germany', label: 'Germany' },
  { value: 'france', label: 'France' },
  { value: 'ireland', label: 'Ireland' },
  { value: 'newzealand', label: 'New Zealand' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'japan', label: 'Japan' },
  { value: 'other', label: 'Other' }
];

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    phoneNumber: '',
    message: '',
    studyDestination: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // This would normally be an API call to your backend
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you within 24-48 hours.",
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        countryCode: '+91',
        phoneNumber: '',
        message: '',
        studyDestination: ''
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly via phone or email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-primary-900 to-primary-700 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full opacity-20 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full opacity-10 filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              📞 Contact Us – Start Your Study Abroad Journey Today!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Your trusted guide to studying abroad and exploring global education opportunities.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#contact-form"
                className="inline-flex items-center bg-white text-primary-700 hover:bg-primary-50 font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-lg"
              >
                Get In Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-400">
                How We Can Help
              </h2>
              
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  🎓 Want to study in Canada, UK, USA, Germany, or Australia?
                  We help students like you with course selection, application process, visa guidance, and much more.
                </p>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-primary-500" />
                    Direct Contact Options
                  </h3>
                  
                  <p className="mb-4">
                    📲 For personal guidance, chat with us directly on WhatsApp:
                  </p>
                  
                  <a 
                    href="https://wa.me/919999999999" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
                  >
                    👉 Click Here to Message Us
                  </a>
                  
                  <p>
                    📱 Or WhatsApp us at <strong>+91 99999-99999</strong>
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">💬 Other Reasons to Contact Us</h3>
                <p className="mb-2">You're also welcome to reach out for the following:</p>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-primary-600 dark:text-primary-400 mr-2">✅</span>
                    <span><strong>Website Feedback</strong> - Share your thoughts on our design, usability, or content. Your input helps us create a better platform.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 dark:text-primary-400 mr-2">✅</span>
                    <span><strong>Content Queries</strong> - Need more info on scholarships, universities, or visa processes? We're happy to help!</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 dark:text-primary-400 mr-2">✅</span>
                    <span><strong>Report Errors or Updates</strong> - Found outdated or incorrect info? Let us know so we can fix it promptly.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 dark:text-primary-400 mr-2">✅</span>
                    <span><strong>Suggestions & Improvements</strong> - Have ideas to improve the site's features or layout? We'd love to hear them.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 dark:text-primary-400 mr-2">✅</span>
                    <span><strong>Technical Issues</strong> - Facing bugs or technical problems on the site? Report them, and we'll resolve them quickly.</span>
                  </li>
                </ul>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary-500" />
                    Contact Details
                  </h3>
                  
                  <p className="flex items-center mb-2">
                    <Mail className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                    <span><strong>Email:</strong> studyguru@gmail.com</span>
                  </p>
                  
                  <p className="flex items-center mb-4">
                    <Phone className="h-5 w-5 mr-3 text-gray-600 dark:text-gray-400" />
                    <span><strong>Phone / WhatsApp:</strong> +91 99999-99999</span>
                  </p>
                  
                  <p className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-5 w-5 mr-3" />
                    <span>We aim to reply within 24–48 hours.</span>
                  </p>
                </div>
                
                {/* Social Media Icons */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <motion.a 
                      href="#" 
                      className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">Facebook</span>
                      <Facebook className="h-5 w-5" />
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="bg-sky-500 p-3 rounded-full text-white hover:bg-sky-600 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">Twitter</span>
                      <Twitter className="h-5 w-5" />
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="bg-gradient-to-tr from-purple-600 to-pink-500 p-3 rounded-full text-white hover:from-purple-700 hover:to-pink-600 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">Instagram</span>
                      <Instagram className="h-5 w-5" />
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="bg-blue-700 p-3 rounded-full text-white hover:bg-blue-800 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">LinkedIn</span>
                      <Linkedin className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div id="contact-form" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-400">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Mobile Number</Label>
                    <div className="flex space-x-2">
                      <Select 
                        value={formData.countryCode}
                        onValueChange={(value) => handleSelectChange('countryCode', value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Country Code" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map(country => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code} {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input 
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        type="tel"
                        placeholder="Phone number"
                        className="flex-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="studyDestination">Country of Interest</Label>
                    <Select 
                      value={formData.studyDestination}
                      onValueChange={(value) => handleSelectChange('studyDestination', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {studyDestinations.map(country => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
              
              {/* WhatsApp alternative contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-white rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Prefer WhatsApp?</h3>
                    <p className="text-white/90 mb-3">Get instant responses to your queries</p>
                    <a 
                      href="https://wa.me/919999999999" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center bg-white text-emerald-600 hover:bg-emerald-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Chat Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-400">
              Find Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Visit our office to discuss your study abroad plans in person.
            </p>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.990092382823!2d77.59600857479637!3d12.971598987383897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBrigade%20Road%2C%20Bengaluru%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sin!4v1684488665447!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
            <p className="font-medium">Study Guru Education Consultants</p>
            <p>123 Education Street, Brigade Road, Bangalore 560001, India</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;