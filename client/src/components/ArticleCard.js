import React from "react";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../utils/image";
import { getArticlePath } from "../utils/article";

const stripHtml = (value) => value?.replace(/<[^>]+>/g, "") || "";

const ArticleCard = ({ article, user, onDelete }) => {
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin || false;

  const rawImage = article.imageUrl || article.image;
  const fullImageUrl =
    normalizeImageUrl(rawImage) || "https://placehold.co/640x400?text=No+Image";

  const snippet = stripHtml(article.body || "").slice(0, 180);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-red-600">
            {article.category || "General"}
          </p>

          <button
            onClick={() => navigate(getArticlePath(article))}
            className="mb-2 text-left text-2xl font-bold leading-tight text-slate-900 transition hover:text-red-600"
          >
            {article.title}
          </button>

          <p className="text-sm text-gray-700 leading-relaxed">
            {snippet || "No description available for this story yet."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>{article.comments?.length || 0} comments</span>
            <span>{article.likes || 0} likes</span>
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

        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-44">
          <img
            src={fullImageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/640x400?text=Image+Unavailable";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
