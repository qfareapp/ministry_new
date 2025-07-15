import React from "react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article, user, onDelete }) => {
  const navigate = useNavigate();

  const isAdmin = user?.isAdmin || false;

  return (
    <div className="flex justify-between items-start p-4 border rounded hover:shadow transition w-full">
      {/* Left Side - Text Content */}
      <div className="flex-1 pr-4">
        <p className="text-xs uppercase text-red-600 font-bold mb-1">
          {article.category || "General"}
        </p>

        <h2 className="text-lg font-bold text-gray-900 hover:text-red-600 leading-snug">
          <a
            href={`/article/${article._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {article.title}
          </a>
        </h2>

        <p className="text-sm text-gray-600 mt-1">
          {article.body?.slice(0, 120)}...
        </p>

         <div className="mt-3 flex gap-6 text-sm text-gray-600">
          <span>👍 {article.likes || 0}</span>
          <span>💬 {article.comments?.length || 0}</span>
          <span>🔗 {article.shares || 0}</span>
          {isAdmin && (
  <>
    <button
      onClick={() => navigate(`/admin/edit/${article._id}`)}
      className="hover:text-blue-600 ml-auto"
    >
      ✏️ Edit
    </button>

    <button
      onClick={async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this article?");
        if (!confirmDelete) return;

        try {
          const res = await fetch(`https://ministry-new.onrender.com/api/articles/${article._id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            alert("🗑️ Article deleted");
            onDelete?.(article._id); // ✅ Tell parent to refresh list or remove it from UI
          } else {
            const error = await res.text(); // ⛔ Get error response body
            throw new Error(`Failed to delete article: ${error}`);
          }
        } catch (err) {
          console.error("Delete failed", err);
          alert("Failed to delete article.");
        }
      }}
      className="hover:text-red-600"
    >
      🗑️ Delete
    </button>
  </>
)}

        </div>
      {/* Image for Mobile (Shown below text) */}
        <div className="block md:hidden mt-4">
          <img
            src={article.imageUrl || "https://placehold.co/600x400?text=No+Image"}
            alt={article.title}
            className="w-full h-auto rounded object-cover"
          />
        </div>
      </div>

      {/* Image for Desktop (Shown on the right) */}
      <div className="hidden md:block">
        <img
          src={article.imageUrl || "https://placehold.co/100x100?text=No+Image"}
          alt={article.title}
          className="w-[100px] h-[100px] object-cover rounded"
        />
      </div>
    </div>
  );
};

export default ArticleCard;
