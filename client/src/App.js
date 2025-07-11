import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminForm from "./pages/AdminForm";
import ArticleDetail from "./pages/ArticleDetail";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import About from "./pages/About";
import EditArticle from "./pages/EditArticle";
import CategoryPage from "./pages/CategoryPage";
import SubmitArticle from "./pages/SubmitArticle";
import Login from "./components/Login";
import AdminPanel from './pages/AdminPanel';
import EditSubmission from './pages/EditSubmission';
import PolicyPage from "./pages/PolicyPage";
import AdminLogin from './pages/AdminLogin';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Optional: restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.isAdmin = parsedUser.isAdmin === true || parsedUser.isAdmin === "true";
      setUser(parsedUser);
    }
  }, []);


   return (
    <Router>
      {/* ✅ UPDATED: pass toggle function to Header */}
      <Header user={user} setUser={setUser} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* ✅ UPDATED: Layout with sidebar + content */}
      <div className="flex relative">
        {/* ✅ Pass props to Sidebar for responsive behavior */}
        <Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  user={user}           // ✅ NEW
  setUser={setUser}     // ✅ NEW
/>

        {/* ✅ Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/submit" element={<SubmitArticle user={user} setUser={setUser} />} />
            <Route path="/article/:id" element={<ArticleDetail user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/policy" element={<PolicyPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />

            {/* ✅ Admin-only routes */}
            <Route
              path="/admin-panel"
              element={user?.isAdmin ? <AdminPanel /> : <Navigate to="/admin" />}
            />
            <Route
              path="/admin/edit/:id"
              element={user?.isAdmin ? <EditArticle /> : <Navigate to="/admin" />}
            />
            <Route
              path="/admin/edit-submission/:id"
              element={user?.isAdmin ? <EditSubmission /> : <Navigate to="/admin" />}
            />
            <Route
              path="/admin"
              element={
                user?.isAdmin ? <Navigate to="/admin-panel" replace /> : <AdminLogin setUser={setUser} />
              }
            />
            <Route
              path="/admin-form"
              element={user?.isAdmin ? <AdminForm /> : <Navigate to="/admin" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;