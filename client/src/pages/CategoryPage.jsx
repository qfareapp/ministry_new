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
        const res = await axios.get("http://localhost:5000/api/articles");

        const filtered = res.data.filter(
          (article) =>
            article.category?.toLowerCase().trim() ===
            categoryName.toLowerCase().trim()
        );

        setArticles(filtered);

        if (filtered.length > 3) {
          const shuffled = [...filtered].sort(() => 0.5 - Math.random());
          setRelatedArticles(shuffled.slice(0, 3));
        } else {
          setRelatedArticles([]);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchByCategory();
  }, [categoryName]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-red-700">🗂️ {categoryName}</h2>

      {articles.length === 0 ? (
        <div className="text-center mt-10 text-gray-600">
          <p className="italic text-lg mb-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {relatedArticles.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">📌 You May Also Like</h3>
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
