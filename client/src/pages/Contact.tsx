import { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FaInstagram, FaFacebook, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import ChatBot from "@/components/ChatBot";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    <div className="min-h-screen bg-background">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24 overflow-hidden border-y border-border">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full opacity-10 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground rounded-full opacity-5 filter blur-3xl"></div>
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
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Your trusted guide to studying abroad and exploring global education opportunities.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#contact-form"
                className="inline-flex items-center bg-background text-primary hover:bg-muted font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-lg"
              >
                Get In Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left Column - How We Can Help + ChatBot */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                How We Can Help You?
              </h2>
              
              <div className="max-w-none">
                <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                  🎓 Want to study in Canada, UK, USA, Germany, or Australia?
                  We help students like you with course selection, application process, visa guidance, and much more.
                </p>
                
                {/* ChatBot Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground text-center">Chat With Us</h3>
                  <ChatBot 
                    title="StudyGuru Advisor"
                    subtitle="Ask us anything about studying abroad!"
                    initialMessage="Great to meet you! What's your full name?"
                    showContactInfo={true}
                    className="mb-8"
                    useStudyAbroadFlow={true}
                    contactEmail="support@studyguruindia.com"
                    contactPhone="+91 99999-99999"
                    whatsappNumber="919999999999"
                    contactPageUrl="/contact"
                  />
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-white rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
              
              {/* Contact Information */}
              <div className="bg-card p-6 rounded-xl shadow-md border border-border mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  Contact Details
                </h3>
                
                <p className="flex items-center mb-2 text-muted-foreground">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span><strong className="text-foreground">Email:</strong> studyguru@gmail.com</span>
                </p>
                
                <p className="flex items-center mb-4 text-muted-foreground">
                  <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span><strong className="text-foreground">Phone / WhatsApp:</strong> +91 99999-99999</span>
                </p>
                
                <p className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>We aim to reply within 24–48 hours.</span>
                </p>
              </div>
              
              {/* WhatsApp alternative contact */}
              
              
              {/* Social Media Icons */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Connect With Us</h3>
                <div className="flex space-x-4">
                  <motion.a 
                    href="https://instagram.com/studyguru" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                  >
                    <div 
                      className="p-2 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(5px)',
                        border: '1.5px solid rgba(255,255,255,0.7)'
                      }}
                    >
                      <FaInstagram className="h-5 w-5 text-[#E1306C] filter drop-shadow(0px 1px 3px rgba(0,0,0,0.2))" />
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">Instagram</span>
                  </motion.a>
                  
                  <motion.a 
                    href="https://facebook.com/studyguru" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                  >
                    <div 
                      className="p-2 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(5px)',
                        border: '1.5px solid rgba(255,255,255,0.7)'
                      }}
                    >
                      <FaFacebook className="h-5 w-5 text-[#1877F2] filter drop-shadow(0px 1px 3px rgba(0,0,0,0.2))" />
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">Facebook</span>
                  </motion.a>
                  
                  <motion.a 
                    href="https://wa.me/1234567890" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                  >
                    <div 
                      className="p-2 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(5px)',
                        border: '1.5px solid rgba(255,255,255,0.7)'
                      }}
                    >
                      <FaWhatsapp className="h-5 w-5 text-[#25D366] filter drop-shadow(0px 1px 3px rgba(0,0,0,0.2))" />
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">WhatsApp</span>
                  </motion.a>
                  
                  <motion.a 
                    href="https://t.me/studyguru" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center"
                  >
                    <div 
                      className="p-2 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(5px)',
                        border: '1.5px solid rgba(255,255,255,0.7)'
                      }}
                    >
                      <FaTelegram className="h-5 w-5 text-[#0088cc] filter drop-shadow(0px 1px 3px rgba(0,0,0,0.2))" />
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">Telegram</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
            
            {/* Right Column - Contact Form + Other Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Contact Form */}
              <div id="contact-form" className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border">
                <h2 className="text-3xl font-bold mb-6 text-foreground">
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
                    className={cn("w-full", isSubmitting && "opacity-70")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
              
              {/* Other Reasons to Contact */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Other Reasons to Contact Us</h3>
                <p className="mb-2 text-muted-foreground">You're also welcome to reach out for the following:</p>
                
                <motion.ul 
                  className="space-y-2 mb-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { title: "Website Feedback", desc: "Share your thoughts on our design, usability, or content. Your input helps us create a better platform." },
                    { title: "Content Queries", desc: "Need more info on scholarships, universities, or countries? We're happy to provide additional details." },
                    { title: "Partnership Opportunities", desc: "Interested in collaborating with StudyGuru? We're open to partnerships with educational institutions." },
                    { title: "Technical Issues", desc: "Facing bugs or technical problems on the site? Report them, and we'll resolve them quickly." }
                  ].map((item, index) => (
                    <motion.li key={index} className="flex items-start" variants={itemVariants}>
                      <span className="text-primary mr-2">✅</span>
                      <span className="text-muted-foreground"><strong className="text-foreground">{item.title}</strong> - {item.desc}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Find Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit our office to discuss your study abroad plans in person.
            </p>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg border border-border">
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
          
          <div className="mt-8 text-center text-muted-foreground">
            <p className="font-medium">Study Guru Education Consultants</p>
            <p>123 Education Street, Brigade Road, Bangalore 560001, India</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;