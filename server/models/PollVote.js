const mongoose = require("mongoose");

const POLL_OPTIONS = ["BJP", "TMC", "CPI(M)", "INC"];

const PollVoteSchema = new mongoose.Schema(
  {
    pollKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    choice: {
      type: String,
      enum: POLL_OPTIONS,
      required: true,
    },
    fingerprintHash: {
      type: String,
      required: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: "",
      trim: true,
    },
    userAgent: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      city: {
        type: String,
        default: "",
        trim: true,
      },
      region: {
        type: String,
        default: "",
        trim: true,
      },
      country: {
        type: String,
        default: "",
        trim: true,
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      source: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  { timestamps: true }
);

PollVoteSchema.index({ pollKey: 1, fingerprintHash: 1 }, { unique: true });

module.exports = {
  PollVote: mongoose.model("PollVote", PollVoteSchema),
  POLL_OPTIONS,
};
