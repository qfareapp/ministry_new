import React from "react";
import "./NewsHighlight.css";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../../utils/image";
import { getArticlePath } from "../../utils/article";

const NewsHighlight = ({ mainArticle, sideArticles }) => {
  const navigate = useNavigate();
  if (!mainArticle) return null;

  const handleMainClick = () => navigate(getArticlePath(mainArticle));
  const handleSideClick = (article) => navigate(getArticlePath(article));
  const mainImageSrc =
    normalizeImageUrl(mainArticle.imageUrl) ||
    "https://via.placeholder.com/600x300?text=No+Image";

  return (
    <div className="news-highlight-container">
      <div className="news-highlight-header">
        <div>
          <p className="news-highlight-eyebrow">Spotlight</p>
          <h3 className="news-highlight-title">Hand-picked for you</h3>
        </div>
        <button className="news-highlight-cta" onClick={handleMainClick}>
          Open main story
        </button>
      </div>

      <div className="news-highlight-body">
        <div className="main-article" onClick={handleMainClick}>
          <img
            src={mainImageSrc}
            alt={mainArticle.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/600x300?text=Image+Unavailable";
            }}
          />
          <div className="main-article-overlay">
            <span className="main-article-badge">
              {mainArticle.category?.toUpperCase() || "FEATURED"}
            </span>
            <h3>{mainArticle.title}</h3>
          </div>
        </div>

        <div className="side-articles">
          {(sideArticles || []).map((article) => (
            <div
              key={article._id}
              className="side-article"
              onClick={() => handleSideClick(article)}
            >
              <span className="side-article-category">
                {article.category || "General"}
              </span>
              <div className="side-article-title">{article.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsHighlight;
