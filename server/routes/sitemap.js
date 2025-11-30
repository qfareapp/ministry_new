const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

const BASE_URL = process.env.SITE_URL || "https://www.missd.in";

const xmlEscape = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatDate = (value) => new Date(value || Date.now()).toISOString();

const sendXml = (res, body) => {
  res.setHeader("Content-Type", "application/xml; charset=UTF-8");
  res.send(body.trim());
};

const sitemapIndex = (req, res) => {
  const lastmod = formatDate();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/main-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/news-sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
  sendXml(res, body);
};

router.get("/sitemap.xml", sitemapIndex);
router.head("/sitemap.xml", sitemapIndex);

const mainSitemap = async (req, res) => {
  try {
    const pages = [
      `${BASE_URL}/`,
      `${BASE_URL}/about`,
      `${BASE_URL}/policy`,
      `${BASE_URL}/submit`,
    ];

    const articles = await Article.find({ status: "Approved" })
      .sort({ date: -1 })
      .select(["_id", "date", "updatedAt"]);

    const urls = [
      ...pages.map(
        (loc) => `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
      ),
      ...articles.map((article) => {
        const loc = `${BASE_URL}/article/${article._id}`;
        const lastmod = formatDate(article.updatedAt || article.date);
        return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
      }),
    ].join("");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    sendXml(res, body);
  } catch (err) {
    console.error("Main sitemap error:", err);
    res.status(500).send("Error generating sitemap");
  }
};

router.get("/main-sitemap.xml", mainSitemap);
router.head("/main-sitemap.xml", mainSitemap);

const newsSitemap = async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const articles = await Article.find({
      status: "Approved",
      date: { $gte: twoDaysAgo },
    })
      .sort({ date: -1 })
      .limit(1000);

    const items = articles
      .map((article) => {
        const loc = `${BASE_URL}/article/${article._id}`;
        const pubDate = formatDate(article.date);
        return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>Ministry of Missed Opportunities</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${xmlEscape(article.title || "News article")}</news:title>
    </news:news>
  </url>`;
      })
      .join("");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

    sendXml(res, body);
  } catch (err) {
    console.error("News sitemap error:", err);
    res.status(500).send("Error generating news sitemap");
  }
};

router.get("/news-sitemap.xml", newsSitemap);
router.head("/news-sitemap.xml", newsSitemap);

module.exports = router;
