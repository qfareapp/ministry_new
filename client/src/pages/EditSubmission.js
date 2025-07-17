import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    name: "",
    location: "",
    authorName: "",
    authorEmail: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios
    .get(`/api/admin/user-submissions/${id}`)
    .then((res) => {
      const data = res.data || {};
      setForm({
        title: data.title || "",
        content: data.content || "",
        name: data.name || "",
        location: data.location || "",
        authorName: data.authorName || "",
        authorEmail: data.authorEmail || ""
      });
      setLoading(false);
    })
    .catch((err) => {
      console.error("❌ Error fetching submission:", err);
      setLoading(false);
    });
}, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/admin/user-submissions/${id}`, form);
      alert("✅ Submission updated");
      navigate("/admin/panel");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update submission");
    }
  };

  if (loading) return <p className="p-6">Loading submission...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit User Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Title"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Location"
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Name"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full p-2 border rounded h-40"
          placeholder="Content"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Submission
        </button>
      </form>
    </div>
  );
};

export default EditSubmission;
