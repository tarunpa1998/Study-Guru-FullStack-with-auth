import { Router, Request, Response } from 'express';
import { mongoStorage } from '../mongoStorage';
import { adminAuth } from '../middleware/auth';
import slugify from 'slugify';

const router = Router();

/**
 * @route   GET /api/admin/articles
 * @desc    Get all articles with pagination
 * @access  Private (Admin)
 */
router.get('/articles', adminAuth, async (req: Request, res: Response) => {
  try {
    const articles = await mongoStorage.getAllArticles();
    res.json(articles);
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/admin/articles/:id
 * @desc    Get article by ID
 * @access  Private (Admin)
 */
router.get('/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    // Get the article by ID instead of slug
    const article = await mongoStorage.getArticleById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/admin/articles
 * @desc    Create a new article
 * @access  Private (Admin)
 */
router.post('/articles', adminAuth, async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    
    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = slugify(articleData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!articleData.title || !articleData.content || !articleData.summary) {
      return res.status(400).json({ error: 'Title, content, and summary are required' });
    }
    
    // Add default values for missing fields
    if (!articleData.seo) {
      articleData.seo = {
        metaTitle: articleData.title,
        metaDescription: articleData.summary.substring(0, 160),
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
    
    // Process tableOfContents for MongoDB format
    if (articleData.tableOfContents) {
      articleData.tableOfContents = articleData.tableOfContents.map(section => {
        // Clean up the section by removing MongoDB-specific fields
        const cleanSection = { ...section };
        if (cleanSection._id) delete cleanSection._id;
        
        // Make sure title is present (no need to convert to text as MongoDB uses title)
        if (!cleanSection.title && cleanSection.text) {
          cleanSection.title = cleanSection.text;
          delete cleanSection.text;
        }
        
        return cleanSection;
      });
    } else {
      articleData.tableOfContents = [];
    }
    
    // Clean up faqs array by removing MongoDB-specific fields
    if (articleData.faqs) {
      articleData.faqs = articleData.faqs.map(faq => {
        const cleanFaq = { ...faq };
        if (cleanFaq._id) delete cleanFaq._id;
        return cleanFaq;
      });
    } else {
      articleData.faqs = [];
    }
    
    // Handle readingTime as a string in format "X min read"
    if (articleData.readTime !== undefined) {
      // Convert readTime to readingTime
      if (typeof articleData.readTime === 'number') {
        articleData.readingTime = `${articleData.readTime} min read`;
      } else if (typeof articleData.readTime === 'string') {
        // Check if it already has the correct format
        if (articleData.readTime.includes('min read')) {
          articleData.readingTime = articleData.readTime;
        } else {
          // Extract number and format properly
          const minutes = parseInt(articleData.readTime, 10) || 1;
          articleData.readingTime = `${minutes} min read`;
        }
      }
      // Remove the original readTime field
      delete articleData.readTime;
    } else if (articleData.readingTime === undefined) {
      articleData.readingTime = "1 min read";
    }
    
    // Clean up relatedArticles array
    if (articleData.relatedArticles) {
      articleData.relatedArticles = articleData.relatedArticles.filter(slug => slug && slug.trim() !== '');
    } else {
      articleData.relatedArticles = [];
    }
    
    // Set default values for other fields
    if (!articleData.publishDate) {
      articleData.publishDate = new Date().toISOString().split('T')[0];
    }
    
    console.log('Creating article with data:', JSON.stringify({
      title: articleData.title,
      readingTime: articleData.readingTime,
      tableOfContents: articleData.tableOfContents,
      relatedArticles: articleData.relatedArticles,
      faqs: articleData.faqs,
      isFeatured: articleData.isFeatured
    }));
    
    const newArticle = await mongoStorage.createArticle(articleData);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   PUT /api/admin/articles/:id
 * @desc    Update an article
 * @access  Private (Admin)
 */
router.put('/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    
    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = slugify(articleData.title, { lower: true, strict: true });
    }
    
    // Validate required fields
    if (!articleData.title || !articleData.content || !articleData.summary) {
      return res.status(400).json({ error: 'Title, content, and summary are required' });
    }
    
    // Check if article exists
    const existingArticle = await mongoStorage.getArticleById(req.params.id);
    
    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Ensure these fields have proper values even during updates
    if (!articleData.seo) {
      articleData.seo = existingArticle.seo || {
        metaTitle: articleData.title,
        metaDescription: articleData.summary.substring(0, 160),
        keywords: []
      };
    }
    
    if (articleData.helpful === undefined) {
      articleData.helpful = existingArticle.helpful || { yes: 0, no: 0 };
    }
    
    // Ensure isFeatured is a boolean
    if (articleData.isFeatured === undefined) {
      articleData.isFeatured = existingArticle.isFeatured || false;
    } else {
      articleData.isFeatured = Boolean(articleData.isFeatured);
    }
    
    // Process tableOfContents for MongoDB format
    if (articleData.tableOfContents) {
      articleData.tableOfContents = articleData.tableOfContents.map(section => {
        // Clean up the section by removing MongoDB-specific fields
        const cleanSection = { ...section };
        if (cleanSection._id) delete cleanSection._id;
        
        // Make sure title is present (no need to convert to text as MongoDB uses title)
        if (!cleanSection.title && cleanSection.text) {
          cleanSection.title = cleanSection.text;
          delete cleanSection.text;
        }
        
        return cleanSection;
      });
    } else {
      articleData.tableOfContents = existingArticle.tableOfContents || [];
    }
    
    // Clean up faqs array by removing MongoDB-specific fields
    if (articleData.faqs) {
      articleData.faqs = articleData.faqs.map(faq => {
        const cleanFaq = { ...faq };
        if (cleanFaq._id) delete cleanFaq._id;
        return cleanFaq;
      });
    } else {
      articleData.faqs = existingArticle.faqs || [];
    }
    
    // Handle readingTime as a string in format "X min read"
    if (articleData.readTime !== undefined) {
      // Convert readTime to readingTime
      if (typeof articleData.readTime === 'number') {
        articleData.readingTime = `${articleData.readTime} min read`;
      } else if (typeof articleData.readTime === 'string') {
        // Check if it already has the correct format
        if (articleData.readTime.includes('min read')) {
          articleData.readingTime = articleData.readTime;
        } else {
          // Extract number and format properly
          const minutes = parseInt(articleData.readTime, 10) || 1;
          articleData.readingTime = `${minutes} min read`;
        }
      }
      // Remove the original readTime field
      delete articleData.readTime;
    } else if (articleData.readingTime === undefined) {
      articleData.readingTime = existingArticle.readingTime || "1 min read";
    }
    
    // Clean up relatedArticles array
    if (articleData.relatedArticles) {
      articleData.relatedArticles = articleData.relatedArticles.filter(slug => slug && slug.trim() !== '');
    } else {
      articleData.relatedArticles = existingArticle.relatedArticles || [];
    }
    
    console.log('Updating article with data:', JSON.stringify({
      title: articleData.title,
      readingTime: articleData.readingTime,
      tableOfContents: articleData.tableOfContents,
      relatedArticles: articleData.relatedArticles,
      faqs: articleData.faqs,
      isFeatured: articleData.isFeatured
    }));
    
    // Update the article in MongoDB
    const updatedArticle = await mongoStorage.updateArticle(req.params.id, articleData);
    
    if (!updatedArticle) {
      return res.status(500).json({ error: 'Failed to update article' });
    }
    
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/admin/articles/:id
 * @desc    Delete an article
 * @access  Private (Admin)
 */
router.delete('/articles/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    // Check if article exists
    const existingArticle = await mongoStorage.getArticleById(req.params.id);
    
    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Delete the article from MongoDB
    const success = await mongoStorage.deleteArticle(req.params.id);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete article' });
    }
    
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;