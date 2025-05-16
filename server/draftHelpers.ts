import connectToDatabase from './lib/mongodb';
import DraftArticle from './models/DraftArticle';
import DraftNews from './models/DraftNews';
import { log } from './vite';

/**
 * Helper functions for working with draft articles and news in MongoDB
 */

// Create a draft article
export async function createDraftArticle(articleData: any) {
  try {
    const conn = await connectToDatabase();
    if (!conn) throw new Error('Database connection failed');
    
    const newDraftArticle = await DraftArticle.create(articleData);
    return documentToObject(newDraftArticle);
  } catch (error) {
    log(`MongoDB Error (createDraftArticle): ${error}`, 'mongodb');
    throw error;
  }
}

// Get all draft articles
export async function getAllDraftArticles() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return [];
    
    const draftArticles = await DraftArticle.find({}).sort({ createdAt: -1 });
    return draftArticles.map(documentToObject);
  } catch (error) {
    log(`MongoDB Error (getAllDraftArticles): ${error}`, 'mongodb');
    return [];
  }
}

// Get a specific draft article by ID
export async function getDraftArticleById(id: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return undefined;
    
    const draftArticle = await DraftArticle.findById(id);
    return draftArticle ? documentToObject(draftArticle) : undefined;
  } catch (error) {
    log(`MongoDB Error (getDraftArticleById): ${error}`, 'mongodb');
    return undefined;
  }
}

// Update a draft article
export async function updateDraftArticle(id: string, articleData: any) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return undefined;
    
    const updatedDraftArticle = await DraftArticle.findByIdAndUpdate(
      id, 
      { $set: articleData },
      { new: true, runValidators: true }
    );
    
    return updatedDraftArticle ? documentToObject(updatedDraftArticle) : undefined;
  } catch (error) {
    log(`MongoDB Error (updateDraftArticle): ${error}`, 'mongodb');
    return undefined;
  }
}

// Delete a draft article
export async function deleteDraftArticle(id: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return false;
    
    const result = await DraftArticle.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    log(`MongoDB Error (deleteDraftArticle): ${error}`, 'mongodb');
    return false;
  }
}

// Create a draft news
export async function createDraftNews(newsData: any) {
  try {
    const conn = await connectToDatabase();
    if (!conn) throw new Error('Database connection failed');
    
    const newDraftNews = await DraftNews.create(newsData);
    return documentToObject(newDraftNews);
  } catch (error) {
    log(`MongoDB Error (createDraftNews): ${error}`, 'mongodb');
    throw error;
  }
}

// Get all draft news
export async function getAllDraftNews() {
  try {
    const conn = await connectToDatabase();
    if (!conn) return [];
    
    const draftNews = await DraftNews.find({}).sort({ createdAt: -1 });
    return draftNews.map(documentToObject);
  } catch (error) {
    log(`MongoDB Error (getAllDraftNews): ${error}`, 'mongodb');
    return [];
  }
}

// Get a specific draft news by ID
export async function getDraftNewsById(id: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return undefined;
    
    const draftNews = await DraftNews.findById(id);
    return draftNews ? documentToObject(draftNews) : undefined;
  } catch (error) {
    log(`MongoDB Error (getDraftNewsById): ${error}`, 'mongodb');
    return undefined;
  }
}

// Update a draft news
export async function updateDraftNews(id: string, newsData: any) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return undefined;
    
    const updatedDraftNews = await DraftNews.findByIdAndUpdate(
      id, 
      { $set: newsData },
      { new: true, runValidators: true }
    );
    
    return updatedDraftNews ? documentToObject(updatedDraftNews) : undefined;
  } catch (error) {
    log(`MongoDB Error (updateDraftNews): ${error}`, 'mongodb');
    return undefined;
  }
}

// Delete a draft news
export async function deleteDraftNews(id: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return false;
    
    const result = await DraftNews.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    log(`MongoDB Error (deleteDraftNews): ${error}`, 'mongodb');
    return false;
  }
}

// Publish a draft article (move from draft to published)
export async function publishDraftArticle(draftId: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return undefined;
    
    // Get the draft article
    const draftArticle = await DraftArticle.findById(draftId);
    if (!draftArticle) return undefined;
    
    // Create a new published article from the draft
    const Article = (await import('./models/Article')).default;
    const articleData = documentToObject(draftArticle);
    
    // Remove the draft-specific fields
    delete articleData._id;
    delete articleData.id;
    delete articleData.originalArticleId;
    
    // Create the published article
    const newArticle = await Article.create(articleData);
    
    // Delete the draft
    await DraftArticle.findByIdAndDelete(draftId);
    
    return documentToObject(newArticle);
  } catch (error) {
    log(`MongoDB Error (publishDraftArticle): ${error}`, 'mongodb');
    return undefined;
  }
}

// Publish a draft news (move from draft to published)
export async function publishDraftNews(draftId: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return undefined;
    
    // Get the draft news
    const draftNews = await DraftNews.findById(draftId);
    if (!draftNews) return undefined;
    
    // Create a new published news from the draft
    const News = (await import('./models/News')).default;
    const newsData = documentToObject(draftNews);
    
    // Remove the draft-specific fields
    delete newsData._id;
    delete newsData.id;
    delete newsData.originalNewsId;
    
    // Create the published news
    const newNews = await News.create(newsData);
    
    // Delete the draft
    await DraftNews.findByIdAndDelete(draftId);
    
    return documentToObject(newNews);
  } catch (error) {
    log(`MongoDB Error (publishDraftNews): ${error}`, 'mongodb');
    return undefined;
  }
}

// Helper function to convert MongoDB document to plain object
export function documentToObject(doc: any) {
  if (!doc) return null;
  
  // Convert MongoDB document to plain object
  const obj = doc.toObject ? doc.toObject() : doc;
  
  // Add id property that is used in the app
  if (obj._id) {
    obj.id = obj._id.toString();
  }
  
  return obj;
}