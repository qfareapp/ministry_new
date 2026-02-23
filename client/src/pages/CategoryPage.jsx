import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";
import FeaturedArticleSection from "../components/FeaturedArticleSection";
import { getArticlePath } from "../utils/article";
import { normalizeImageUrl } from "../utils/image";

const stripHtml = (value) => value?.replace(/<[^>]+>/g, "") || "";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        const res = await axios.get("https://ministry-new.onrender.com/api/articles");
        const all = Array.isArray(res.data) ? res.data : [];
        setAllArticles(all);

        const normalized = (categoryName || "").toLowerCase().trim();
        const filtered = all.filter(
          (article) => article.category?.toLowerCase().trim() === normalized
        );
        setArticles(filtered);

        const others = all.filter(
          (article) => article.category?.toLowerCase().trim() !== normalized
        );
        const shuffled = [...others].sort(() => 0.5 - Math.random());
        setRelatedArticles(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchByCategory();
  }, [categoryName]);

  const featuredArticle = useMemo(() => {
    return (
      articles.find((article) => article.isFeatured) ||
      allArticles.find((article) => article.isFeatured) ||
      null
    );
  }, [articles, allArticles]);

  const highlightArticles = useMemo(() => {
    const preferred = articles.filter((article) => article.isHighlight);
    if (preferred.length > 0) return preferred.slice(0, 4);
    return allArticles.filter((article) => article.isHighlight).slice(0, 4);
  }, [articles, allArticles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-red-700 text-center sm:text-left">
        {categoryName}
      </h2>

      <div className="grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          {articles.length === 0 ? (
            <div className="text-center mt-10 text-gray-600">
              <p className="italic text-lg mb-4 px-2">
                No stories found in this category yet.
              </p>
              <button
                onClick={() => navigate("/submit")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Submit a Story
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}

          {relatedArticles.length > 0 && (
            <div className="mt-10 max-w-3xl">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                You May Also Like
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="lg:col-span-4 space-y-4">
          {featuredArticle && <FeaturedArticleSection article={featuredArticle} />}

          {highlightArticles.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase font-semibold text-red-600 mb-3">
                Highlights
              </p>
              <div className="space-y-3">
                {highlightArticles.map((article) => (
                  <Link
                    key={article._id}
                    to={getArticlePath(article)}
                    className="block rounded-xl border border-gray-100 p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          normalizeImageUrl(article.imageUrl) ||
                          "https://placehold.co/120x120?text=Image"
                        }
                        alt={article.title}
                        className="h-16 w-16 rounded-lg object-cover shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/120x120?text=NA";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-tight text-slate-900 line-clamp-2">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {stripHtml(article.body).slice(0, 70)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CategoryPage;

