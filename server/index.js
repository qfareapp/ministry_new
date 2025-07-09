const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const allowedOrigins = ["https://ministry-new.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Mount the article routes
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/auth");
const adminAuth = require('./routes/adminAuth');
app.use("/api", articleRoutes);
app.use("/api", authRoutes);
app.use('/api/admin', adminAuth);
// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ministry", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
