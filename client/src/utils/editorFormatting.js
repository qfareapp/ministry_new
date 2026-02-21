const wrapSelection = (selected, openTag, closeTag, fallback = "text") =>
  `${openTag}${selected || fallback}${closeTag}`;

const buildList = (selected, ordered = false) => {
  const lines = (selected || "List item")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const tag = ordered ? "ol" : "ul";
  const items = lines.map((line) => `  <li>${line}</li>`).join("\n");
  return `<${tag}>\n${items}\n</${tag}>`;
};

export const applyEditorFormat = ({
  value,
  selectionStart,
  selectionEnd,
  action,
  linkUrl,
}) => {
  const selected = value.slice(selectionStart, selectionEnd).trim();
  let formatted = selected || "text";
  let cursorOffsetStart = 0;
  let cursorOffsetEnd = 0;

  switch (action) {
    case "bold":
      formatted = wrapSelection(selected, "<strong>", "</strong>");
      cursorOffsetStart = 8;
      cursorOffsetEnd = 9;
      break;
    case "italic":
      formatted = wrapSelection(selected, "<em>", "</em>");
      cursorOffsetStart = 4;
      cursorOffsetEnd = 5;
      break;
    case "underline":
      formatted = wrapSelection(selected, "<u>", "</u>");
      cursorOffsetStart = 3;
      cursorOffsetEnd = 4;
      break;
    case "h2":
      formatted = wrapSelection(selected, "<h2>", "</h2>", "Heading");
      cursorOffsetStart = 4;
      cursorOffsetEnd = 5;
      break;
    case "quote":
      formatted = wrapSelection(selected, "<blockquote>", "</blockquote>");
      cursorOffsetStart = 12;
      cursorOffsetEnd = 13;
      break;
    case "ul":
      formatted = buildList(selected, false);
      break;
    case "ol":
      formatted = buildList(selected, true);
      break;
    case "link": {
      const url = (linkUrl || "").trim();
      if (!url) {
        return null;
      }
      const safeUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      formatted = `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${
        selected || "Link text"
      }</a>`;
      cursorOffsetStart = formatted.indexOf(">") + 1;
      cursorOffsetEnd = 4;
      break;
    }
    default:
      return null;
  }

  const nextValue =
    value.slice(0, selectionStart) + formatted + value.slice(selectionEnd);

  return {
    value: nextValue,
    start: selectionStart + cursorOffsetStart,
    end: selectionStart + formatted.length - cursorOffsetEnd,
  };
};

