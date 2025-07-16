const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");                  // For serving React build
const axios = require("axios");                // To fetch article data
require("dotenv").config();

const app = express();

// ✅ Utility to escape HTML
function escapeHtml(text = '') {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ✅ CORS Setup (should be at the top)
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
  'whatsapp',
  'linkedinbot',
  'slackbot'
];

app.get("/", (req, res) => res.send("✅ API is running"));

// ✅ Import route handlers
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/auth");
const adminAuthRoutes = require("./routes/adminAuth");

// ✅ Register routes
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);

// ✅ Serve dynamic OG tags for bots visiting article pages
app.get('/article/:id', async (req, res, next) => {
  const userAgent = req.get('User-Agent')?.toLowerCase() || '';
  const isBot = botUserAgents.some(bot => userAgent.includes(bot.toLowerCase()));

  if (isBot) {
    try {
      const { id } = req.params;
      const { data: article } = await axios.get(`https://ministry-new.onrender.com/api/articles/${id}`);

      const title = escapeHtml(article?.title || "Read the latest article on missd.in");
      const description = escapeHtml(article?.body?.slice(0, 140) || "A new voice from the Ministry of Missed Opportunities.");
      const image = article?.imageUrl || "https://www.missd.in/assets/default-og.jpg";
      const url = `https://www.missd.in/article/${id}`;

      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>

            <!-- ✅ Open Graph -->
            <meta property="og:type" content="article" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:url" content="${url}" />
            <meta property="og:site_name" content="Ministry of Missed Opportunities" />

            <!-- ✅ Twitter Card -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${image}" />
            <meta name="twitter:url" content="${url}" />

            <!-- ✅ Redirect to client-side React route -->
            <script>window.location.replace("${url}");</script>
          </head>
          <body></body>
        </html>
      `);
    } catch (err) {
      console.error("❌ Error fetching article:", err.message);
      return res.redirect(`https://www.missd.in/article/${req.params.id}`);
    }
  } else {
    next(); // non-bot traffic continues to React app
  }
});

// ✅ Serve frontend React build
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ✅ DEBUG: Print all registered routes
console.log("🔍 Listing registered routes:");
app._router.stack.forEach((middleware) => {
  if (middleware.route && middleware.route.path) {
    try {
      const method = middleware.route.stack[0].method.toUpperCase();
      const path = middleware.route.path;
      console.log("📍", method, path);
    } catch (e) {
      console.warn("⚠️ Skipping malformed route:", middleware.route);
    }
  } else if (middleware.name === 'router' && middleware.handle.stack) {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route && handler.route.path) {
        try {
          const method = handler.route.stack[0].method.toUpperCase();
          const path = handler.route.path;
          console.log("📍", method, path);
        } catch (e) {
          console.warn("⚠️ Skipping malformed nested route:", handler.route);
        }
      }
    });
  }
});

// ✅ Fallback route for missing APIs
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not Found" });
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
