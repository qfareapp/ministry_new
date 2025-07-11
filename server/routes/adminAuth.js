const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'your_secret_key'; // use env file in production

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
