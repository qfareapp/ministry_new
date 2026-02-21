require("dotenv").config();
const mongoose = require("mongoose");
const Article = require("../models/Article");
const { buildUniqueSlug } = require("../utils/slug");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ministry";

const run = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const articles = await Article.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
  }).sort({ createdAt: 1, _id: 1 });

  let updated = 0;
  for (const article of articles) {
    const slug = await buildUniqueSlug(Article, article.title || "article", article._id);
    article.slug = slug;
    await article.save();
    updated += 1;
  }

  console.log(`Backfill complete. Updated ${updated} article(s).`);
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Backfill failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});

