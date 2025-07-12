import React from "react";
import "./NewsHighlight.css";
import { useNavigate } from "react-router-dom";

const NewsHighlight = ({ mainArticle, sideArticles }) => {
  const navigate = useNavigate();

  const handleMainClick = () => navigate(`/article/${mainArticle._id}`);
  const handleSideClick = (id) => navigate(`/article/${id}`);

  return (
    <div className="news-highlight-container">
      <div className="news-highlight-header">🔴 {mainArticle.category}</div>

      {/* Main image with overlay title */}
      <div className="mobile-hero" onClick={handleMainClick}>
        <img
          src={mainArticle.imageUrl || "https://via.placeholder.com/600x300?text=No+Image"}
          alt="Main"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/600x300?text=Image+Unavailable";
          }}
        />
        <div className="mobile-hero-overlay">
          <span>{mainArticle.category?.toUpperCase()}</span>
          <h2>{mainArticle.title}</h2>
        </div>
      </div>

      {/* Headlines list */}
      <div className="mobile-headlines">
        {sideArticles.map((article) => (
          <div
            key={article._id}
            className="mobile-headline"
            onClick={() => handleSideClick(article._id)}
          >
            {article.title}
          </div>
        ))}
      </div>

      <div className="news-highlight-footer">
        <span>News</span> | <span>Videos</span> | <span>Visuals</span>
      </div>
    </div>
  );
};

export default NewsHighlight;
