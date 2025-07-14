import React from "react";
import { Link } from "react-router-dom";

const FeaturedArticleSection = ({ article }) => {
  if (!article) return null;

  return (
    <div className="bg-white py-10 px-4 max-w-5xl mx-auto">
      <p className="text-red-600 font-bold uppercase mb-2">{article.category} News</p>
      <Link to={`/article/${article._id}`} target="_blank">
        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight hover:text-red-700">
          {article.title}
        </h2>
      </Link>
      <p className="text-lg text-gray-700 mt-3 mb-6">{article.description}</p>
      <img
  src={article.imageUrl}
  alt={article.title}
  className="w-full h-auto rounded shadow-md object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/600x300?text=Image+Unavailable";
  }}
/>
    </div>
  );
};

export default FeaturedArticleSection;
