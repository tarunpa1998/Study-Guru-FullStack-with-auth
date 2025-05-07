import { Request, Response, Router } from 'express';
import { mongoStorage } from '../../mongoStorage';

const helpfulRouter = Router();

// Route for updating article helpful votes
helpfulRouter.post('/articles/:slug/helpful', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { helpful } = req.body;

    if (!helpful || typeof helpful !== 'object' || 
        !('yes' in helpful) || !('no' in helpful) ||
        typeof helpful.yes !== 'number' || typeof helpful.no !== 'number') {
      return res.status(400).json({ 
        error: 'Invalid request body. Expected {helpful: {yes: number, no: number}}' 
      });
    }

    // Get the article
    const article = await mongoStorage.getArticleBySlug(slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Update the article's helpful votes
    const updatedArticle = await mongoStorage.updateArticle(article.id, {
      helpful: {
        yes: helpful.yes,
        no: helpful.no
      }
    });

    if (!updatedArticle) {
      return res.status(500).json({ error: 'Failed to update article' });
    }

    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error('Error updating article helpful votes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for updating news helpful votes
helpfulRouter.post('/news/:slug/helpful', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { helpful } = req.body;

    if (!helpful || typeof helpful !== 'object' || 
        !('yes' in helpful) || !('no' in helpful) ||
        typeof helpful.yes !== 'number' || typeof helpful.no !== 'number') {
      return res.status(400).json({ 
        error: 'Invalid request body. Expected {helpful: {yes: number, no: number}}' 
      });
    }

    // Get the news item
    const newsItem = await mongoStorage.getNewsBySlug(slug);
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }

    // Update the news item's helpful votes
    const updatedNewsItem = await mongoStorage.updateNews(newsItem.id, {
      helpful: {
        yes: helpful.yes,
        no: helpful.no
      }
    });

    if (!updatedNewsItem) {
      return res.status(500).json({ error: 'Failed to update news item' });
    }

    return res.status(200).json(updatedNewsItem);
  } catch (error) {
    console.error('Error updating news helpful votes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default helpfulRouter;