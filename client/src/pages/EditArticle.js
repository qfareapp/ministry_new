import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categories from "../constants/categories";
import axios from "axios";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: "",
    body: "",
    location: "",
    category: "",
    date: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing article
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/api/articles/${id}`)
      .then((res) => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching article:", err);
        setError("Article not found or failed to load.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/articles/${id}`, article);
      navigate("/");
    } catch (err) {
      console.error("❌ Error updating article:", err);
      alert("Failed to update article");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">✏️ Edit Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={article.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Title"
          required
        />
        <input
          name="location"
          value={article.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Location"
        />
        <input
          type="date"
          name="date"
          value={article.date ? article.date.substring(0, 10) : ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
  name="category"
  value={article.category}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  required
>
  <option value="">-- Select Category --</option>
  {categories.map((cat, idx) => (
    <option key={idx} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>

        <input
          name="imageUrl"
          value={article.imageUrl}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Image URL"
        />
        <textarea
          name="body"
          value={article.body}
          onChange={handleChange}
          rows={10}
          className="w-full border p-2 rounded"
          placeholder="Article Body"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditArticle;
