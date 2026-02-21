const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// Prefer a configurable site URL for links; fall back to production host.
const BASE_URL = process.env.SITE_URL || "https://www.missd.in";

const stripHtml = (value) => (value || "").replace(/<[^>]*>/g, "");
const escapeXml = (value) =>
  (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

router.get("/rss.xml", async (req, res) => {
  try {
    const articles = await Article.find({ status: "Approved" })
      .sort({ date: -1 })
      .limit(20);

    const items = articles
      .map((article) => {
        const articlePath = article.slug || article._id;
        const link = `${BASE_URL}/article/${articlePath}`;
        const pubDate = new Date(article.date || article.createdAt || Date.now()).toUTCString();
        const summary = stripHtml(article.body).slice(0, 240);
        const description = `${summary}${summary.length === 240 ? "..." : ""}`;

        return `
      <item>
        <title>${escapeXml(article.title)}</title>
        <link>${escapeXml(link)}</link>
        <guid>${escapeXml(link)}</guid>
        <pubDate>${pubDate}</pubDate>
        <category>${escapeXml(article.category || "General")}</category>
        <description><![CDATA[${description}]]></description>
      </item>`;
      })
      .join("");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ministry of Missed Opportunities</title>
    <link>${BASE_URL}</link>
    <description>Ideas that should have been reality. Policies that could have changed lives.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

    res.set("Content-Type", "application/rss+xml; charset=UTF-8");
    res.send(rssFeed);
  } catch (err) {
    console.error("RSS generation error:", err);
    res.status(500).send("Error generating RSS feed");
  }
});

module.exports = router;
