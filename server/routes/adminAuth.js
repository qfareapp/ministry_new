const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'your_secret_key'; // use env file in production
const UserSubmission = require('../models/UserSubmission');
const Article = require('../models/Article');
const { buildUniqueSlug } = require("../utils/slug");

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Login request:", { email, password }); // 👈 Log request

  try {
    const admin = await Admin.findOne({ email });
    console.log("🔍 Admin found:", admin); // 👈 Log if admin found

    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(401).json({ msg: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔐 Password match:", isMatch); // 👈 Log password match result

    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: '1d' });
    console.log("✅ Token generated");
    res.json({ token, email: admin.email });
  } catch (err) {
    console.error("💥 Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// ✅ Get all submitted articles (pending review)
router.get('/submitted-articles', async (req, res) => {
  try {
    const submissions = await UserSubmission.find(); // You can add filters if needed
    res.json(submissions);
  } catch (err) {
    console.error("❌ Error fetching submissions:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ✅ ✅ NEW SECTION ADDED ↓↓↓
/**
 * Approve an article: Move from UserSubmission to Article model, then delete original
 */
router.patch('/approve-article/:id', async (req, res) => {
  try {
    const submission = await UserSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ msg: 'Submission not found' });
    const slug = await buildUniqueSlug(Article, submission.title || "article");

    // Create new published article
    const newArticle = new Article({
      title: submission.title,
      body: submission.content || submission.body || "",
      authorName: submission.authorName,
      location: submission.location,
      authorEmail: submission.authorEmail,
      slug,
      date: new Date() // optional
    });
    await newArticle.save();

    // Delete from submissions
    await UserSubmission.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Article approved and published' });
  } catch (err) {
    console.error("❌ Approval error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Reject an article: Delete from UserSubmission
 */
router.delete('/reject-article/:id', async (req, res) => {
  try {
    await UserSubmission.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Submission rejected and deleted' });
  } catch (err) {
    console.error("❌ Rejection error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// ✅ ✅ ✅ END OF NEW SECTION

// ✅ ✅ ✅ NEW SECTION ADDED ↓↓↓
// Get a specific user submission by ID
router.get('/user-submissions/:id', async (req, res) => {
  try {
    const submission = await UserSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ msg: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    console.error("❌ Error fetching submission by ID:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update a specific user submission by ID
router.patch('/user-submissions/:id', async (req, res) => {
  try {
    const updated = await UserSubmission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Submission not found' });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating submission:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// ✅ ✅ ✅ END OF NEW SECTION


// Optional: Register Admin (one-time)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Admin already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ msg: 'Admin created' });
  } catch (err) {
    console.error("💥 Registration error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
