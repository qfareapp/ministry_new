import React from "react";
import { Link } from "react-router-dom";

const stripHtml = (value) => value?.replace(/<[^>]+>/g, "") || "";

const FeaturedArticleSection = ({ article }) => {
  if (!article) return null;

  const description =
    article.description ||
    stripHtml(article.body).slice(0, 160) ||
    "A featured story selected for you.";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-5 space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase text-red-700">
          Featured
        </span>
        <Link
          to={`/article/${article._id}`}
          target="_blank"
          className="block text-xl font-bold leading-tight text-slate-900 transition hover:text-red-600"
        >
          {article.title}
        </Link>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
      <div className="px-5 pb-5">
        <div className="overflow-hidden rounded-xl bg-gray-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-52 w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/600x300?text=Image+Unavailable";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticleSection;
