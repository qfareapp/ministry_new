import React from "react";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../utils/image";
import { getArticlePath } from "../utils/article";

const stripHtml = (value) => value?.replace(/<[^>]+>/g, "") || "";

const FullImageArticleCard = ({ article, user, onDelete }) => {
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin || false;

  const rawImage = article.imageUrl || article.image;
  const imageSrc =
    normalizeImageUrl(rawImage) || "https://placehold.co/1200x700?text=No+Image";
  const snippet = stripHtml(article.body || "").slice(0, 180);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <button
        onClick={() => navigate(getArticlePath(article))}
        className="mb-3 text-left text-3xl font-bold leading-tight text-slate-900 hover:text-red-600"
      >
        {article.title}
      </button>

      <p className="mb-4 text-base text-gray-700 leading-relaxed">
        {snippet || "No description available for this story yet."}
      </p>

      <button
        onClick={() => navigate(getArticlePath(article))}
        className="mb-4 block w-full overflow-hidden rounded-lg"
      >
        <img
          src={imageSrc}
          alt={article.title}
          className="h-auto w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/1200x700?text=Image+Unavailable";
          }}
        />
      </button>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
  );
};

export default FullImageArticleCard;

