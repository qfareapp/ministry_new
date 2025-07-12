import React, { useState } from "react";
import axios from "axios";
import categories from "../constants/categories"; // ✅ import shared category list

const AdminForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    category: "",
    imageUrl: "",
    body: "",
    isHero: false,
    isHighlight: false,
     isFeatured: false,
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://ministry-new.onrender.com/api/articles", formData);
      setSuccess(true);
      setFormData({
        title: "",
        location: "",
        date: "",
        category: "",
        imageUrl: "",
        body: "",
        isHero: false,
        isHighlight: false,
        isFeatured: false,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create article");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛠️ Create New Article</h2>

      {success && <p className="text-green-600 mb-4">✅ Article submitted successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" className="w-full p-2 border rounded" value={formData.title} onChange={handleChange} required />
        <input name="location" placeholder="Location" className="w-full p-2 border rounded" value={formData.location} onChange={handleChange} required />
        <input name="date" type="date" className="w-full p-2 border rounded" value={formData.date} onChange={handleChange} required />

        {/* ✅ Category Dropdown */}
        <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">-- Select Category --</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input name="imageUrl" placeholder="Image URL" className="w-full p-2 border rounded" value={formData.imageUrl} onChange={handleChange} />
        <textarea name="body" rows="6" placeholder="Article Body" className="w-full p-2 border rounded" value={formData.body} onChange={handleChange} required />
        <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={formData.isHero}
    onChange={(e) =>
      setFormData({ ...formData, isHero: e.target.checked })
    }
  />
  Set as Hero Article
</label>
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={formData.isHighlight}
    onChange={(e) =>
      setFormData({ ...formData, isHighlight: e.target.checked })
    }
  />
  Mark as News Highlight
</label>
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={formData.isFeatured}
    onChange={(e) =>
      setFormData({ ...formData, isFeatured: e.target.checked })
    }
  />
  Mark as Featured Article
</label>
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Submit Article
        </button>
      </form>
    </div>
  );
};

export default AdminForm;
