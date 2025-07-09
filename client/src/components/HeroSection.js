import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/article/${article._id}`);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white px-4 py-10">
      {/* Left Text Section */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h2>

        {/* ✅ Article Snippet */}
        <p className="text-gray-700 text-base mb-6 line-clamp-4">
          {article.body
            ?.replace(/<[^>]+>/g, "") // strip HTML tags if any
            .slice(0, 300)}...
        </p>

        <button
          onClick={handleClick}
          className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700"
        >
          Read Full Article
        </button>
      </div>

      {/* Right Image */}
      <div>
        <img
          src={article.imageUrl || "https://via.placeholder.com/600x300"}
          alt={article.title}
          className="w-full rounded shadow-md object-cover max-h-[400px]"
        />
      </div>
    </section>
  );
};

export default HeroSection;
