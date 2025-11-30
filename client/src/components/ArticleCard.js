import React from "react";
import { useNavigate } from "react-router-dom";

const stripHtml = (value) => value?.replace(/<[^>]+>/g, "") || "";

const ArticleCard = ({ article, user, onDelete }) => {
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin || false;

  const rawImage = article.imageUrl || article.image;
  const fullImageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `https://ministry-new.onrender.com${rawImage}`
    : "https://placehold.co/640x400?text=No+Image";

  const snippet = stripHtml(article.body || "").slice(0, 160);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="grid gap-4 sm:grid-cols-5">
        <div className="relative sm:col-span-2">
          <img
            src={fullImageUrl}
            alt={article.title}
            className="w-full aspect-[4/5] rounded-2xl object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-red-600 shadow">
            {article.category || "General"}
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4 sm:col-span-3">
          <button
            onClick={() => navigate(`/article/${article._id}`)}
            className="text-left text-lg font-bold leading-tight text-slate-900 transition hover:text-red-600"
          >
            {article.title}
          </button>

          <p className="text-sm text-gray-700 leading-relaxed truncate-lines">
            {snippet || "No description available for this story yet."}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span>{article.likes || 0} likes</span>
            <span>{article.comments?.length || 0} comments</span>
            <span>{article.shares || 0} shares</span>

            {isAdmin && (
              <div className="ml-auto flex items-center gap-3 text-sm">
                <button
                  onClick={() => navigate(`/admin/edit/${article._id}`)}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this article?"
                    );
                    if (!confirmDelete) return;

                    try {
                      const res = await fetch(
                        `https://ministry-new.onrender.com/api/articles/${article._id}`,
                        {
                          method: "DELETE",
                        }
                      );

                      if (res.ok) {
                        alert("Article deleted");
                        onDelete?.(article._id);
                      } else {
                        const error = await res.text();
                        throw new Error(`Failed to delete article: ${error}`);
                      }
                    } catch (err) {
                      console.error("Delete failed", err);
                      alert("Failed to delete article.");
                    }
                  }}
                  className="font-semibold text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
