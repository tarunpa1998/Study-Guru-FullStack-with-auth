import nodemailer from 'nodemailer';
import { log } from '../vite';
import Article from '../models/Article';
import News from '../models/News';
import Newsletter from '../models/Newsletter';


// Debug environment variables
log(`Email config - HOST: ${process.env.EMAIL_HOST}`, 'email');
log(`Email config - PORT: ${process.env.EMAIL_PORT}`, 'email');
log(`Email config - SECURE: ${process.env.EMAIL_SECURE}`, 'email');
log(`Email config - USER: ${process.env.EMAIL_USER}`, 'email');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Add connection timeout options
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,   // 30 seconds
});

// Define types for article and news items
interface ArticleItem {
  title: string;
  slug: string;
}

interface NewsItem {
  title: string;
  slug: string;
}

// Get latest articles and news
const getLatestContent = async (): Promise<{ articles: ArticleItem[], news: NewsItem[] }> => {
  try {
    // Get 3 latest articles
    const articlesData = await Article.find()
      .sort({ publishDate: -1 })
      .limit(3)
      .select('title slug')
      .lean();
    
    // Get 2 featured news items
    const newsData = await News.find({ isFeatured: true })
      .sort({ publishDate: -1 })
      .limit(2)
      .select('title slug')
      .lean();
    
    // Convert MongoDB documents to our expected types
    const articles: ArticleItem[] = articlesData.map(doc => ({
      title: doc.title,
      slug: doc.slug
    }));
    
    const news: NewsItem[] = newsData.map(doc => ({
      title: doc.title,
      slug: doc.slug
    }));
    
    return { articles, news };
  } catch (error) {
    log(`Error fetching latest content: ${error}`, 'email');
    // Return fallback content if database query fails
    return {
      articles: [
        { title: '10 Tips to Ace Your Student Visa Interview', slug: 'visa-tips' },
        { title: 'Effective Language Learning Strategies for International Students', slug: 'language-learning-strategies' },
        { title: 'How to Write a Winning Scholarship Application', slug: 'scholarship-application' }
      ],
      news: [
        { title: 'Major Funding Initiative Announced for International STEM Students', slug: 'major-funding-initiative' },
        { title: 'Latest Global University Rankings Released', slug: 'global-rankings' }
      ]
    };
  }
};

