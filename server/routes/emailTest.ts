import { Router, Request, Response } from 'express';
// import { adminAuth } from '../middleware/auth';
import { 
  verifyEmailConnection, 
  testEmailNotification, 
  notifySubscribersAboutNewArticle, 
  notifySubscribersAboutNewNews 
} from '../utils/emailService';
import { log } from '../vite';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Email testing endpoints
 */

/**
 * @swagger
 * /admin/email/test-connection:
 *   get:
 *     summary: Test email server connection
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Connection test result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get('/test-connection', async (req: Request, res: Response) => {
  try {
    const isConnected = await verifyEmailConnection();
    
    if (isConnected) {
      return res.json({
        success: true,
        message: 'Email server connection successful'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Email server connection failed'
      });
    }
  } catch (error) {
    log(`Error testing email connection: ${error}`, 'email');
    res.status(500).json({
      success: false,
      message: 'Error testing email connection',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * @swagger
 * /admin/email/test-notification:
 *   post:
 *     summary: Test email notification
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - type
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address to send test notification to
 *               type:
 *                 type: string
 *                 enum: [article, news]
 *                 description: Type of notification to test
 *     responses:
 *       200:
 *         description: Test notification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/test-notification', async (req: Request, res: Response) => {
  try {
    const { email, type } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    if (!type || !['article', 'news'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type is required and must be either "article" or "news"' 
      });
    }
    
    log(`Testing ${type} notification to: ${email}`, 'email');
    const result = await testEmailNotification(email, type as 'article' | 'news');
    
    if (result.success) {
      return res.json({
        success: true,
        message: `Test ${type} notification sent successfully`,
        result
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Failed to send test ${type} notification`,
        error: result.error
      });
    }
  } catch (error) {
    log(`Error sending test notification: ${error}`, 'email');
    res.status(500).json({
      success: false,
      message: 'Error sending test notification',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * @swagger
 * /admin/email/test-bulk-notification:
 *   post:
 *     summary: Test bulk email notification to all subscribers
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - data
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [article, news]
 *                 description: Type of notification to test
 *               data:
 *                 type: object
 *                 required:
 *                   - title
 *                   - slug
 *                   - summary
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Title of the content
 *                   slug:
 *                     type: string
 *                     description: Slug of the content
 *                   summary:
 *                     type: string
 *                     description: Summary of the content
 *     responses:
 *       200:
 *         description: Bulk notification test result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/test-bulk-notification', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !['article', 'news'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type is required and must be either "article" or "news"' 
      });
    }
    
    if (!data || !data.title || !data.slug || !data.summary) {
      return res.status(400).json({
        success: false,
        message: 'Data object with title, slug, and summary is required'
      });
    }
    
    log(`Testing bulk ${type} notification with data: ${JSON.stringify(data)}`, 'email');
    
    let result;
    if (type === 'article') {
      result = await notifySubscribersAboutNewArticle(data);
    } else {
      result = await notifySubscribersAboutNewNews(data);
    }
    
    return res.json({
      success: true,
      message: `Bulk ${type} notification test completed`,
      result
    });
  } catch (error) {
    log(`Error testing bulk notification: ${error}`, 'email');
    res.status(500).json({
      success: false,
      message: 'Error testing bulk notification',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
