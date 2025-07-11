import React, { useEffect, useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import ArticleCard from "../components/ArticleCard";
import FeaturedArticleSection from "../components/FeaturedArticleSection";
import NewsHighlight from "../components/NewsHighlight/NewsHighlight";

const Home = ({ user }) => {
  const [articles, setArticles] = useState([]);
   

  useEffect(() => {
    axios.get("https://ministry-new.onrender.com/api/articles")
      .then((res) => setArticles(res.data))
      .catch((err) => console.error(err));
  }, []);

  const highlightArticles = articles
  .filter((a) => a.isHighlight)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const mainHighlight = highlightArticles[0];
const sideHighlights = highlightArticles.slice(1, 4);
  const heroArticle = articles.find((a) => a.isHero) || articles[0];
  const remainingArticles = articles.filter((a) => a._id !== heroArticle?._id);
  const featuredArticle = remainingArticles.find((a) => a.isFeatured) || remainingArticles[0];
  const otherArticles = remainingArticles.filter((a) => a._id !== featuredArticle?._id);


  return (
  <div className="max-w-7xl mx-auto px-4 py-6">
    

    {heroArticle && <HeroSection article={heroArticle} />}
    {featuredArticle && <FeaturedArticleSection article={featuredArticle} />}
{/* ✅ Add NewsHighlight here */}
    {highlightArticles.length > 0 && (
  <NewsHighlight mainArticle={mainHighlight} sideArticles={sideHighlights} />
)}
    {/* Layout: Main content + Ads */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      {/* Main Articles - 3/4 width */}
      <div className="md:col-span-3 grid grid-cols-1 gap-6">
        {otherArticles.map((article) => (
          <ArticleCard key={article._id} article={article} user={user} />
        ))}
      </div>

      {/* Ads section - 1/4 width */}
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
