const API_ORIGIN =
  process.env.REACT_APP_API_ORIGIN || "https://ministry-new.onrender.com";

const GOOGLE_DRIVE_FILE_PATTERN = /drive\.google\.com\/file\/d\/([^/]+)/i;

export const normalizeImageUrl = (value) => {
  const raw = (value || "").trim();
  if (!raw) return "";

  const driveMatch = raw.match(GOOGLE_DRIVE_FILE_PATTERN);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  if (raw.startsWith("//")) return `https:${raw}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return `${API_ORIGIN}${raw}`;

  return `${API_ORIGIN}/${raw.replace(/^\.?\//, "")}`;
};

