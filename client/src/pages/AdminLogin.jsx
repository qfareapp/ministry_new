import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Sending login:", email, password);
    try {
      const res = await axios.post("/api/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("user", JSON.stringify({ email: res.data.email, isAdmin: true }));
      setUser({ email: res.data.email, isAdmin: true });
      navigate("/admin-panel");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default AdminLogin;
