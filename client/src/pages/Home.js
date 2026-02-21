import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import ArticleCard from "../components/ArticleCard";
import FeaturedArticleSection from "../components/FeaturedArticleSection";
import NewsHighlight from "../components/NewsHighlight/NewsHighlight";

const Home = ({ user }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://ministry-new.onrender.com/api/articles")
      .then((res) => setArticles(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load articles. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (deletedId) => {
    setArticles((prev) => prev.filter((article) => article._id !== deletedId));
  };

  const highlightArticles = articles
    .filter((article) => article.isHighlight)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const mainHighlight = highlightArticles[0];
  const sideHighlights = highlightArticles.slice(1, 4);
  const heroArticle = articles.find((article) => article.isHero) || articles[0];
  const remainingArticles = articles.filter(
    (article) => article._id !== heroArticle?._id
  );
  const featuredArticle =
    remainingArticles.find((article) => article.isFeatured) ||
    remainingArticles[0];
  const otherArticles = remainingArticles.filter(
    (article) => article._id !== featuredArticle?._id
  );

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(articles.map((article) => article.category).filter(Boolean))
    );
    return unique.slice(0, 6);
  }, [articles]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
        Loading articles, please wait...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {heroArticle && <HeroSection article={heroArticle} />}

        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/80 border border-gray-100 shadow-sm px-4 py-3">
            <span className="text-xs font-semibold uppercase text-gray-500">
              Quick filters
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {highlightArticles.length > 0 && (
          <NewsHighlight
            mainArticle={mainHighlight}
            sideArticles={sideHighlights}
          />
        )}

        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase font-semibold text-red-600">
                  Latest coverage
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  Fresh from the newsroom
                </h3>
                <p className="text-sm text-gray-600">
                  Browse everything that is not highlighted above.
                </p>
              </div>
              <a
                href="/submit"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Share a story
                <span aria-hidden="true">{">"}</span>
              </a>
            </div>

            {otherArticles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-10 text-center text-gray-600 shadow-sm">
                More stories are on their way. Check back soon.
              </div>
            ) : (
              <div className="space-y-4">
                {otherArticles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    user={user}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-4">
            {featuredArticle && <FeaturedArticleSection article={featuredArticle} />}

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                Stay in the loop
              </p>
              <p className="text-sm text-gray-600">
                Bookmark the Ministry so you do not miss the next opportunity.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  About the Ministry
                </a>
                <a
                  href="/policy"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
                >
                  Read our policy
                </a>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Home;
