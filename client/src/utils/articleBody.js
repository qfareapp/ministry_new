const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const decodeHtmlEntities = (value = "") =>
  String(value)
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/&amp;/gi, "&");

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

  const decodedBody = decodeHtmlEntities(body);
  const hasTags = /<[^>]+>/.test(decodedBody);
  if (hasTags) return sanitizeHtml(decodedBody);

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br />")}</p>`);

  return paragraphs.join("");
};
