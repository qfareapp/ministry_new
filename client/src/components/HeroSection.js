import React from "react";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../utils/image";

const stripHtml = (value) => value?.replace(/<[^>]+>/g, "") || "";

const formatDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) {
    return "Latest update";
  }
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const HeroSection = ({ article }) => {
  const navigate = useNavigate();
  if (!article) return null;

  const safeTitle = article.title || "Featured story";
  const trimmedTitle =
    safeTitle.length > 60 ? `${safeTitle.slice(0, 60)}...` : safeTitle;
  const description = stripHtml(article.body || article.description).slice(0, 220);
  const displayDate = formatDate(article.date || article.createdAt);
  const imageSrc =
    normalizeImageUrl(article.imageUrl) ||
    "https://via.placeholder.com/800x450?text=No+Image";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-red-700 to-amber-500 text-white shadow-xl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 bg-white/10 blur-3xl -left-10 -top-10" />
        <div className="absolute w-72 h-72 bg-amber-200/30 blur-3xl right-0 -bottom-12" />
      </div>

      <div className="relative grid items-center gap-8 lg:grid-cols-2 p-8 sm:p-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {article.category || "Top Story"}
            </span>
            <span className="text-sm text-white/80">{displayDate}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            {safeTitle}
          </h2>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed">
            {description || "A highlighted story picked for you today."}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/article/${article._id}`)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Read full article
              <span aria-hidden="true">{">"}</span>
            </button>
            <button
              onClick={() => navigate("/submit")}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Submit a story
            </button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-white/70">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              Featured
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              {article.category || "General"}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur">
            <img
              src={imageSrc}
              alt={safeTitle}
              className="h-full max-h-[420px] w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x450?text=Image+Unavailable";
              }}
            />
          </div>
          <div className="absolute -left-4 bottom-4 rounded-2xl bg-white text-slate-900 px-4 py-3 shadow-lg">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Top pick
            </p>
            <p className="text-sm font-bold leading-tight">{trimmedTitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
