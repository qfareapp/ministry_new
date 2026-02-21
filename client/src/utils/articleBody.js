const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sanitizeHtml = (value = "") => {
  let safe = String(value);

  safe = safe.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  safe = safe.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  safe = safe.replace(/<(iframe|object|embed|link|meta)[^>]*>/gi, "");
  safe = safe.replace(/\son\w+="[^"]*"/gi, "");
  safe = safe.replace(/\son\w+='[^']*'/gi, "");
  safe = safe.replace(/\son\w+=\S+/gi, "");
  safe = safe.replace(/javascript:/gi, "");

  return safe;
};

export const formatArticleBodyHtml = (raw = "") => {
  const body = String(raw || "");
  if (!body.trim()) return "";

  const hasTags = /<[^>]+>/.test(body);
  if (hasTags) return sanitizeHtml(body);

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br />")}</p>`);

  return paragraphs.join("");
};