// Email templates
const templates = {
  newsletterSubscription: async (email: string) => {
    // Get latest content for the email
    const { articles, news } = await getLatestContent();
    
    // Logo will be attached with CID
    const logoImageCid = 'studyguru-logo';
    
    return {
      subject: 'Welcome to StudyGuru Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:${logoImageCid}" alt="StudyGuru Logo" style="max-width: 180px; height: auto;" />
          </div>
          
          <h2 style="color: #e85d04; text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome to StudyGuru Newsletter!</h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Dear Subscriber,</p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Thank you for subscribing to our newsletter! We're excited to have you join our community of students, educators, and scholarship seekers.</p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Here's what you can expect from us:</p>
          
          <ul style="color: #333; font-size: 16px; line-height: 1.5; padding-left: 20px;">
            <li>Latest scholarship opportunities from around the world</li>
            <li>Educational resources and study guides</li>
            <li>Expert tips for academic success</li>
            <li>Updates on university admissions and requirements</li>
            <li>Exclusive content only available to our subscribers</li>
          </ul>
          
          <h3 style="color: #e85d04; margin-top: 25px; font-size: 18px;">Our Services</h3>
          <ul style="color: #333; font-size: 16px; line-height: 1.5; padding-left: 20px;">
            <li>Admission Process Assistance</li>
            <li>Visa Application Support</li>
            <li>University Selection Guidance</li>
            <li>Scholarship Application Help</li>
            <li>Document Preparation</li>
          </ul>
          
          <h3 style="color: #e85d04; margin-top: 25px; font-size: 18px;">Latest Articles</h3>
          <ul style="color: #333; font-size: 16px; line-height: 1.5; padding-left: 20px;">
            ${articles.map((article: ArticleItem) => `
              <li><a href="https://studyguruindia.com/articles/${article.slug}" style="color: #e85d04; text-decoration: none; font-weight: 500; border-bottom: 1px solid #f8c8a9;">${article.title}</a></li>
            `).join('')}
          </ul>
          
          <h3 style="color: #e85d04; margin-top: 25px; font-size: 18px;">Featured News</h3>
          <ul style="color: #333; font-size: 16px; line-height: 1.5; padding-left: 20px;">
            ${news.map((item: NewsItem) => `
              <li><a href="https://studyguruindia.com/news/${item.slug}" style="color: #e85d04; text-decoration: none; font-weight: 500; border-bottom: 1px solid #f8c8a9;">${item.title}</a></li>
            `).join('')}
          </ul>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">We'll send you updates every week, and we promise not to spam your inbox.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-style: italic; color: #4b5563; font-size: 16px; line-height: 1.5;">
              "Education is the passport to the future, for tomorrow belongs to those who prepare for it today." - Malcolm X
            </p>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Visit our website for more details about our admission process, visa assistance, and other services: <a href="https://studyguruindia.com" style="color: #e85d04; text-decoration: none; font-weight: 500; border-bottom: 1px solid #f8c8a9;">studyguruindia.com</a></p>
          
          <!-- Contact Section with Social Media Icons -->
          <div style="margin-top: 30px; background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
            <h3 style="color: #e85d04; font-size: 18px; margin-bottom: 15px; text-align: center;">Connect With Us</h3>
            
            <p style="color: #333; font-size: 16px; line-height: 1.5; text-align: center; margin-bottom: 20px;">
              Have questions or need assistance? Reach out to us through any of these channels:
            </p>
            
            <div style="display: flex; justify-content: center; margin-bottom: 20px;">
              <!-- Email -->
              <a href="mailto:Help@studyguruindia.com" style="text-decoration: none; margin: 0 10px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div style="background-color: #f0f0f0; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" style="width: 25px; height: 25px; display: block;" />
                  </div>
                  <span style="font-size: 12px; color: #666;">Email</span>
                </div>
              </a>
              
              <!-- WhatsApp -->
              <a href="https://wa.me/4306787801657" target="_blank" rel="noopener noreferrer" style="text-decoration: none; margin: 0 10px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div style="background-color: #f0f0f0; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" style="width: 25px; height: 25px; display: block;" />
                  </div>
                  <span style="font-size: 12px; color: #666;">WhatsApp</span>
                </div>
              </a>
              
              <!-- Instagram -->
              <a href="https://www.instagram.com/studyguruindiaa?igsh=MWk3anVxamk0aWQyYw==" target="_blank" rel="noopener noreferrer" style="text-decoration: none; margin: 0 10px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div style="background-color: #f0f0f0; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 25px; height: 25px; display: block;" />
                  </div>
                  <span style="font-size: 12px; color: #666;">Instagram</span>
                </div>
              </a>
              
              <!-- Facebook -->
              <a href="https://facebook.com/studyguru" target="_blank" rel="noopener noreferrer" style="text-decoration: none; margin: 0 10px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div style="background-color: #f0f0f0; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 25px; height: 25px; display: block;" />
                  </div>
                  <span style="font-size: 12px; color: #666;">Facebook</span>
                </div>
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 10px;">
              <p style="color: #333; font-size: 14px; margin-bottom: 5px;">
                <strong>Email:</strong> <a href="mailto:Help@studyguruindia.com" style="color: #e85d04; text-decoration: none;">Help@studyguruindia.com</a>
              </p>
              <p style="color: #333; font-size: 14px; margin-bottom: 5px;">
                <strong>WhatsApp:</strong> <a href="https://wa.me/4306787801657" target="_blank" rel="noopener noreferrer" style="color: #e85d04; text-decoration: none;">+43 06787801657</a>
              </p>
              <p style="color: #333; font-size: 14px;">
                <strong>Hours:</strong> Mon-Fri 9am-5pm IST
              </p>
            </div>
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5; margin-top: 20px;">Best regards,<br>The StudyGuru Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280; text-align: center;">
            <p>You're receiving this email because you subscribed to the StudyGuru newsletter.</p>
            <p>If you'd like to unsubscribe, <a href="https://studyguruindia.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #e85d04; text-decoration: none; font-weight: 500;">click here</a>.</p>
            <p>StudyGuru India • Help@studyguruindia.com • +43 06787801657</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'public/emaillogodark.png', // Relative to project root
          cid: logoImageCid // Same CID referenced in the HTML
        }
      ]
    };
  },
  
  // New template for article notification
  newArticleNotification: async (email: string, articleData: { title: string, slug: string, summary: string }) => {
    const { articles, news } = await getLatestContent();
    const logoImageCid = 'studyguru-logo';
    
    return {
      subject: `New Article: ${articleData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:${logoImageCid}" alt="StudyGuru Logo" style="max-width: 180px; height: auto;" />
          </div>
          
          <h2 style="color: #e85d04; text-align: center; font-size: 24px; margin-bottom: 20px;">New Article Published!</h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Dear Subscriber,</p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">We've just published a new article that might interest you:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #e85d04; margin-top: 0;">${articleData.title}</h3>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">${articleData.summary}</p>
            <a href="https://studyguruindia.com/articles/${articleData.slug}" style="display: inline-block; background-color: #e85d04; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Read Article</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280; text-align: center;">
            <p>You're receiving this email because you subscribed to the StudyGuru newsletter.</p>
            <p>If you'd like to unsubscribe, <a href="https://studyguruindia.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #e85d04; text-decoration: none; font-weight: 500;">click here</a>.</p>
            <p>StudyGuru India • Help@studyguruindia.com • +43 06787801657</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'public/emaillogodark.png',
          cid: logoImageCid
        }
      ]
    };
  },
  
  // New template for news notification
  newNewsNotification: async (email: string, newsData: { title: string, slug: string, summary: string }) => {
    const logoImageCid = 'studyguru-logo';
    
    return {
      subject: `Latest News: ${newsData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:${logoImageCid}" alt="StudyGuru Logo" style="max-width: 180px; height: auto;" />
          </div>
          
          <h2 style="color: #e85d04; text-align: center; font-size: 24px; margin-bottom: 20px;">Latest News Update!</h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">Dear Subscriber,</p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.5;">We've just published a new news item that might interest you:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #e85d04; margin-top: 0;">${newsData.title}</h3>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">${newsData.summary}</p>
            <a href="https://studyguruindia.com/news/${newsData.slug}" style="display: inline-block; background-color: #e85d04; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Read Full News</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #6b7280; text-align: center;">
            <p>You're receiving this email because you subscribed to the StudyGuru newsletter.</p>
            <p>If you'd like to unsubscribe, <a href="https://studyguruindia.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #e85d04; text-decoration: none; font-weight: 500;">click here</a>.</p>
            <p>StudyGuru India • Help@studyguruindia.com • +43 06787801657</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'public/emaillogodark.png',
          cid: logoImageCid
        }
      ]
    };
  }
};

