const mongoose = require("mongoose");

const UserSubmissionSchema = new mongoose.Schema({
  title: String,
  content: String,
  location: String,
  name: String,
  authorName: String,
  authorEmail: String
}, { timestamps: true });

module.exports = mongoose.model("UserSubmission", UserSubmissionSchema);
