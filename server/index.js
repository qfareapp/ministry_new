const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ Prerender.io middleware (only for article preview)
const prerender = require("prerender-node");
app.use(
  "/article/:id",
  prerender
    .set("prerenderToken", process.env.PRERENDER_TOKEN)
    .set("protocol", "https")
    .set("prerenderServiceUrl", "https://service.prerender.io/")
);

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

// ✅ Routes
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/auth");
const adminAuthRoutes = require("./routes/adminAuth");

app.get("/", (req, res) => res.send("✅ API is running"));

app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);

// ✅ Serve React frontend (build)
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ✅ 404 for unknown API routes (should come last)
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});



// ✅ Connect MongoDB
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
