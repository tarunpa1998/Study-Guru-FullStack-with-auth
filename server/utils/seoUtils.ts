// Utility functions for server-side SEO rendering
import { mongoStorage } from "../mongoStorage";
import { Article, News } from "@shared/schema";

// Extended types to handle MongoDB additional fields
interface ArticleWithSeo extends Article {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[] | string;
  };
  authorTitle?: string;
}

interface NewsWithSeo extends News {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[] | string;
  };
}

// Helper function to safely escape text for HTML
const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Function to generate meta tags for article pages
export async function generateArticleMetaTags(slug: string): Promise<string> {
  try {
    // Fetch article from MongoDB
    const article = await mongoStorage.getArticleBySlug(slug) as ArticleWithSeo;
    
    if (!article) {
      return ''; // No article found
    }
    
    // Handle the SEO data safely
    const title = escapeHTML(article.seo?.metaTitle || `${article.title} | Study Guru`);
    const description = escapeHTML(article.seo?.metaDescription || article.summary);
    const keywords = article.seo?.keywords ? 
      (Array.isArray(article.seo.keywords) ? article.seo.keywords.join(', ') : article.seo.keywords) : 
      article.category;
    
    // Generate meta tags
    const metaTags = `
    <!-- Server-rendered SEO meta tags -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://studyguruindia.com/articles/${article.slug}" />
    ${article.image ? `<meta property="og:image" content="${article.image}" />` : ''}
    <meta name="keywords" content="${escapeHTML(keywords)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${article.image ? `<meta name="twitter:image" content="${article.image}" />` : ''}
    <link rel="canonical" href="https://studyguruindia.com/articles/${article.slug}" />
    
    <!-- Add structured data for better SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${escapeHTML(article.title)}",
      "description": "${escapeHTML(article.summary)}",
      "image": "${article.image || ''}",
      "author": {
        "@type": "Person",
        "name": "${escapeHTML(article.author)}",
        "jobTitle": "${escapeHTML(article.authorTitle || 'Education Consultant')}"
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
      "keywords": "${escapeHTML(keywords)}",
      "articleSection": "${escapeHTML(article.category)}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://studyguruindia.com/articles/${article.slug}"
      }
    }
    </script>
    `;
    
    return metaTags;
  } catch (error) {
    console.error('Error generating article meta tags:', error);
    return '';
  }
}

// Function to generate meta tags for news pages
export async function generateNewsMetaTags(slug: string): Promise<string> {
  try {
    // Fetch news from MongoDB
    const newsItem = await mongoStorage.getNewsBySlug(slug) as NewsWithSeo;
    
    if (!newsItem) {
      return ''; // No news found
    }
    
    // Handle the SEO data safely
    const title = escapeHTML(newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`);
    const description = escapeHTML(newsItem.seo?.metaDescription || newsItem.summary);
    const keywords = newsItem.seo?.keywords ? 
      (Array.isArray(newsItem.seo.keywords) ? newsItem.seo.keywords.join(', ') : newsItem.seo.keywords) : 
      newsItem.category;
    
    // Generate meta tags
    const metaTags = `
    <!-- Server-rendered SEO meta tags -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://studyguruindia.com/news/${newsItem.slug}" />
    ${newsItem.image ? `<meta property="og:image" content="${newsItem.image}" />` : ''}
    <meta name="keywords" content="${escapeHTML(keywords)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${newsItem.image ? `<meta name="twitter:image" content="${newsItem.image}" />` : ''}
    <link rel="canonical" href="https://studyguruindia.com/news/${newsItem.slug}" />
    
    <!-- Add structured data for better SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${escapeHTML(newsItem.title)}",
      "description": "${escapeHTML(newsItem.summary)}",
      "image": "${newsItem.image || ''}",
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
      "keywords": "${escapeHTML(keywords)}",
      "articleSection": "${escapeHTML(newsItem.category)}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://studyguruindia.com/news/${newsItem.slug}"
      }
    }
    </script>
    `;
    
    return metaTags;
  } catch (error) {
    console.error('Error generating news meta tags:', error);
    return '';
  }
}

// Function to determine if a URL is for an article or news page and inject relevant meta tags
export async function injectSeoMetaTags(url: string, html: string): Promise<string> {
  try {
    // Extract the slug from URL
    const articleMatch = url.match(/\/articles\/([^\/\?]+)/);
    const newsMatch = url.match(/\/news\/([^\/\?]+)/);
    
    let metaTags = '';
    
    if (articleMatch && articleMatch[1]) {
      // This is an article page
      const slug = articleMatch[1];
      metaTags = await generateArticleMetaTags(slug);
    } else if (newsMatch && newsMatch[1]) {
      // This is a news page
      const slug = newsMatch[1];
      metaTags = await generateNewsMetaTags(slug);
    }
    
    if (metaTags) {
      // Inject meta tags into the HTML
      return html.replace('</head>', `${metaTags}\n</head>`);
    }
    
    return html;
  } catch (error) {
    console.error('Error injecting SEO meta tags:', error);
    return html;
  }
}