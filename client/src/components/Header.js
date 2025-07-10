import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const Header = ({ user, setUser, toggleSidebar }) => {
  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="w-full bg-red-600 shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ✅ LOGO + TITLE */}
        <div className="flex items-center space-x-3">
          {/* ✅ Sidebar toggle for category (☰) on mobile */}
          <button
            onClick={toggleSidebar}
            className="text-white text-2xl mr-2 sm:hidden"
          >
            ☰
          </button>

          <img src="/assets/logo 2.png" alt="Logo" className="h-10 w-10" />

          {/* ✅ Title visible only on desktop */}
          <h1 className="hidden sm:inline text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
            Ministry of Missed Opportunities
          </h1>
        </div>

        {/* ✅ Desktop nav */}
        <div className="hidden md:flex items-center space-x-6 text-white text-sm font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/submit" className="hover:underline">Submit</Link>
          <Link to="/policy" className="hover:underline">Policy</Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline">Hi, {user.email.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
