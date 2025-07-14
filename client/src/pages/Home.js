import React, { useEffect, useState } from "react";
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
  axios.get("https://ministry-new.onrender.com/api/articles")
    .then((res) => setArticles(res.data))
    .catch((err) => {
      console.error(err);
      setError("Failed to load articles. Please try again later.");
    })
    .finally(() => setLoading(false));
}, []);
 const handleDelete = (deletedId) => {
    setArticles((prev) => prev.filter((a) => a._id !== deletedId));
  };
  const highlightArticles = articles
  .filter((a) => a.isHighlight)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const mainHighlight = highlightArticles[0];
const sideHighlights = highlightArticles.slice(1, 4);
  const heroArticle = articles.find((a) => a.isHero) || articles[0];
  const remainingArticles = articles.filter((a) => a._id !== heroArticle?._id);
  const featuredArticle = remainingArticles.find((a) => a.isFeatured) || remainingArticles[0];
  const otherArticles = remainingArticles.filter((a) => a._id !== featuredArticle?._id);
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
  <div className="max-w-7xl mx-auto px-4 py-6">
    

    {heroArticle && <HeroSection article={heroArticle} />}
    {featuredArticle && <FeaturedArticleSection article={featuredArticle} />}
{/* ✅ Add NewsHighlight here */}
    {highlightArticles.length > 0 && (
  <NewsHighlight mainArticle={mainHighlight} sideArticles={sideHighlights} />
)}
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-6 mt-6">
  {/* Main Articles - full width on mobile/tablet, 3/4 on desktop */}
  <div className="col-span-1 md:col-span-3 grid grid-cols-1 gap-6">
    {otherArticles.map((article) => (
      <ArticleCard key={article._id} article={article} user={user} onDelete={handleDelete}/>
    ))}
  </div>

  {/* Ads section - visible only on md and above */}
  <div className="hidden md:block">
    <div className="sticky top-20 space-y-6">
      <div className="bg-gray-100 p-4 shadow-sm">
        <h3 className="text-sm font-bold mb-2">Ad Space</h3>
        <div className="h-48 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600">300x250 Ad</span>
        </div>
      </div>

      <div className="bg-gray-100 p-4 shadow-sm">
        <div className="h-60 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600">Skyscraper Ad</span>
        </div>
      </div>
    </div>
  </div>
</div>
  </div>
);

};

export default Home;
