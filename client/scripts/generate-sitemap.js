const fs = require("fs");
const path = require("path");
const axios = require("axios");

const SITE_URL = process.env.SITE_URL || "https://www.missd.in";
const API_BASE_URL =
  process.env.SITEMAP_API_URL ||
  process.env.REACT_APP_API_ORIGIN ||
  "https://ministry-new.onrender.com";

const xmlEscape = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatLastmod = (value) => {
  const d = new Date(value || Date.now());
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

async function generateSitemap() {
  try {
    const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/articles`;
    const res = await axios.get(endpoint, { timeout: 20000 });
    const articles = Array.isArray(res.data) ? res.data : [];

    let urls = `
  <url>
    <loc>${xmlEscape(SITE_URL)}</loc>
  </url>`;

    articles.forEach((article) => {
      const pathPart = article?.slug || article?._id;
      if (!pathPart) return;

      const loc = `${SITE_URL}/article/${pathPart}`;
      const lastmod = formatLastmod(article?.updatedAt || article?.date);

      urls += `
  <url>
    <loc>${xmlEscape(loc)}</loc>${
      lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
    }
  </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`;

    const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");
    fs.writeFileSync(outputPath, sitemap, "utf8");
    console.log(`Sitemap generated: ${outputPath}`);
  } catch (error) {
    console.error("Error generating sitemap:", error?.message || error);
    process.exitCode = 1;
  }
}

generateSitemap();

