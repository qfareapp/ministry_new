import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

const Header = ({ user, setUser, toggleSidebar }) => {  
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="w-full bg-red-600 shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-3">
           {/* ✅ ADDED: Sidebar toggle button (hamburger icon) */}
          <button 
            onClick={toggleSidebar} 
            className="text-white text-2xl mr-2 sm:hidden"  // ✅ ADDED: hidden on larger screens
          >
            ☰
          </button>
          <img src="/assets/puzzle.png" alt="Logo" className="h-10 w-10" />
          <h1 className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
            Ministry of Missed Opportunities
          </h1>
        </div>

        {/* Mobile Hamburger for dropdown menu */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            ⋮  {/* ✅ UPDATED: vertical dots for dropdown menu (separate from sidebar toggle) */}
          </button>
        </div>

        {/* Desktop Nav + Auth */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 text-white text-sm font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:underline">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:underline">About</Link>
          <Link to="/submit" onClick={() => setMenuOpen(false)} className="hover:underline">Submit</Link>
          <Link to="/policy" onClick={() => setMenuOpen(false)} className="hover:underline">Policy</Link>

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100 w-fit"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100 w-fit"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
