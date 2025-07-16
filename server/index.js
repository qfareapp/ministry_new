const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");                  // 🔄 for serving React build
const axios = require("axios");                // 🔄 to fetch article data
require("dotenv").config();

const app = express();

function escapeHtml(text = '') {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ✅ CORS Setup
const allowedOrigins = [
  "https://ministry-new.vercel.app",
  "http://localhost:3000",
  "https://missd.in",
  "https://www.missd.in"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(compression());
app.use(helmet());

// ✅ Rendertron Bot Middleware
const botUserAgents = [
  'googlebot',
  'facebookexternalhit',
  'twitterbot',
  'WhatsApp',
  'linkedinbot',
  'slackbot'
];


// ✅ Routes
app.get("/", (req, res) => res.send("✅ API is running"));
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/auth");
const adminAuth = require("./routes/adminAuth");

app.use("/api", articleRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminAuth);

// ✅ Serve dynamic OG tags for bots visiting article pages
app.get('/article/:id', async (req, res, next) => {
  const userAgent = req.get('User-Agent')?.toLowerCase() || '';
  const isBot = botUserAgents.some(bot => userAgent.includes(bot.toLowerCase()));

  if (isBot) {
    try {
      const { id } = req.params;
      const { data: article } = await axios.get(`https://api.missd.in/api/articles/${id}`);

      return res.send(`
        <html>
          <head>
          <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="og:title" content="${escapeHtml(article.title)}" />
<meta property="og:description" content="${escapeHtml(article?.body?.slice(0, 140) || '')}" />
            <meta property="og:image" content="${article.imageUrl}" />
            <meta property="og:url" content="https://www.missd.in/article/${id}" />
            <meta property="og:type" content="article" />
            <script>window.location.replace("https://www.missd.in/article/${id}");</script>
          </head>
          <body></body>
        </html>
      `);
    } catch (err) {
      console.error("Error fetching article:", err.message);
      return res.redirect(`/article/${req.params.id}`); // fallback
    }
  } else {
    next(); // non-bot traffic continues to React app
  }
});

// ✅ Serve frontend build (CRA) after all API routes
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ministry", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch((err) => {
  console.error("❌ DB connection error:", err.message);
  process.exit(1);
});
