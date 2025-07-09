const express = require("express");
const router = express.Router();

// Simple login route (mocked authentication)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 🛡️ Replace this with real DB/user check in future
  if (username === "admin" && password === "admin123") {
    return res.json({
      name: "admin",
      isAdmin: true,
      token: "mock-token-123", // optional
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

module.exports = router;