// Send email function
export const sendEmail = async (
  to: string,
  templateName: keyof typeof templates,
  data: any = {}
) => {
  try {
    log(`Attempting to send email to: ${to} using template: ${templateName}`, 'email');
    const template = await templates[templateName](to, data);
    
    const mailOptions = {
      from: `"StudyGuru" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
      attachments: template.attachments // Add attachments to mail options
    };
    
    log(`Mail options prepared: ${JSON.stringify({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    })}`, 'email');
    
    const info = await transporter.sendMail(mailOptions);
    log(`Email sent: ${info.messageId}`, 'email');
    log(`Email response: ${JSON.stringify(info)}`, 'email');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    log(`Error sending email: ${error}`, 'email');
    if (error instanceof Error) {
      log(`Error details: ${error.message}`, 'email');
      log(`Error stack: ${error.stack}`, 'email');
    }
    return { success: false, error };
  }
};

// Verify email connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    log('Email service connected successfully', 'email');
    return true;
  } catch (error) {
    log(`Email service connection failed: ${error}`, 'email');
    return false;
  }
};

// Add this at the top of the file to improve error logging
const logEmailError = (error: any, context: string) => {
  log(`${context} - Error: ${error}`, 'email');
  if (error instanceof Error) {
    log(`${context} - Error details: ${error.message}`, 'email');
    log(`${context} - Error stack: ${error.stack}`, 'email');
  } else {
    log(`${context} - Unknown error type: ${typeof error}`, 'email');
  }
};

// Add this function to send emails to all newsletter subscribers
export const notifySubscribersAboutNewArticle = async (articleData: { title: string, slug: string, summary: string }) => {
  try {
    
    // Define subscriber interface to match what comes from the database
    interface NewsletterSubscriber {
      _id?: any;
      email: string;
      subscribed: boolean;
      subscribedAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
      __v?: number;
    }
    
    // Get all active subscribers
    const subscribers = await Newsletter.find({ subscribed: true })
      .select('email')
      .lean() as unknown as NewsletterSubscriber[];
    
    if (!subscribers || subscribers.length === 0) {
      log('No active subscribers found to notify about new article', 'email');
      return { success: true, message: 'No subscribers to notify' };
    }
    
    log(`Found ${subscribers.length} subscribers to notify about new article`, 'email');
    
    // Send emails in batches to avoid overloading the email server
    const batchSize = 20;
    const results = { success: 0, failed: 0 };
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      try {
        // Process batch in parallel
        const promises = batch.map((subscriber: NewsletterSubscriber) => 
          sendEmail(subscriber.email, 'newArticleNotification', articleData)
            .then(result => {
              if (result.success) results.success++;
              else results.failed++;
              return result;
            })
            .catch(err => {
              log(`Failed to send article notification to ${subscriber.email}: ${err}`, 'email');
              results.failed++;
              return { success: false, error: err };
            })
        );
        
        await Promise.all(promises);
        
        // Add a small delay between batches
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (batchError) {
        log(`Error processing batch ${i}-${i+batchSize}: ${batchError}`, 'email');
      }
    }
    
    log(`Notification complete. Success: ${results.success}, Failed: ${results.failed}`, 'email');
    return { success: true, results };
  } catch (error) {
    log(`Error notifying subscribers about new article: ${error}`, 'email');
    if (error instanceof Error) {
      log(`Error details: ${error.message}`, 'email');
      log(`Error stack: ${error.stack}`, 'email');
    }
    return { success: false, error };
  }
};

// Function to notify subscribers about new news items
export const notifySubscribersAboutNewNews = async (newsData: { title: string, slug: string, summary: string }) => {
  try {
    
    // Define subscriber interface to match what comes from the database
    interface NewsletterSubscriber {
      _id?: any;
      email: string;
      subscribed: boolean;
      subscribedAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
      __v?: number;
    }
    
    // Get all active subscribers
    const subscribers = await Newsletter.find({ subscribed: true })
      .select('email')
      .lean() as unknown as NewsletterSubscriber[];
    
    if (!subscribers || subscribers.length === 0) {
      log('No active subscribers found to notify about new news', 'email');
      return { success: true, message: 'No subscribers to notify' };
    }
    
    log(`Found ${subscribers.length} subscribers to notify about new news`, 'email');
    
    // Send emails in batches to avoid overloading the email server
    const batchSize = 20;
    const results = { success: 0, failed: 0 };
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      try {
        // Process batch in parallel
        const promises = batch.map((subscriber: NewsletterSubscriber) => 
          sendEmail(subscriber.email, 'newNewsNotification', newsData)
            .then(result => {
              if (result.success) results.success++;
              else results.failed++;
              return result;
            })
            .catch(err => {
              log(`Failed to send news notification to ${subscriber.email}: ${err}`, 'email');
              results.failed++;
              return { success: false, error: err };
            })
        );
        
        await Promise.all(promises);
        
        // Add a small delay between batches
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      } catch (batchError) {
        log(`Error processing batch ${i}-${i+batchSize}: ${batchError}`, 'email');
      }
    }
    
    log(`News notification complete. Success: ${results.success}, Failed: ${results.failed}`, 'email');
    return { success: true, results };
  } catch (error) {
    log(`Error notifying subscribers about new news: ${error}`, 'email');
    if (error instanceof Error) {
      log(`Error details: ${error.message}`, 'email');
      log(`Error stack: ${error.stack}`, 'email');
    }
    return { success: false, error };
  }
};

// Add a new function to test email notifications
export const testEmailNotification = async (email: string, type: 'article' | 'news') => {
  try {
    // Create test data
    const testData = {
      title: type === 'article' ? 'Test Article Notification' : 'Test News Notification',
      slug: type === 'article' ? 'test-article' : 'test-news',
      summary: `This is a test ${type} notification to verify email functionality.`
    };
    
    // Send test email based on type
    const template = type === 'article' ? 'newArticleNotification' : 'newNewsNotification';
    const result = await sendEmail(email, template, testData);
    
    log(`Test ${type} notification sent to ${email}: ${JSON.stringify(result)}`, 'email');
    return result;
  } catch (error) {
    log(`Error sending test ${type} notification: ${error}`, 'email');
    if (error instanceof Error) {
      log(`Error details: ${error.message}`, 'email');
      log(`Error stack: ${error.stack}`, 'email');
    }
    return { success: false, error };
  }
};



























