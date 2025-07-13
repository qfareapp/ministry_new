import React from "react";
import { useNavigate } from "react-router-dom";
import categories from "../constants/categories";

const Sidebar = ({ isOpen, onClose, user, setUser }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (catName) => {
    navigate(`/category/${encodeURIComponent(catName)}`);
    if (onClose) onClose(); // ✅ UPDATED: Close sidebar on mobile after selection
  };
 const handleLogout = () => { // ✅ NEW
    localStorage.clear();
    setUser(null);
    navigate("/");
    if (onClose) onClose();
  };

  return (
    <>
      {/* ✅ NEW: Backdrop for mobile (only when sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* ✅ UPDATED: Sidebar wrapper with responsive transform */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-[240px] bg-white shadow-md px-4 py-6 transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block`}
      >
        {/* ✅ NEW: Mobile-only Nav Links */}
        <ul className="space-y-3 mb-6 md:hidden border-b pb-4">
          <li onClick={() => { navigate("/"); onClose(); }} className="cursor-pointer text-gray-800 hover:text-red-600">🏠 Home</li>
          <li onClick={() => { navigate("/about"); onClose(); }} className="cursor-pointer text-gray-800 hover:text-red-600">ℹ️ About</li>
          <li onClick={() => { navigate("/submit"); onClose(); }} className="cursor-pointer text-gray-800 hover:text-red-600">✍️ Submit</li>
          <li onClick={() => { navigate("/policy"); onClose(); }} className="cursor-pointer text-gray-800 hover:text-red-600">📜 Policy</li>
          {user ? (
            <li onClick={handleLogout} className="cursor-pointer text-gray-800 hover:text-red-600">🚪 Logout</li>
          ) : (
            <li onClick={() => { navigate("/login"); onClose(); }} className="cursor-pointer text-gray-800 hover:text-red-600">🔑 Login</li>
          )}
        </ul>

        {/* ✅ CATEGORY LIST */}
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