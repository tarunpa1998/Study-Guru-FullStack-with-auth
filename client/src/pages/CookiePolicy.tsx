import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Study Guru</title>
        <meta name="description" content="Study Guru's Cookie Policy - Learn how we use cookies and similar technologies on our website." />
      </Helmet>

      <div className="bg-background min-h-screen">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Cookie Policy</h1>
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  
                  <h2>1. What Are Cookies</h2>
                  <p>
                    Cookies are small text files that are placed on your computer or mobile device when you 
                    visit a website. They are widely used to make websites work more efficiently and provide 
                    information to the website owners.
                  </p>
                  
                  <h2>2. How We Use Cookies</h2>
                  <p>We use cookies for several purposes, including:</p>
                  <ul>
                    <li>Essential cookies: Required for the website to function properly</li>
                    <li>Functional cookies: Remember your preferences and settings</li>
                    <li>Analytical cookies: Help us understand how visitors interact with our website</li>
                    <li>Marketing cookies: Track your browsing habits to deliver targeted advertising</li>
                  </ul>
                  
                  <h2>3. Types of Cookies We Use</h2>
                  <h3>Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable basic 
                    functions like page navigation and access to secure areas of the website. The website 
                    cannot function properly without these cookies.
                  </p>
                  
                  <h3>Preference Cookies</h3>
                  <p>
                    These cookies allow the website to remember choices you make (such as your preferred 
                    language or the region you are in) and provide enhanced, more personal features.
                  </p>
                  
                  <h3>Analytics Cookies</h3>
                  <p>
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously. They help us improve the way our website works.
                  </p>
                  
                  <h3>Marketing Cookies</h3>
                  <p>
                    These cookies are used to track visitors across websites. The intention is to display 
                    ads that are relevant and engaging for the individual user.
                  </p>
                  
                  <h2>4. Managing Cookies</h2>
                  <p>
                    Most web browsers allow you to control cookies through their settings. You can usually 
                    find these settings in the "Options" or "Preferences" menu of your browser. You can also 
                    use the "Help" option in your browser for more details.
                  </p>
                  
                  <h2>5. Third-Party Cookies</h2>
                  <p>
                    We may also use third-party cookies, such as Google Analytics, to help analyze how users 
                    use our site and to improve our services. These third parties may use cookies, web beacons, 
                    and other storage technologies to collect or receive information from our website.
                  </p>
                  
                  <h2>6. Changes to This Cookie Policy</h2>
                  <p>
                    We may update our Cookie Policy from time to time. We will notify you of any changes by 
                    posting the new Cookie Policy on this page and updating the "Last Updated" date.
                  </p>
                  
                  <h2>7. Contact Us</h2>
                  <p>
                    If you have any questions about our Cookie Policy, please contact us at:
                    <br />
                    <a href="mailto:Help@studyguruindia.com" className="text-primary hover:underline">
                      Help@studyguruindia.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;