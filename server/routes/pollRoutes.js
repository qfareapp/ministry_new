const express = require("express");
const axios = require("axios");
const { PollVote, POLL_OPTIONS } = require("../models/PollVote");

const router = express.Router();

const HOMEPAGE_POLL_KEY = "homepage-party-poll-v1";

const buildTrendBuckets = (votes) => {
  const sortedVotes = [...votes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  if (sortedVotes.length === 0) {
    return [];
  }

  const bucketCount = Math.min(12, sortedVotes.length);
  const bucketSize = Math.max(1, Math.ceil(sortedVotes.length / bucketCount));
  const runningCounts = POLL_OPTIONS.reduce((acc, option) => {
    acc[option] = 0;
    return acc;
  }, {});

  const trend = [];

  for (let index = 0; index < sortedVotes.length; index += bucketSize) {
    const slice = sortedVotes.slice(index, index + bucketSize);

    slice.forEach((vote) => {
      runningCounts[vote.choice] += 1;
    });

    const lastVote = slice[slice.length - 1];
    trend.push({
      label: new Date(lastVote.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      timestamp: lastVote.createdAt,
      counts: { ...runningCounts },
    });
  }

  return trend;
};

const buildResults = async () => {
  const votes = await PollVote.aggregate([
    { $match: { pollKey: HOMEPAGE_POLL_KEY } },
    { $group: { _id: "$choice", count: { $sum: 1 } } },
  ]);
  const rawVotes = await PollVote.find(
    { pollKey: HOMEPAGE_POLL_KEY },
    { choice: 1, createdAt: 1, _id: 0 }
  ).lean();

  const counts = POLL_OPTIONS.reduce((acc, option) => {
    acc[option] = 0;
    return acc;
  }, {});

  votes.forEach(({ _id, count }) => {
    counts[_id] = count;
  });

  const totalVotes = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return {
    pollKey: HOMEPAGE_POLL_KEY,
    options: POLL_OPTIONS,
    counts,
    totalVotes,
    trend: buildTrendBuckets(rawVotes),
  };
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "";
};

const normalizeIp = (ipAddress) => {
  const value = String(ipAddress || "").trim();
  if (!value) {
    return "";
  }

  return value.startsWith("::ffff:") ? value.slice(7) : value;
};

const isLocalIp = (ipAddress) => {
  const value = normalizeIp(ipAddress);
  return (
    !value ||
    value === "::1" ||
    value === "127.0.0.1" ||
    value.startsWith("10.") ||
    value.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(value)
  );
};

const lookupApproximateLocation = async (ipAddress) => {
  const normalizedIp = normalizeIp(ipAddress);
  if (isLocalIp(normalizedIp)) {
    return null;
  }

  try {
    const response = await axios.get(`https://ipwho.is/${normalizedIp}`, {
      timeout: 5000,
    });
    const data = response.data;

    if (!data?.success) {
      return null;
    }

    return {
      city: data.city || "",
      region: data.region || "",
      country: data.country || "",
      latitude:
        typeof data.latitude === "number"
          ? Number(data.latitude.toFixed(2))
          : null,
      longitude:
        typeof data.longitude === "number"
          ? Number(data.longitude.toFixed(2))
          : null,
      source: "ipwho.is",
    };
  } catch (error) {
    return null;
  }
};

router.get("/homepage", async (req, res) => {
  try {
    const results = await buildResults();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to load poll results." });
  }
});

router.post("/homepage/vote", async (req, res) => {
  try {
    const choice = String(req.body?.choice || "").trim();
    const fingerprintHash = String(req.body?.fingerprintHash || "").trim();

    if (!POLL_OPTIONS.includes(choice)) {
      return res.status(400).json({ error: "Invalid poll option." });
    }

    if (!fingerprintHash) {
      return res.status(400).json({ error: "Missing device fingerprint." });
    }

    const existingVote = await PollVote.findOne({
      pollKey: HOMEPAGE_POLL_KEY,
      fingerprintHash,
    }).lean();

    if (existingVote) {
      const results = await buildResults();
      return res.status(409).json({
        error: "This device has already voted in this poll.",
        existingChoice: existingVote.choice,
        ...results,
      });
    }

    const ipAddress = getClientIp(req);
    const location = await lookupApproximateLocation(ipAddress);

    await PollVote.create({
      pollKey: HOMEPAGE_POLL_KEY,
      choice,
      fingerprintHash,
      ipAddress,
      userAgent: req.get("user-agent") || "",
      location: location || undefined,
    });

    const results = await buildResults();
    return res.status(201).json({
      message: "Vote recorded.",
      ...results,
    });
  } catch (error) {
    if (error?.code === 11000) {
      const existingVote = await PollVote.findOne({
        pollKey: HOMEPAGE_POLL_KEY,
        fingerprintHash: String(req.body?.fingerprintHash || "").trim(),
      }).lean();
      const results = await buildResults();

      return res.status(409).json({
        error: "This device has already voted in this poll.",
        existingChoice: existingVote?.choice,
        ...results,
      });
    }

    return res.status(500).json({ error: "Failed to save vote." });
  }
});

module.exports = router;
