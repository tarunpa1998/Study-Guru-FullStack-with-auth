import { Router, Request, Response } from 'express';
import { adminAuth } from '../middleware/auth';
import slugify from 'slugify';
import {
  createDraftArticle,
  getAllDraftArticles,
  getDraftArticleById,
  updateDraftArticle,
  deleteDraftArticle,
  publishDraftArticle,
  createDraftNews,
  getAllDraftNews,
  getDraftNewsById,
  updateDraftNews,
  deleteDraftNews,
  publishDraftNews
} from '../draftHelpers';
import { log } from '../vite';

const router = Router();

/**
 * Article Drafts Routes
 */

/**
 * @route   GET /api/admin/drafts/articles
 * @desc    Get all draft articles
 * @access  Private (Admin)
 */
router.get('/drafts/articles', adminAuth, async (req: Request, res: Response) => {
  try {
    const draftArticles = await getAllDraftArticles();
    res.json(draftArticles);
  } catch (error) {
    log(`Error getting draft articles: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/drafts/articles/:id
 * @desc    Get draft article by ID
 * @access  Private (Admin)
 */
router.get('/drafts/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const draftArticle = await getDraftArticleById(req.params.id);
    
    if (!draftArticle) {
      return res.status(404).json({ error: 'Draft article not found' });
    }
    
    res.json(draftArticle);
  } catch (error) {
    log(`Error getting draft article: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/drafts/articles
 * @desc    Create a new draft article
 * @access  Private (Admin)
 */
router.post('/drafts/articles', adminAuth, async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    
    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = slugify(articleData.title, { lower: true, strict: true });
    }
    
    // Add default values for missing fields
    if (!articleData.seo) {
      articleData.seo = {
        metaTitle: articleData.title,
        metaDescription: articleData.summary ? articleData.summary.substring(0, 160) : '',
        keywords: []
      };
    }
    
    if (!articleData.helpful) {
      articleData.helpful = { yes: 0, no: 0 };
    }
    
    // Ensure isFeatured is a boolean
    if (articleData.isFeatured === undefined) {
      articleData.isFeatured = false;
    } else {
      articleData.isFeatured = Boolean(articleData.isFeatured);
    }
    
    // Set a default publish date if not provided
    if (!articleData.publishDate) {
      articleData.publishDate = new Date().toISOString().split('T')[0];
    }
    
    // Create the draft article
    const newDraftArticle = await createDraftArticle(articleData);
    res.status(201).json(newDraftArticle);
  } catch (error) {
    log(`Error creating draft article: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/drafts/articles/:id
 * @desc    Update a draft article
 * @access  Private (Admin)
 */
router.put('/drafts/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    
    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = slugify(articleData.title, { lower: true, strict: true });
    }
    
    // Update the draft article
    const updatedDraftArticle = await updateDraftArticle(req.params.id, articleData);
    
    if (!updatedDraftArticle) {
      return res.status(404).json({ error: 'Draft article not found' });
    }
    
    res.json(updatedDraftArticle);
  } catch (error) {
    log(`Error updating draft article: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/drafts/articles/:id
 * @desc    Delete a draft article
 * @access  Private (Admin)
 */
router.delete('/drafts/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const success = await deleteDraftArticle(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Draft article not found' });
    }
    
    res.json({ success: true, message: 'Draft article deleted successfully' });
  } catch (error) {
    log(`Error deleting draft article: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/drafts/articles/:id/publish
 * @desc    Publish a draft article (move to published articles)
 * @access  Private (Admin)
 */
router.post('/drafts/articles/:id/publish', adminAuth, async (req: Request, res: Response) => {
  try {
    const publishedArticle = await publishDraftArticle(req.params.id);
    
    if (!publishedArticle) {
      return res.status(404).json({ error: 'Draft article not found' });
    }
    
    res.json({
      success: true,
      message: 'Draft article published successfully',
      article: publishedArticle
    });
  } catch (error) {
    log(`Error publishing draft article: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * News Drafts Routes
 */

/**
 * @route   GET /api/admin/drafts/news
 * @desc    Get all draft news
 * @access  Private (Admin)
 */
router.get('/drafts/news', adminAuth, async (req: Request, res: Response) => {
  try {
    const draftNews = await getAllDraftNews();
    res.json(draftNews);
  } catch (error) {
    log(`Error getting draft news: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/drafts/news/:id
 * @desc    Get draft news by ID
 * @access  Private (Admin)
 */
router.get('/drafts/news/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const draftNews = await getDraftNewsById(req.params.id);
    
    if (!draftNews) {
      return res.status(404).json({ error: 'Draft news not found' });
    }
    
    res.json(draftNews);
  } catch (error) {
    log(`Error getting draft news: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/drafts/news
 * @desc    Create a new draft news
 * @access  Private (Admin)
 */
router.post('/drafts/news', adminAuth, async (req: Request, res: Response) => {
  try {
    const newsData = req.body;
    
    // Generate slug if not provided
    if (!newsData.slug) {
      newsData.slug = slugify(newsData.title, { lower: true, strict: true });
    }
    
    // Add default values for missing fields
    if (!newsData.seo) {
      newsData.seo = {
        metaTitle: newsData.title,
        metaDescription: newsData.summary ? newsData.summary.substring(0, 160) : '',
        keywords: []
      };
    }
    
    // Set default values for missing fields
    if (!newsData.image) {
      newsData.image = null;
    }
    
    if (!newsData.publishDate) {
      newsData.publishDate = new Date().toISOString().split('T')[0];
    }
    
    if (newsData.isFeatured === undefined) {
      newsData.isFeatured = false;
    }
    
    // Create the draft news
    const newDraftNews = await createDraftNews(newsData);
    res.status(201).json(newDraftNews);
  } catch (error) {
    log(`Error creating draft news: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/drafts/news/:id
 * @desc    Update a draft news
 * @access  Private (Admin)
 */
router.put('/drafts/news/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const newsData = req.body;
    
    // Generate slug if not provided
    if (!newsData.slug) {
      newsData.slug = slugify(newsData.title, { lower: true, strict: true });
    }
    
    // Update the draft news
    const updatedDraftNews = await updateDraftNews(req.params.id, newsData);
    
    if (!updatedDraftNews) {
      return res.status(404).json({ error: 'Draft news not found' });
    }
    
    res.json(updatedDraftNews);
  } catch (error) {
    log(`Error updating draft news: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/drafts/news/:id
 * @desc    Delete a draft news
 * @access  Private (Admin)
 */
router.delete('/drafts/news/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const success = await deleteDraftNews(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Draft news not found' });
    }
    
    res.json({ success: true, message: 'Draft news deleted successfully' });
  } catch (error) {
    log(`Error deleting draft news: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/drafts/news/:id/publish
 * @desc    Publish a draft news (move to published news)
 * @access  Private (Admin)
 */
router.post('/drafts/news/:id/publish', adminAuth, async (req: Request, res: Response) => {
  try {
    const publishedNews = await publishDraftNews(req.params.id);
    
    if (!publishedNews) {
      return res.status(404).json({ error: 'Draft news not found' });
    }
    
    res.json({
      success: true,
      message: 'Draft news published successfully',
      news: publishedNews
    });
  } catch (error) {
    log(`Error publishing draft news: ${error}`, 'admin');
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;