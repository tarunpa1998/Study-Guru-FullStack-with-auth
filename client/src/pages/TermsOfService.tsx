import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Study Guru</title>
        <meta name="description" content="Study Guru's Terms of Service - The rules and guidelines for using our platform." />
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
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Terms of Service</h1>
              <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  
                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using Study Guru's website and services, you agree to be bound by these 
                    Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                  
                  <h2>2. Description of Service</h2>
                  <p>
                    Study Guru provides an online platform that connects students with educational opportunities, 
                    including scholarships, universities, and study abroad programs. We provide information and 
                    resources to help students make informed decisions about their education.
                  </p>
                  
                  <h2>3. User Accounts</h2>
                  <p>
                    Some features of our service may require registration. You agree to provide accurate and 
                    complete information when creating an account and to update your information to keep it 
                    accurate and current. You are responsible for maintaining the confidentiality of your 
                    account credentials and for all activities that occur under your account.
                  </p>
                  
                  <h2>4. User Conduct</h2>
                  <p>You agree not to:</p>
                  <ul>
                    <li>Use our service for any illegal purpose</li>
                    <li>Submit false or misleading information</li>
                    <li>Impersonate any person or entity</li>
                    <li>Interfere with the proper functioning of the service</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                  </ul>
                  
                  <h2>5. Intellectual Property</h2>
                  <p>
                    All content on the Study Guru website, including text, graphics, logos, and software, 
                    is the property of Study Guru or its content suppliers and is protected by copyright 
                    and other intellectual property laws.
                  </p>
                  
                  <h2>6. Third-Party Links</h2>
                  <p>
                    Our service may contain links to third-party websites. These links are provided for 
                    your convenience only. We have no control over the content of those sites and assume 
                    no responsibility for them.
                  </p>
                  
                  <h2>7. Disclaimer of Warranties</h2>
                  <p>
                    Our service is provided "as is" without warranties of any kind, either express or implied. 
                    We do not guarantee the accuracy or completeness of any information on our website.
                  </p>
                  
                  <h2>8. Limitation of Liability</h2>
                  <p>
                    Study Guru shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages resulting from your use of or inability to use our service.
                  </p>
                  
                  <h2>9. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms of Service at any time. We will notify users 
                    of any significant changes by posting a notice on our website.
                  </p>
                  
                  <h2>10. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;