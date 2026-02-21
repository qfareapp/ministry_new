import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categories from "../constants/categories";
import axios from "axios";
import EditorToolbar from "../components/EditorToolbar";
import { applyEditorFormat } from "../utils/editorFormatting";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
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

  useEffect(() => {
    if (!id) return;

    axios
      .get(`https://ministry-new.onrender.com/api/articles/${id}`)
      .then((res) => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setError("Article not found or failed to load.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleEditorAction = (action) => {
    const el = textareaRef.current;
    if (!el) return;

    const linkUrl = action === "link" ? window.prompt("Enter link URL") || "" : "";

    const result = applyEditorFormat({
      value: article.body || "",
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
      action,
      linkUrl,
    });
    if (!result) return;

    setArticle((prev) => ({ ...prev, body: result.value }));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.start, result.end);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`https://ministry-new.onrender.com/api/articles/${id}`, article);
      navigate("/");
    } catch (err) {
      console.error("Error updating article:", err);
      alert("Failed to update article");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Article</h1>
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
        <EditorToolbar onAction={handleEditorAction} />
        <textarea
          ref={textareaRef}
          name="body"
          value={article.body}
          onChange={handleChange}
          rows={10}
          className="w-full border p-2 rounded"
          placeholder="Article Body"
        />
        <p className="text-xs text-gray-500">
          Formatting supported: bold, italic, underline, heading, quote, lists, and links.
        </p>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditArticle;

