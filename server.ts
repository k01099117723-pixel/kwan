import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api.js';
import { db } from './server/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic security and parsing middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Ensure uploads folder exists and serve it
  const uploadsPath = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Kwan Studio API',
      timestamp: new Date().toISOString()
    });
  });

  // Dynamic robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`);
  });

  // Dynamic sitemap.xml
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const host = `${req.protocol}://${req.get('host')}`;
      const posts = await db.getBlogPosts(true);

      const staticPages = [
        { url: `${host}/`, priority: '1.0', changefreq: 'weekly' },
        { url: `${host}/studio`, priority: '0.9', changefreq: 'monthly' },
        { url: `${host}/packs`, priority: '0.9', changefreq: 'weekly' },
        { url: `${host}/a-propos`, priority: '0.8', changefreq: 'monthly' },
        { url: `${host}/blog`, priority: '0.8', changefreq: 'weekly' },
        { url: `${host}/contact`, priority: '0.8', changefreq: 'monthly' }
      ];

      const blogPages = posts.map(p => ({
        url: `${host}/blog/${p.slug}`,
        priority: '0.7',
        changefreq: 'monthly'
      }));

      const allUrls = [...staticPages, ...blogPages];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    item => `  <url>
    <loc>${item.url}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

      res.type('application/xml');
      res.send(xml);
    } catch (err) {
      console.error('Error generating sitemap:', err);
      res.status(500).send('Error generating sitemap');
    }
  });

  // API router
  app.use('/api', apiRouter);

  // Vite integration: Dev middleware vs Static SPA in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KWAN STUDIO] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[KWAN STUDIO] Failed to start server:', err);
});
