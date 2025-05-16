// Utility functions for server-side SEO rendering
import { mongoStorage } from "../mongoStorage";

// Function to generate meta tags for article pages
export async function generateArticleMetaTags(slug: string): Promise<string> {
  try {
    // Fetch article from MongoDB
    const article = await mongoStorage.getArticleBySlug(slug);
    
    if (!article) {
      return ''; // No article found
    }
    
    // Generate meta tags
    const metaTags = `
    <!-- Server-rendered SEO meta tags -->
    <title>${article.seo?.metaTitle || `${article.title} | Study Guru`}</title>
    <meta name="description" content="${article.seo?.metaDescription || article.summary}" />
    <meta property="og:title" content="${article.seo?.metaTitle || `${article.title} | Study Guru`}" />
    <meta property="og:description" content="${article.seo?.metaDescription || article.summary}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://studyguruindia.com/articles/${article.slug}" />
    ${article.image ? `<meta property="og:image" content="${article.image}" />` : ''}
    ${article.seo?.keywords ? `<meta name="keywords" content="${Array.isArray(article.seo.keywords) ? article.seo.keywords.join(', ') : article.seo.keywords}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.seo?.metaTitle || article.title}" />
    <meta name="twitter:description" content="${article.seo?.metaDescription || article.summary}" />
    ${article.image ? `<meta name="twitter:image" content="${article.image}" />` : ''}
    <link rel="canonical" href="https://studyguruindia.com/articles/${article.slug}" />
    
    <!-- Add structured data for better SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${article.title}",
      "description": "${article.summary}",
      "image": "${article.image || ''}",
      "author": {
        "@type": "Person",
        "name": "${article.author}",
        "jobTitle": "${article.authorTitle || 'Education Consultant'}"
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
      "keywords": "${Array.isArray(article.seo?.keywords) ? article.seo.keywords.join(', ') : (article.category || 'study abroad')}",
      "articleSection": "${article.category}",
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
    const newsItem = await mongoStorage.getNewsBySlug(slug);
    
    if (!newsItem) {
      return ''; // No news found
    }
    
    // Generate meta tags
    const metaTags = `
    <!-- Server-rendered SEO meta tags -->
    <title>${newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`}</title>
    <meta name="description" content="${newsItem.seo?.metaDescription || newsItem.summary}" />
    <meta property="og:title" content="${newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`}" />
    <meta property="og:description" content="${newsItem.seo?.metaDescription || newsItem.summary}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://studyguruindia.com/news/${newsItem.slug}" />
    ${newsItem.image ? `<meta property="og:image" content="${newsItem.image}" />` : ''}
    ${newsItem.seo?.keywords ? `<meta name="keywords" content="${Array.isArray(newsItem.seo.keywords) ? newsItem.seo.keywords.join(', ') : newsItem.seo.keywords}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${newsItem.seo?.metaTitle || newsItem.title}" />
    <meta name="twitter:description" content="${newsItem.seo?.metaDescription || newsItem.summary}" />
    ${newsItem.image ? `<meta name="twitter:image" content="${newsItem.image}" />` : ''}
    <link rel="canonical" href="https://studyguruindia.com/news/${newsItem.slug}" />
    
    <!-- Add structured data for better SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${newsItem.title}",
      "description": "${newsItem.summary}",
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
      "keywords": "${Array.isArray(newsItem.seo?.keywords) ? newsItem.seo.keywords.join(', ') : (newsItem.category || 'Study Abroad News')}",
      "articleSection": "${newsItem.category}",
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