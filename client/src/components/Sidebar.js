import React from "react";
import { useNavigate } from "react-router-dom";
import categories from "../constants/categories";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (catName) => {
    navigate(`/category/${encodeURIComponent(catName)}`);
    if (onClose) onClose(); // ✅ UPDATED: Close sidebar on mobile after selection
  };

  return (
    <>
      {/* ✅ NEW: Backdrop for mobile (only when sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* ✅ UPDATED: Sidebar wrapper with responsive transform */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-[220px] bg-white shadow-md px-4 py-6 transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 sm:static sm:block`}
      >
        <ul className="space-y-4">
          {categories.map((cat, index) => (
            <li
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex items-center space-x-3 text-gray-700 hover:text-red-600 cursor-pointer text-sm font-medium"
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
