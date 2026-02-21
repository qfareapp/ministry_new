import React, { useRef, useState } from "react";
import axios from "axios";
import Login from "../components/Login";
import EditorToolbar from "../components/EditorToolbar";
import { applyEditorFormat } from "../utils/editorFormatting";

const SubmitArticle = ({ user, setUser }) => {
  const [form, setForm] = useState({ name: "", location: "", title: "", content: "" });
  const textareaRef = useRef(null);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 shadow-md rounded-md p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">Write</div>
          <h2 className="text-xl font-semibold mb-2">Please log in to submit your article</h2>
          <p className="text-gray-600 mb-6">
            You must be signed in to share your content with the world.
          </p>
          <Login setUser={setUser} />
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://ministry-new.onrender.com/api/articles/submit-article",
        {
          ...form,
          authorName: user.name,
          authorEmail: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Article submitted for review!");
      setForm({ name: "", location: "", title: "", content: "" });
    } catch (err) {
      console.error("Submission error", err);
      alert("Submission failed. Please try again.");
    }
  };

  const applyFormat = (format) => {
    const el = textareaRef.current;
    if (!el) return;

    const linkUrl = format === "link" ? window.prompt("Enter link URL") || "" : "";
    const result = applyEditorFormat({
      value: form.content,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
      action: format,
      linkUrl,
    });
    if (!result) return;

    setForm((prev) => ({ ...prev, content: result.value }));

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.start, result.end);
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="mb-6 text-center bg-yellow-50 border border-yellow-300 p-4 rounded">
        <p className="text-md text-gray-700">
          <strong>Do you think you have an idea that can actually change India?</strong> Brilliant.
          Submit it below. The <em>Ministry of Missed Opportunities</em> will definitely implement it
          probably faster than any real government department. No RTI needed.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Submit Your Article</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Your Location (e.g., Kolkata, Bihar)"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="title"
          placeholder="Article Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          required
        />

        <div className="space-y-2">
          <EditorToolbar onAction={applyFormat} />
          <textarea
            ref={textareaRef}
            name="content"
            placeholder="Write your article here..."
            value={form.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded h-40 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
          <p className="text-xs text-gray-500">
            Formatting supported: bold, italic, underline, heading, quote, lists, and links.
          </p>
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
        >
          Submit for Review
        </button>
      </form>
    </div>
  );
};

export default SubmitArticle;
