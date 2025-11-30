import React, { useRef, useState } from "react";
import axios from "axios";
import Login from "../components/Login";

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

    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd) || "text";
    let formatted = selected;
    let offset = 0;

    switch (format) {
      case "bold":
        formatted = `**${selected}**`;
        offset = 2;
        break;
      case "italic":
        formatted = `*${selected}*`;
        offset = 1;
        break;
      case "underline":
        formatted = `<u>${selected}</u>`;
        offset = 3;
        break;
      case "quote":
        formatted = `> ${selected}`;
        offset = 2;
        break;
      case "list":
        formatted = selected
          .split("\n")
          .map((line) => (line.trim().length ? `- ${line}` : "- "))
          .join("\n");
        offset = 2;
        break;
      default:
        break;
    }

    const newValue = value.slice(0, selectionStart) + formatted + value.slice(selectionEnd);
    setForm((prev) => ({ ...prev, content: newValue }));

    const start = selectionStart + offset;
    const end = selectionStart + formatted.length - offset;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start, end);
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
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Bold", action: "bold" },
              { label: "Italic", action: "italic" },
              { label: "Underline", action: "underline" },
              { label: "Quote", action: "quote" },
              { label: "List", action: "list" },
            ].map((item) => (
              <button
                key={item.action}
                type="button"
                onClick={() => applyFormat(item.action)}
                className="rounded border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>
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
            Use the buttons to add quick formatting. Markdown and basic tags like &lt;u&gt; are
            supported when reading.
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
