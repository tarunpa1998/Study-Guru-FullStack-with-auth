import { Router, Request, Response } from 'express';
import { mongoStorage } from '../mongoStorage';
import path from 'path';
import fs from 'fs';
import { Article, News } from '@shared/schema';

const router = Router();
const clientPath = path.resolve(process.cwd(), 'client');
const indexHtmlPath = path.join(clientPath, 'index.html');

// Extended types to handle MongoDB additional fields
interface ArticleWithSeo extends Article {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[] | string;
  };
  authorTitle?: string;
  _id?: string;
}

interface NewsWithSeo extends News {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[] | string;
  };
  _id?: string;
}

// Get the base HTML template
const getBaseHtml = (): string => {
  try {
    return fs.readFileSync(indexHtmlPath, 'utf-8');
  } catch (error) {
    console.error('Error reading index.html:', error);
    return ''; // Return empty string if file not found
  }
};

// Helper function to safely escape HTML/JSON string content
const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Server-side rendering for Article pages with proper SEO tags
router.get('/articles/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    // Fetch article from MongoDB
    const article = await mongoStorage.getArticleBySlug(slug) as ArticleWithSeo;
    
    if (!article) {
      // If article not found, serve the regular index.html
      return res.sendFile(indexHtmlPath);
    }
    
    // Get the base HTML
    let html = getBaseHtml();
    
    // Safely extract SEO data
    const title = article.seo?.metaTitle || `${article.title} | Study Guru`;
    const description = article.seo?.metaDescription || article.summary;
    const keywords = article.seo?.keywords ? 
      (Array.isArray(article.seo.keywords) ? article.seo.keywords.join(', ') : article.seo.keywords) : 
      article.category;
    
    // Prepare the SEO metadata
    const seoMetadata = `
    <!-- Server-side SEO metadata for article -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeHtml(`https://studyguruindia.com/articles/${article.slug}`)}" />
    ${article.image ? `<meta property="og:image" content="${escapeHtml(article.image)}" />` : ''}
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${article.image ? `<meta name="twitter:image" content="${escapeHtml(article.image)}" />` : ''}
    <link rel="canonical" href="${escapeHtml(`https://studyguruindia.com/articles/${article.slug}`)}" />
    
    <!-- Structured data for better SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${escapeHtml(article.title)}",
      "description": "${escapeHtml(article.summary)}",
      "image": "${article.image ? escapeHtml(article.image) : ''}",
      "author": {
        "@type": "Person",
        "name": "${escapeHtml(article.author)}",
        "jobTitle": "${escapeHtml(article.authorTitle || 'Education Consultant')}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Study Guru",
        "logo": {
          "@type": "ImageObject",
          "url": "https://studyguruindia.com/logo.png"
        }
      },
      "datePublished": "${article.publishDate}",
      "dateModified": "${article.publishDate}",
      "keywords": "${escapeHtml(keywords)}",
      "articleSection": "${escapeHtml(article.category)}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${escapeHtml(`https://studyguruindia.com/articles/${article.slug}`)}"
      }
    }
    </script>
    `;
    
    // Inject SEO metadata into the HTML head
    html = html.replace('</head>', `${seoMetadata}\n</head>`);
    
    // Log success for debugging
    console.log(`[SEO] Serving article '${article.title}' with server-side SEO metadata`);
    
    // Serve the HTML with injected SEO metadata
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error serving article page with SEO:', error);
    // Fallback to regular HTML file
    res.sendFile(indexHtmlPath);
  }
});

// Server-side rendering for News pages with proper SEO tags
router.get('/news/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    // Fetch news from MongoDB
    const newsItem = await mongoStorage.getNewsBySlug(slug) as NewsWithSeo;
    
    if (!newsItem) {
      // If news not found, serve the regular index.html
      return res.sendFile(indexHtmlPath);
    }
    
    // Get the base HTML
    let html = getBaseHtml();
    
    // Safely extract SEO data
    const title = newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`;
    const description = newsItem.seo?.metaDescription || newsItem.summary;
    const keywords = newsItem.seo?.keywords ? 
      (Array.isArray(newsItem.seo.keywords) ? newsItem.seo.keywords.join(', ') : newsItem.seo.keywords) : 
      newsItem.category;
    
    // Prepare the SEO metadata
    const seoMetadata = `
    <!-- Server-side SEO metadata for news -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeHtml(`https://studyguruindia.com/news/${newsItem.slug}`)}" />
    ${newsItem.image ? `<meta property="og:image" content="${escapeHtml(newsItem.image)}" />` : ''}
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${newsItem.image ? `<meta name="twitter:image" content="${escapeHtml(newsItem.image)}" />` : ''}
    <link rel="canonical" href="${escapeHtml(`https://studyguruindia.com/news/${newsItem.slug}`)}" />
    
    <!-- Structured data for better SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${escapeHtml(newsItem.title)}",
      "description": "${escapeHtml(newsItem.summary)}",
      "image": "${newsItem.image ? escapeHtml(newsItem.image) : ''}",
      "datePublished": "${newsItem.publishDate}",
      "dateModified": "${newsItem.publishDate}",
      "publisher": {
        "@type": "Organization",
        "name": "Study Guru",
        "logo": {
          "@type": "ImageObject",
          "url": "https://studyguruindia.com/logo.png"
        }
      },
      "author": {
        "@type": "Organization",
        "name": "Study Guru Editorial Team"
      },
      "keywords": "${escapeHtml(keywords)}",
      "articleSection": "${escapeHtml(newsItem.category)}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${escapeHtml(`https://studyguruindia.com/news/${newsItem.slug}`)}"
      }
    }
    </script>
    `;
    
    // Inject SEO metadata into the HTML head
    html = html.replace('</head>', `${seoMetadata}\n</head>`);
    
    // Log success for debugging
    console.log(`[SEO] Serving news '${newsItem.title}' with server-side SEO metadata`);
    
    // Serve the HTML with injected SEO metadata
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error serving news page with SEO:', error);
    // Fallback to regular HTML file
    res.sendFile(indexHtmlPath);
  }
});

export default router;