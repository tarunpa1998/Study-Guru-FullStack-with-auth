import { Router, Request, Response } from 'express';
import { log } from '../vite';
import connectToDatabase from '../lib/mongodb';
import { rateLimit } from 'express-rate-limit';
import Newsletter from '../models/Newsletter';
import { sendEmail } from '../utils/emailService';

const router = Router();

// Rate limiter for subscription endpoints
const subscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { message: 'Too many subscription attempts, please try again later' },
});

/**
 * @swagger
 * /newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Successfully subscribed or already subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       201:
 *         description: Successfully subscribed to newsletter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Email is required
 *       500:
 *         description: Server error
 */
router.post('/subscribe', subscriptionLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      // If already subscribed, just return success
      if (existingSubscription.subscribed) {
        return res.json({ message: 'Email already subscribed' });
      }
      
      // If previously unsubscribed, resubscribe
      existingSubscription.subscribed = true;
      existingSubscription.subscribedAt = new Date();
      await existingSubscription.save();
      
      // Send welcome back email
      await sendEmail(email, 'newsletterSubscription');
      
      return res.json({ message: 'Successfully resubscribed to newsletter' });
    }
    
    // Create new subscription
    const newSubscription = new Newsletter({
      email,
      subscribed: true,
      subscribedAt: new Date(),
    });
    
    await newSubscription.save();

    // Send welcome email
    log(`Attempting to send welcome email to: ${email}`, 'newsletter');
    const emailResult = await sendEmail(email, 'newsletterSubscription');
    log(`Email send result: ${JSON.stringify(emailResult)}`, 'newsletter');

    log(`New newsletter subscription: ${email}`, 'newsletter');
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (err) {
    log(`Newsletter subscription error: ${err}`, 'newsletter');
    res.status(500).json({ message: 'Server error during subscription' });
  }
});

/**
 * @swagger
 * /newsletter/check-subscription:
 *   post:
 *     summary: Check if email is subscribed to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Subscription status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSubscribed:
 *                   type: boolean
 *       400:
 *         description: Email is required
 *       500:
 *         description: Server error
 */
router.post('/check-subscription', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    // Check if email exists and is subscribed
    const subscription = await Newsletter.findOne({ email });
    
    const isSubscribed = subscription ? subscription.subscribed : false;
    
    res.json({ isSubscribed });
  } catch (err) {
    log(`Check subscription error: ${err}`, 'newsletter');
    res.status(500).json({ message: 'Server error checking subscription' });
  }
});

/**
 * @swagger
 * /newsletter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Email is required
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Connect to MongoDB
    const conn = await connectToDatabase();
    if (!conn) {
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    // Find the subscription
    const subscription = await Newsletter.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Update subscription status
    subscription.subscribed = false;
    await subscription.save();
    
    log(`Unsubscribed from newsletter: ${email}`, 'newsletter');
    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (err) {
    log(`Newsletter unsubscription error: ${err}`, 'newsletter');
    res.status(500).json({ message: 'Server error during unsubscription' });
  }
});

/**
 * @swagger
 * /newsletter/test-email:
 *   post:
 *     summary: Test email sending functionality
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to send test email to
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       400:
 *         description: Email is required
 *       500:
 *         description: Failed to send test email
 */
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    log(`Testing email to: ${email}`, 'newsletter');
    const emailResult = await sendEmail(email, 'newsletterSubscription');
    
    if (emailResult.success) {
      log(`Test email sent successfully: ${JSON.stringify(emailResult)}`, 'newsletter');
      return res.json({ message: 'Test email sent successfully', result: emailResult });
    } else {
      log(`Test email failed: ${JSON.stringify(emailResult)}`, 'newsletter');
      return res.status(500).json({ message: 'Failed to send test email', error: emailResult.error });
    }
  } catch (err) {
    log(`Test email error: ${err}`, 'newsletter');
    res.status(500).json({ message: 'Server error during test email' });
  }
});

export default router;




