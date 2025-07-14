const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// ✅ CORS Setup
const allowedOrigins = [
  "https://ministry-new.vercel.app",
  "http://localhost:3000"
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
app.get("/", (req, res) => res.send("✅ API is running"));

const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/auth");
const adminAuth = require("./routes/adminAuth");

app.use("/api", articleRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminAuth);

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
