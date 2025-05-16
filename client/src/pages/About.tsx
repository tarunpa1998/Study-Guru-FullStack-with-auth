import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  GraduationCap, 
  Globe, 
  BookOpen, 
  Target, 
  Award, 
  Users, 
  CheckCircle, 
  BarChart, 
  School,
  MapPin,
  Compass,
  Heart
} from 'lucide-react';

import ChatBot from '../components/ChatBot';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 10
    } 
  }
};

const iconVariant = {
  hidden: { scale: 0 },
  visible: { 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 10,
      duration: 0.5
    } 
  }
};

const pulseVariant = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const drawLine = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 }
    } 
  }
};

// Component to animate sections when they come into view
const AnimatedSection = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.div
      ref={ref}
      variants={fadeIn}
      initial="hidden"
      animate={controls}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-600 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 dark:from-primary-800 dark:via-primary-700 dark:to-primary-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 filter blur-3xl"></div>
          
          {/* Animated floating elements */}
          <motion.div 
            className="absolute top-20 right-[20%] w-16 h-16 bg-white rounded-full opacity-30"
            animate={{ 
              y: [0, -30, 0], 
              opacity: [0.3, 0.4, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-40 left-[15%] w-24 h-24 bg-white rounded-full opacity-30"
            animate={{ 
              y: [0, 40, 0], 
              opacity: [0.3, 0.4, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10 mb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              About Study Guru <span className="text-yellow-300">India</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your Trusted Partner in Global Education Journey
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <a 
                href="#mission" 
                className="inline-flex items-center bg-black text-white hover:bg-black font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-lg"
              >
                Discover Our Story
                <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 14.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Our Story
              </h2>
              <div className="prose prose-lg max-w-4xl mx-auto text-foreground">
                <p>
                  Study Guru India is a global education platform dedicated to helping students across the world make informed and confident decisions about their academic journeys. Whether you're aiming for higher education in India or exploring opportunities abroad, we provide everything you need to unlock your potential and achieve your goals.
                </p>
                
                <p>
                  Founded with a vision to democratize education, Study Guru India is your comprehensive, one-stop resource for discovering courses, universities, career paths, scholarships, entrance exams, and the latest education trends. Our platform serves as a bridge to your dream career, connecting you with opportunities and guidance that can shape your future.
                </p>
                
                <p>
                  We understand that every student is unique, and that's why we offer personalized insights, up-to-date information, and expert counseling to help you navigate the complexities of higher education—whether you're looking to study in India, abroad, or enhance your skills through various learning programs.
                </p>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Values Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          >
            <motion.div variants={cardVariant} className="bg-card p-8 rounded-xl shadow-lg text-center">
              <motion.div variants={iconVariant} className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-primary">Passion</h3>
              <p className="text-muted-foreground">
                We're passionate about connecting students with life-changing educational opportunities around the world.
              </p>
            </motion.div>
            
            <motion.div variants={cardVariant} className="bg-card p-8 rounded-xl shadow-lg text-center">
              <motion.div variants={iconVariant} className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-primary">Integrity</h3>
              <p className="text-muted-foreground">
                We provide honest, transparent, and reliable information to help students make the best decisions.
              </p>
            </motion.div>
            
            <motion.div variants={cardVariant} className="bg-card p-8 rounded-xl shadow-lg text-center">
              <motion.div variants={iconVariant} className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-primary">Guidance</h3>
              <p className="text-muted-foreground">
                We believe in providing personalized guidance to navigate the complex world of global education.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Mission Section with SVG Animation */}
      <section id="mission" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Our Mission
              </h2>
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="text-lg font-medium mb-6">
                  At Study Guru India, our mission is clear:
                  To empower students worldwide with the information, tools, and support they need to make the right educational choices and set themselves up for a successful career.
                </p>
                
                <h3 className="text-xl font-semibold mb-4">We aim to provide:</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 flex-shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span>Comprehensive and accurate information about universities, courses, admission processes, and exams.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 flex-shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span>Expert guidance and personalized counseling to help students choose the right path.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 flex-shrink-0">
                      <CheckCircle className="h-5 w-5" />
                    </span>
                    <span>Up-to-date education news and resources to keep students informed about the latest trends, deadlines, and opportunities.</span>
                  </li>
                </ul>
                
                <p className="mt-6">
                  We believe that knowledge is power, and our platform is designed to equip students with everything they need to excel in their academic journey and beyond.
                </p>
              </div>
            </AnimatedSection>
            
            <div className="relative">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={pulseVariant}
                animate="pulse"
                className="bg-card p-6 rounded-2xl shadow-xl relative z-10"
              >
                <svg className="w-full h-auto" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background elements */}
                  <motion.circle cx="250" cy="200" r="120" fill="#f0f9ff" className="dark:opacity-10" />
                  
                  {/* Orbiting path */}
                  <motion.ellipse 
                    cx="250" 
                    cy="200" 
                    rx="180" 
                    ry="150" 
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                    strokeDasharray="12 8" 
                    fill="none"
                    variants={drawLine}
                    className="dark:opacity-30"
                  />
                  
                  {/* Central element */}
                  <motion.circle 
                    cx="250" 
                    cy="200" 
                    r="50" 
                    fill="#3b82f6" 
                    variants={pulseVariant}
                    animate={{
                      scale: [1, 1.05, 1],
                      transition: { duration: 3, repeat: Infinity }
                    }}
                    className="dark:opacity-80"
                  />
                  <motion.text 
                    x="250" 
                    y="204" 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="14"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    STUDENTS
                  </motion.text>
                  
                  {/* Orbiting elements with animations */}
                  {[
                    { icon: "🎓", label: "University", angle: 0, distance: 0.9 },
                    { icon: "🌍", label: "Global", angle: 60, distance: 1 },
                    { icon: "💼", label: "Career", angle: 120, distance: 0.95 },
                    { icon: "🔍", label: "Research", angle: 180, distance: 1 },
                    { icon: "📚", label: "Courses", angle: 240, distance: 0.9 },
                    { icon: "🏆", label: "Scholarship", angle: 300, distance: 1 }
                  ].map((item, index) => {
                    const angle = item.angle * (Math.PI / 180);
                    const x = 250 + Math.cos(angle) * 180 * item.distance;
                    const y = 200 + Math.sin(angle) * 150 * item.distance;
                    
                    return (
                      <motion.g 
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1
                        }}
                        transition={{ 
                          opacity: { delay: 0.5 + index * 0.2, duration: 0.5 },
                          scale: { delay: 0.5 + index * 0.2, duration: 0.5 }
                        }}
                        // Remove the x/y animations from here
                      >
                        {/* Use a motion.circle for the floating animation instead */}
                        <motion.circle 
                          cx={x} 
                          cy={y} 
                          r="25" 
                          fill="#f0f9ff" 
                          stroke="#3b82f6" 
                          strokeWidth="2" 
                          className="dark:opacity-80"
                          animate={{
                            cx: [x, x + (Math.random() * 10 - 5), x],
                            cy: [y, y + (Math.random() * 10 - 5), y]
                          }}
                          transition={{
                            cx: { repeat: Infinity, duration: 3 + index, repeatType: "reverse" },
                            cy: { repeat: Infinity, duration: 4 + index, repeatType: "reverse" }
                          }}
                        />
                        <text x={x} y={y-5} textAnchor="middle" fontSize="18">{item.icon}</text>
                        <text x={x} y={y+15} textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold" className="dark:fill-white dark:opacity-80">{item.label}</text>
                        
                        {/* Connector line */}
                        <motion.line 
                          x1="250" 
                          y1="200" 
                          x2={x} 
                          y2={y} 
                          stroke="#94a3b8" 
                          strokeWidth="1.5" 
                          strokeDasharray="3 3"
                          variants={drawLine}
                          className="dark:opacity-50"
                        />
                      </motion.g>
                    );
                  })}
                </svg>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Who We Serve Section */}
      <section className="py-16 md:py-24 bg-background border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Who We Serve
            </h2>
            <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
              Our platform is student-centric and global in reach. Whether you are a student in India, Asia, Africa, Europe, North America, South America, or Australia, Study Guru India is here to guide you.
            </p>
          </AnimatedSection>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
          >
            {[
              {
                icon: <GraduationCap className="h-8 w-8 text-primary" />,
                title: "Undergraduate Students",
                description: "Starting your higher education journey and exploring the right courses and universities."
              },
              {
                icon: <BookOpen className="h-8 w-8 text-primary" />,
                title: "Postgraduate Students",
                description: "Advancing your education with specialized courses and research opportunities."
              },
              {
                icon: <Globe className="h-8 w-8 text-primary" />,
                title: "International Students",
                description: "Seeking guidance for studying in India or Indian students looking to study abroad."
              },
              {
                icon: <BarChart className="h-8 w-8 text-primary" />,
                title: "Working Professionals",
                description: "Looking to upgrade skills or transition to a new career path through education."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="relative overflow-hidden"
              >
                <div className="bg-card p-8 rounded-xl shadow border border-border flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* What We Offer Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of services is designed to support every aspect of your educational journey.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <AnimatedSection className="order-2 md:order-1">
              {/* Animated feature list */}
              <div className="space-y-8">
                {[
                  {
                    title: "Comprehensive Course & University Search",
                    description: "Discover top-ranked colleges and universities worldwide, with detailed information on courses, fees, eligibility, and placement opportunities.",
                    icon: <School className="h-6 w-6" />
                  },
                  {
                    title: "Study Abroad Support",
                    description: "Explore study destinations like the UK, USA, Canada, Australia, Germany, and more with step-by-step guidance on admissions, visas, and scholarships.",
                    icon: <Globe className="h-6 w-6" />
                  },
                  {
                    title: "Career Guidance & Exam Preparation",
                    description: "Get valuable tips on career development, job prospects, and resources to prepare for entrance exams, including IELTS, GRE, GMAT, and more.",
                    icon: <Target className="h-6 w-6" />
                  },
                  {
                    title: "Verified Information & Honest Reviews",
                    description: "Read genuine student reviews and get insights into college life, campus facilities, and placement records.",
                    icon: <CheckCircle className="h-6 w-6" />
                  },
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
            
            <div className="order-1 md:order-2 relative">
              <AnimatedSection delay={0.2}>
                <div className="relative">
                  {/* Main image */}
                  <div className="bg-white dark:bg-slate-700 p-3 rounded-xl shadow-xl z-10 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                      alt="Students discussing education opportunities"
                      className="rounded-lg w-full h-auto object-cover aspect-[4/3]"
                    />
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    className="absolute top-6 -right-6 bg-white dark:bg-slate-700 shadow-lg p-4 rounded-lg w-36 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    animate={{
                      y: [0, -10, 0],
                      transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-semibold">Top Universities</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-8 -left-6 bg-white dark:bg-slate-700 shadow-lg p-4 rounded-lg w-44 z-20"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    animate={{
                      y: [0, 10, 0],
                      transition: { duration: 4, repeat: Infinity, repeatType: "reverse" }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <span className="text-sm font-semibold">Global Destinations</span>
                    </div>
                  </motion.div>
                </div>
              </AnimatedSection>
              
              {/* Background decorative elements */}
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-primary-200 dark:bg-primary-900/30 rounded-full z-0 opacity-70 blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-200 dark:bg-primary-900/30 rounded-full z-0 opacity-70 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision & Call To Action */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="bg-primary text-white p-10 md:p-16 rounded-3xl shadow-xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden z-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Vision</h2>
              <p className="text-xl mb-8 text-white">
                At Study Guru India, our vision is simple: To be the most trusted education platform where students from around the world find guidance, direction, and inspiration for their academic journeys and future careers.
              </p>
              <p className="text-lg mb-10 text-white">
                We are here to ensure that every student has the opportunity to succeed in the global education landscape.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="/contact" 
                  className="inline-flex items-center bg-black dark:bg-white text-primary-700 dark:text-black hover:bg-primary-500 dark:hover:bg-slate-700 font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-lg"
                >
                  Get Started Today
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Contact & Support Section - Completely separate section */}
      <section className="py-16 md:py-24 bg-muted border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatedSection className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
              Get in Touch with Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Have questions or need personalized guidance? We are always ready to assist you!
            </p>
            
            {/* ChatBot */}
            <ChatBot 
              title="StudyGuru Advisor"
              subtitle="Ask us anything about studying abroad!"
              initialMessage="Great to meet you! What's your full name?"
              showContactInfo={false}
              className="mb-16"
              useStudyAbroadFlow={true}
              contactEmail="support@studyguruindia.com"
              contactPhone="+91 99999-99999"
              whatsappNumber="919999999999"
              contactPageUrl="/contact"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div 
                className="p-6 bg-card rounded-xl shadow-md"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">WhatsApp</h3>
                <p className="text-muted-foreground mb-4">Chat with us directly for quick responses.</p>
                <a 
                  href="https://wa.me/919999999999" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center font-medium text-primary hover:text-primary/90"
                >
                  +91 99999-99999
                </a>
              </motion.div>
              
              <motion.div 
                className="p-6 bg-card rounded-xl shadow-md"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">Email</h3>
                <p className="text-muted-foreground mb-4">Send us your queries anytime.</p>
                <a 
                  href="mailto:support@studyguruindia.com" 
                  className="inline-flex items-center font-medium text-primary hover:text-primary/90"
                >
                  support@studyguruindia.com
                </a>
              </motion.div>
              
              <motion.div 
                className="p-6 bg-card rounded-xl shadow-md"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">Contact Form</h3>
                <p className="text-muted-foreground mb-4">Fill out our contact form for detailed inquiries.</p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center font-medium text-primary hover:text-primary/90"
                >
                  Visit Contact Page
                </a>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;



























