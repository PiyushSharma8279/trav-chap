// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const savedUser = localStorage.getItem("travchap_user");
    if (savedUser) {
      navigate("/account"); // Already logged in → redirect
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("⚠️ Please enter both username and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const API_URL = "https://demandonsale.com/trav-chap/api/user/login";

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(API_URL, { method: "POST", body: formData });
      const data = await res.json();

      if (data.status === true || data.status === "success") {
        const userData = data.data?.user || data.data || {};
        localStorage.setItem("travchap_user", JSON.stringify(userData));
        navigate("/pakages");
      } else {
        setError(data.message || "❌ Invalid username or password.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full h-80 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjWmiqweNJs456ZNquPcFecIqR8Z4iPS80KQ&s)`,
        }}
      >
        <h2 className="text-center text-white font-semibold text-4xl px-6 py-2 rounded-lg bg-black/40">
          LOGIN
        </h2>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
        <form
          onSubmit={handleLogin}
          className="bg-[#0a2c53] w-full max-w-md p-8 rounded-lg shadow-lg"
        >
          <div className="text-white py-2 mb-4 text-center">
            <p className="text-sm opacity-70">
              Use your registered credentials to log in
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Username<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-6 text-center">
            <p
              onClick={() => navigate("/register")}
              className="text-blue-300 cursor-pointer hover:underline"
            >
              Register
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
