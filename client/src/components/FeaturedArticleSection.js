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
        src={article.image}
        alt={article.title}
        className="w-full h-auto rounded shadow-md object-cover"
      />
    </div>
  );
};

export default FeaturedArticleSection;
