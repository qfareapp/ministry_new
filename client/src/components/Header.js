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
        {/* ✅ LOGO + TITLE (visible on all screen sizes) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* ✅ Sidebar toggle button (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="text-white text-2xl mr-1 block lg:hidden "
          >
            ☰
          </button>

          {/* ✅ LOGO */}
           <img src="/assets/puzzle.png" alt="Logo" className="h-10 w-10 object-contain" />

          {/* ✅ Title: now visible on mobile & desktop */}
          <h1 className="text-base sm:text-2xl font-bold text-white leading-tight">
    Ministry of Missed Opportunities
  </h1>
        </div>

        {/* ✅ Desktop nav only */}
        <div className="hidden md:flex items-center space-x-6 text-white text-sm font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link
  to="/submit"
  className="relative px-3 py-1 font-semibold text-white border border-white rounded hover:bg-white hover:text-red-600 transition duration-300"
>
  Submit Article
</Link>
          <Link to="/policy" className="hover:underline">Policy</Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline">Hi, {user.email.split("@")[0]}</span>
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
