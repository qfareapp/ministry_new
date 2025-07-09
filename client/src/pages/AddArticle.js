import React, { useState } from 'react';
import axios from 'axios';

const AddArticle = () => {
  const [form, setForm] = useState({ title: '', content: '', category: '', section: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/articles', form);
    alert("✅ Article added successfully!");
    setForm({ title: '', content: '', category: '', section: '' });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">➕ Add New Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input name="category" placeholder="Category (e.g. Policy)" value={form.category} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="section" placeholder="Section (e.g. News, Satire)" value={form.section} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} className="w-full border px-3 py-2 rounded h-40" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default AddArticle;
