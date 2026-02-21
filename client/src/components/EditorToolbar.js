import React from "react";

const TOOLS = [
  { key: "bold", label: "Bold" },
  { key: "italic", label: "Italic" },
  { key: "underline", label: "Underline" },
  { key: "h2", label: "Heading" },
  { key: "quote", label: "Quote" },
  { key: "ul", label: "Bullet List" },
  { key: "ol", label: "Numbered List" },
  { key: "link", label: "Link" },
];

const EditorToolbar = ({ onAction }) => (
  <div className="flex flex-wrap gap-2">
    {TOOLS.map((tool) => (
      <button
        key={tool.key}
        type="button"
        onClick={() => onAction(tool.key)}
        className="rounded border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100"
      >
        {tool.label}
      </button>
    ))}
  </div>
);

export default EditorToolbar;

