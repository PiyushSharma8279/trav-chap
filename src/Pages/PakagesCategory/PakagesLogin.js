import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PakagesLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedUser = localStorage.getItem("travchap_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      console.log("✅ Login API Response:", data);

      if (data.status === true || data.status === "success") {
        const userData = data.data?.user || data.data || {}; // 🧠 handle nested object
        localStorage.setItem("travchap_user", JSON.stringify(userData));
        setUser(userData);
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

  const handleLogout = () => {
    localStorage.removeItem("travchap_user");
    setUser(null);
  };

  // ✅ If logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#0a2c53] mb-6 text-center">
            Your Account
          </h2>

          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">👤 Name:</span>{" "}
              {user.full_name || user.name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">📧 Email:</span>{" "}
              {user.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold">🆔 Username:</span>{" "}
              {user.username || "N/A"}
            </p>
            {user.mobile && (
              <p>
                <span className="font-semibold">📱 Mobile:</span> {user.mobile}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={() => navigate("/pakages")}
              className="w-full bg-[#0a2c53] text-white py-2 rounded-lg hover:bg-[#103b73] transition"
            >
              Go to Packages
            </button>
            <button
              onClick={handleLogout}
              className="w-full border border-[#0a2c53] text-[#0a2c53] py-2 rounded-lg hover:bg-[#0a2c53] hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Otherwise show login form
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <a
              onClick={() => navigate("/register")}
              className="text-blue-300 cursor-pointer hover:underline block"
            >
              Register
            </a>
            <a href="#" className="text-blue-300 hover:underline block mt-2">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </>
  );
}

export default PakagesLogin;
