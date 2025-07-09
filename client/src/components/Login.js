import React from 'react';
import { auth, provider, signInWithPopup } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid
      }));

      // Set user in app state
      setUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid
      });

      // ✅ Redirect back to previous page
      navigate(redirectTo);
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed');
    }
  };

  return (
    <div className="text-center max-w-md mx-auto mt-10">
      {/* 🎭 Sarcastic Message */}
      <div className="mb-6 bg-yellow-50 border border-yellow-300 p-4 rounded">
        <p className="text-md text-gray-700">
          <strong>Do you think you have an idea that can actually change India?</strong> Brilliant.
          Submit it below. The <em>Ministry of Missed Opportunities</em> will “definitely” implement it —
          probably faster than any real government department. No RTI needed.
        </p>
      </div>

      {/* 🔐 Login Button */}
      <button
        onClick={handleLogin}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
