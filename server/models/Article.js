const mongoose = require("mongoose");
// ✅ Define commentSchema first
const commentSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  text: String,
  date: { type: Date, default: Date.now },
});
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true }, // renamed from `body` to `content` for clarity
  authorName: { type: String, default: "Anonymous" },
  authorEmail: { type: String, default: "" },
  location: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  category: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  isHero: { type: Boolean, default: false },
  isHighlight: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  shares: { type: Number, default: 0 },
  comments: [commentSchema],
});

module.exports = mongoose.model("Article", articleSchema);
