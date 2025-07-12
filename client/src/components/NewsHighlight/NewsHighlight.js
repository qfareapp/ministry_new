import React from "react";
import "./NewsHighlight.css";
import { useNavigate } from "react-router-dom";

const NewsHighlight = ({ mainArticle, sideArticles }) => {
  const navigate = useNavigate();

  const handleMainClick = () => navigate(`/article/${mainArticle._id}`);
  const handleSideClick = (id) => navigate(`/article/${id}`);

  return (
    <div className="news-highlight-container">
      <div className="news-highlight-header">
        🔴 {mainArticle.category}
      </div>

      <div className="news-highlight-body">
        {/* Left - Main Story */}
        <div className="main-article" onClick={handleMainClick}>
          <img
            src={mainArticle.imageUrl || "https://via.placeholder.com/600x300?text=No+Image"}
            alt="Main"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/600x300?text=Image+Unavailable";
            }}
          />
          <div className="main-article-overlay">
            <span>{mainArticle.category?.toUpperCase()}</span>
            <h3>{mainArticle.title}</h3>
          </div>
        </div>

        {/* Right - Side Articles */}
        <div className="side-articles">
          {sideArticles.map((article) => (
            <div
              key={article._id}
              className="side-article"
              onClick={() => handleSideClick(article._id)}
            >
              {article.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsHighlight;
