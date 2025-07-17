import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FiCopy, FiExternalLink, FiShare2 } from "react-icons/fi";


const ArticleDetail = ({ user, setUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [comments, setComments] = useState([]);
  const [moreArticles, setMoreArticles] = useState([]);
  const [newComment, setNewComment] = useState("");
const [showShareOptions, setShowShareOptions] = useState(false);

const articleUrl = `${window.location.origin}/article/${id}`;

  useEffect(() => {
     // Log the article ID to debug undefined issues
  console.log("Fetched Article ID:", id);

  // Prevent running with invalid or missing ID
  if (!id) {
    setArticle(null);
    setLoading(false);
    return;
  }
  const fetchData = async () => {
    try {
      const res = await axios.get(`https://ministry-new.onrender.com/api/articles/${id}`);
      // Handle missing or empty article object
      if (!res.data || Object.keys(res.data).length === 0) {
        console.warn("Article not found or empty for ID:", id);
        setArticle(null);
        setLoading(false);
        return;
      }
      setArticle(res.data);
      setLikes(res.data.likes || 0);
      setShares(res.data.shares || 0);

      const commentRes = await axios.get(`https://ministry-new.onrender.com/api/articles/${id}/comments`);
      setComments(commentRes.data || []);

      const currentUserId = user?._id || localStorage.getItem("guestUserId");
      const alreadyLiked = res.data.likedBy?.includes(currentUserId);
      setHasLiked(alreadyLiked);
    } catch (err) {
      console.error("Error loading article:", err);
      setArticle(null); 
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  // Fetch more articles, excluding the current one
  axios
    .get(`https://ministry-new.onrender.com/api/articles`)
    .then((res) => {
      const others = res.data.filter((a) => a._id !== id);
      setMoreArticles(others.slice(0, 4));
    })
    .catch((err) => console.error("Error loading more articles:", err));

  // Ensure guest ID is stored
  if (!localStorage.getItem("guestUserId")) {
    localStorage.setItem("guestUserId", "guest-" + Date.now());
  }
}, [id, user]);


useEffect(() => {
  if (showShareOptions) {
    const hasShared = sessionStorage.getItem(`shared-${id}`);
    if (!hasShared && user) {
      axios
        .post(`https://ministry-new.onrender.com/${id}/share`, {
          userId: user.id,
        })
        .then(() => {
          setShares((prev) => prev + 1);
          sessionStorage.setItem(`shared-${id}`, "true");
        })
        .catch((err) => {
          console.error("Error incrementing share count:", err);
        });
    }
  }
}, [showShareOptions]);


const [hasLiked, setHasLiked] = useState(false);

const handleLike = async () => {
  if (!user) {
    navigate("/login", { state: { from: location.pathname } });
    return;
  }

  if (hasLiked) return;

  const userId = user._id || localStorage.getItem("guestUserId");

  try {
    const response = await axios.post(
      `https://ministry-new.onrender.com/api/articles/${id}/like`,
      { userId }
    );
    setLikes(response.data.likes);
    setHasLiked(true);
  } catch (error) {
    if (error.response) {
      console.error("Like failed:", error.response.data.error);
      alert(`Like failed: ${error.response.data.error}`);
    } else {
      console.error("Like error:", error.message);
      alert("An unexpected error occurred.");
    }
  }
};

  const handleShare = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    await axios.post(`https://ministry-new.onrender.com/api/articles/${id}/share`, { userId: user.id });
    setShares((prev) => prev + 1);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const res = await axios.post(`https://ministry-new.onrender.com/api/articles/${id}/comment`, {
      userId: user.id,
      userName: user.name,
      text: newComment,
    });
    setComments([...comments, res.data]);
    setNewComment("");
  };

  if (loading) return <p className="text-center py-10">Loading article, please wait...</p>;
if (!article || !article.title) return <p className="text-center py-10 text-red-600">⚠️ Article not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{new Date(article.date).toLocaleDateString()}</p>

      {/* Like/Share Stats */}
      <div className="flex items-center space-x-6 mb-6 text-gray-600">
        <span>👍 {likes} Likes</span>
        <span>💬 {comments.length} Comments</span>
        <span>🔗 {shares} Shares</span>
      </div>

      {/* Article Image */}
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full max-h-[400px] object-cover rounded mb-8"
      />

      {/* Body */}
<div className="prose prose-lg mb-12">
  {article.body
    .split(/\n\s*\n/) // split by paragraph breaks
    .map((para, index) => (
      <p key={index} className="mb-4 leading-relaxed text-justify">
        {para}
      </p>
    ))}
</div>


      {/* Like/Share Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
  onClick={handleLike}
  disabled={hasLiked}
  className={`px-4 py-2 rounded ${
    hasLiked
      ? "bg-gray-400 text-white cursor-not-allowed"
      : user
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-300 text-gray-500"
  }`}
>
  {hasLiked ? "❤️ Liked" : "👍 Like"}
</button>
        <div className="relative">
  <button
    onClick={() => setShowShareOptions(!showShareOptions)}
    className={`px-4 py-2 rounded ${
      user ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
    }`}
  >
    🔗 Share
  </button>

  {showShareOptions && (
    <div className="absolute mt-2 bg-white border shadow rounded p-3 z-10 space-y-3 w-64">
      {/* WhatsApp */}
      <button
        onClick={() =>
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${article.title} - ${articleUrl}`)}`,
            "_blank"
          )
        }
        className="flex items-center space-x-2 text-green-600 hover:underline"
      >
        <FiExternalLink />
        <span>Share on WhatsApp</span>
      </button>

      {/* Copy Link */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(articleUrl);
          alert("🔗 Link copied to clipboard!");
        }}
        className="flex items-center space-x-2 text-blue-600 hover:underline"
      >
        <FiCopy />
        <span>Copy Link</span>
      </button>

      {/* Native Device Share */}
      {navigator.share && (
        <button
          onClick={() =>
            navigator.share({
              title: article.title,
              text: "Check out this article on Ministry of Missed Opportunities",
              url: articleUrl,
            })
          }
          className="flex items-center space-x-2 text-black hover:underline"
        >
          <FiShare2 />
          <span>Share via Device</span>
        </button>
      )}
    </div>
  )}
</div>

      </div>

      {/* Comments Section */}
<div className="mb-6">
  <h3 className="text-xl font-semibold mb-4">Comments</h3>

  {/* Render existing comments */}
  {comments.map((comment, idx) => (
    <div key={idx} className="mb-3 border-b pb-2">
      <p className="font-medium">{comment.userName}</p>
      <p className="text-gray-700">{comment.text}</p>
    </div>
  ))}

  {/* Always show the comment box */}
  <form onSubmit={handleCommentSubmit} className="mt-4">
    <textarea
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder={
        user
          ? "Write a comment..."
          : "Login to comment. Commenting is disabled."
      }
      className="w-full border rounded p-2 mb-2"
      rows={3}
      disabled={!user}
    />
    <button
      type="submit"
      disabled={!user || !newComment.trim()}
      className={`px-4 py-2 rounded ${
        user && newComment.trim()
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Post Comment
    </button>
  </form>
</div>
{moreArticles.length > 0 && (
  <div className="mt-10">
    <h3 className="text-xl font-semibold mb-4">More Articles</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {moreArticles.map((item) => (
        <div
          key={item._id}
          className="p-4 border rounded hover:shadow cursor-pointer"
          onClick={() => navigate(`/article/${item._id}`)}
        >
          <p className="text-sm text-red-600 font-bold uppercase">{item.category}</p>
          <h4 className="text-lg font-semibold mt-1">{item.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{item.body?.slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
};

export default ArticleDetail;
