import React from "react";
import { useNavigate } from "react-router-dom";
import categories from "../constants/categories";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (catName) => {
    navigate(`/category/${encodeURIComponent(catName)}`);
  };

  return (
    <div className="w-[200px] h-screen bg-white shadow-md px-4 py-6 sticky top-0">
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
  );
};

export default Sidebar;
