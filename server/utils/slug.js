const slugifyTitle = (value) => {
  const raw = (value || "").toString().trim().toLowerCase();
  const base = raw
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  return base || "article";
};

const buildUniqueSlug = async (Article, title, excludeId = null) => {
  const base = slugifyTitle(title);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await Article.exists(query);
    if (!exists) return candidate;

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
};

module.exports = {
  slugifyTitle,
  buildUniqueSlug,
};

