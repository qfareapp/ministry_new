const express = require("express");
const router = express.Router();
const Article = require("../models/Article"); // adjust path to your model

router.get("/rss.xml", async (req, res) => {
  try {
    const articles = await Article.find({ status: "Approved" })
      .sort({ date: -1 })
      .limit(20);

    const items = articles.map(article => `
      <item>
        <title>${article.title}</title>
        <link>https://www.missd.in/article/${article._id}</link>
        <guid>https://www.missd.in/article/${article._id}</guid>
        <pubDate>${new Date(article.date).toUTCString()}</pubDate>
        <description><![CDATA[${article.body.slice(0, 200)}...]]></description>
      </item>
    `).join("");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Ministry of Missed Opportunities</title>
    <link>https://www.missd.in</link>
    <description>Ideas that should’ve been reality. Policies that could’ve changed lives.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

    res.set("Content-Type", "application/xml");
    res.send(rssFeed);
  } catch (err) {
    console.error("RSS generation error:", err);
    res.status(500).send("Error generating RSS feed");
  }
});

module.exports = router;
