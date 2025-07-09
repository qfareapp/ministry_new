const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://localhost:27017/ministry")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

(async () => {
  try {
    const email = "admin@example.com";
    const password = "admin123";

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("⚠️ Admin already exists");
      return mongoose.disconnect();
    }

    const hashed = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashed });

    console.log("✅ Admin created successfully");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    mongoose.disconnect();
  }
})();
