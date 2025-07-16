const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const UserSubmission = require("../models/UserSubmission");

// ✅ GET all approved articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET a specific approved article
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /api/articles – for admin manual publish
// ✅ POST /api/articles – for admin manual publish with hero logic
router.post("/", async (req, res) => {
  try {
    const { isHero, isFeatured, ...rest } = req.body;

// ✅ Unset previous hero if needed
if (isHero) {
  await Article.updateMany({ isHero: true }, { $set: { isHero: false } });
}

// ✅ Unset previous featured if needed
if (isFeatured) {
  await Article.updateMany({ isFeatured: true }, { $set: { isFeatured: false } });
}

const newArticle = new Article({ ...rest, isHero: !!isHero, isFeatured: !!isFeatured });
await newArticle.save();
res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ POST /api/submit-article – for user submissions (stored separately)
router.post("/submit-article", async (req, res) => {
  try {
    const newSubmission = new UserSubmission(req.body);
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET /api/admin/submitted-articles – for admin panel
router.get("/admin/submitted-articles", async (req, res) => {
  try {
    const submissions = await UserSubmission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PATCH article by ID (for editing published content)
router.patch("/:id", async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ✅ GET /api/admin/user-submissions/:id – fetch one pending submission
router.get("/admin/user-submissions/:id", async (req, res) => {
  try {
    const submission = await UserSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ PATCH /api/admin/user-submissions/:id – update pending submission
router.patch("/admin/user-submissions/:id", async (req, res) => {
  try {
    const updated = await UserSubmission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Submission not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ✅ POST /api/articles/:id/like – only allow 1 like per user
router.post("/:id/like", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // ✅ Initialize likedBy array if missing
    article.likedBy = article.likedBy || [];

    // ✅ Check if the user already liked
    if (article.likedBy.includes(userId)) {
      return res.status(400).json({ error: "User already liked" });
    }

    article.likes = (article.likes || 0) + 1;
    article.likedBy.push(userId);

    await article.save();

    res.json({ likes: article.likes });
  } catch (err) {
    console.error("Error in like route:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST /api/articles/:id/share – increment share count
router.post("/:id/share", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    article.shares = (article.shares || 0) + 1;
    await article.save();

    res.json({ shares: article.shares });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/articles/:id/comments – fetch comments
router.get("/:id/comments", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    res.json(article.comments || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /api/articles/:id/comment – add new comment
router.post("/:id/comment", async (req, res) => {
  try {
    const { userId, userName, text } = req.body;
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });

    const newComment = { userId, userName, text };
    article.comments = [...(article.comments || []), newComment];
    await article.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ✅ DELETE /api/articles/:id – Delete an article by ID (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error("Error deleting article:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
