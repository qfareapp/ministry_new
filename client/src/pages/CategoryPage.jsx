import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
  const fetchByCategory = async () => {
    try {
      const res = await axios.get("https://ministry-new.onrender.com/api/articles");

      const allArticles = res.data;

      // Filter for the current category
      const filtered = allArticles.filter(
        (article) =>
          article.category?.toLowerCase().trim() ===
          categoryName.toLowerCase().trim()
      );

      setArticles(filtered);

      // Related articles from OTHER categories
      const others = allArticles.filter(
        (article) =>
          article.category?.toLowerCase().trim() !==
          categoryName.toLowerCase().trim()
      );

      const shuffled = [...others].sort(() => 0.5 - Math.random());
      setRelatedArticles(shuffled.slice(0, 3));
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  fetchByCategory();
}, [categoryName]);

  return (
    // ✅ UPDATED: Added responsive padding
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> 

      {/* ✅ UPDATED: Responsive heading size and alignment */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-red-700 text-center sm:text-left">
        🗂️ {categoryName}
      </h2>

      {articles.length === 0 ? (
        <div className="text-center mt-10 text-gray-600">
          {/* ✅ UPDATED: Responsive padding inside the message */}
          <p className="italic text-lg mb-4 px-2"> 
            💤 The Ministry is catching a nap in this category.<br />
            Go on, shake us up — we dare you.
          </p>
          <button
            onClick={() => navigate("/submit")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Wake the Ministry
          </button>
        </div>
      ) : (
        // ✅ ALREADY RESPONSIVE: 1 column (mobile), 2 (tablet), 3 (desktop)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12"> 
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {relatedArticles.length > 0 && (
        <>
          {/* ✅ UPDATED: Responsive heading size */}
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
            📌 You May Also Like
          </h3>

          {/* ✅ ALREADY RESPONSIVE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
