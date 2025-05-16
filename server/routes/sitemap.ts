import { Router, Request, Response } from 'express';
import { mongoStorage } from '../mongoStorage';

const router = Router();

/**
 * Generate XML sitemap for SEO optimization
 * @route GET /sitemap.xml
 */
router.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    // Get the base URL from request or environment variable, ensuring HTTPS
    const baseUrl = process.env.BASE_URL || `https://${req.get('host')}`;
    
    // Set Content-Type header
    res.header('Content-Type', 'application/xml');
    
    // Start XML content - ensure proper XML formatting with image namespace
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    // Logo URL - use the correct filename that exists in the public directory
    const logoUrl = `${baseUrl}/logo.png`;
    
    // Add static pages with logo
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: 'scholarships', priority: '0.9', changefreq: 'daily' },
      { path: 'articles', priority: '0.9', changefreq: 'daily' },
      { path: 'countries', priority: '0.9', changefreq: 'weekly' },
      { path: 'universities', priority: '0.9', changefreq: 'weekly' },
      { path: 'news', priority: '0.9', changefreq: 'daily' },
      { path: 'login', priority: '0.5', changefreq: 'monthly' },
      { path: 'register', priority: '0.5', changefreq: 'monthly' },
    ];
    
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${page.path}</loc>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += '    <image:image>\n';
      xml += `      <image:loc>${logoUrl}</image:loc>\n`;
      xml += '      <image:title>Study Guru Logo</image:title>\n';
      xml += '    </image:image>\n';
      xml += '  </url>\n';
    });
    
    // Fetch dynamic content from database
    const [
      scholarships,
      articles,
      countries,
      universities,
      news
    ] = await Promise.all([
      mongoStorage.getAllScholarships(),
      mongoStorage.getAllArticles(),
      mongoStorage.getAllCountries(),
      mongoStorage.getAllUniversities(),
      mongoStorage.getAllNews()
    ]);
    
    // Add scholarships with logo
    scholarships.forEach(scholarship => {
      const cleanSlug = scholarship.slug.replace(/["']/g, '');
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/scholarships/${cleanSlug}</loc>\n`;
      xml += '    <priority>0.8</priority>\n';
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <image:image>\n';
      xml += `      <image:loc>${logoUrl}</image:loc>\n`;
      xml += '      <image:title>Study Guru Logo</image:title>\n';
      xml += '    </image:image>\n';
      xml += '  </url>\n';
    });
    
    // Add articles with logo
    articles.forEach(article => {
      const cleanSlug = article.slug.replace(/["']/g, '');
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/articles/${cleanSlug}</loc>\n`;
      xml += '    <priority>0.8</priority>\n';
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <image:image>\n';
      xml += `      <image:loc>${logoUrl}</image:loc>\n`;
      xml += '      <image:title>Study Guru Logo</image:title>\n';
      xml += '    </image:image>\n';
      xml += '  </url>\n';
    });
    
    // Add countries with logo
    countries.forEach(country => {
      const cleanSlug = country.slug.replace(/["']/g, '');
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/countries/${cleanSlug}</loc>\n`;
      xml += '    <priority>0.7</priority>\n';
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <image:image>\n';
      xml += `      <image:loc>${logoUrl}</image:loc>\n`;
      xml += '      <image:title>Study Guru Logo</image:title>\n';
      xml += '    </image:image>\n';
      xml += '  </url>\n';
    });
    
    // Add universities with logo
    universities.forEach(university => {
      const cleanSlug = university.slug.replace(/["']/g, '');
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/universities/${cleanSlug}</loc>\n`;
      xml += '    <priority>0.7</priority>\n';
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <image:image>\n';
      xml += `      <image:loc>${logoUrl}</image:loc>\n`;
      xml += '      <image:title>Study Guru Logo</image:title>\n';
      xml += '    </image:image>\n';
      xml += '  </url>\n';
    });
    
    // Add news with logo
    news.forEach(newsItem => {
      const cleanSlug = newsItem.slug.replace(/["']/g, '');
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/news/${cleanSlug}</loc>\n`;
      xml += '    <priority>0.8</priority>\n';
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <image:image>\n';
      xml += `      <image:loc>${logoUrl}</image:loc>\n`;
      xml += '      <image:title>Study Guru Logo</image:title>\n';
      xml += '    </image:image>\n';
      xml += '  </url>\n';
    });
    
    // Close XML
    xml += '</urlset>';
    
    // Send response
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;










