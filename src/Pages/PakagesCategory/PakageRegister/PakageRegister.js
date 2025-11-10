import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PackageRegister() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.username ||
      !formData.password
    ) {
      setError("⚠️ Please fill all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("⚠️ Passwords do not match.");
      return;
    }

    if (!formData.agree) {
      setError("⚠️ Please accept terms and conditions.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);

      const res = await fetch("https://demandonsale.com/trav-chap/api/userRegistration", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      console.log("✅ Register API Response:", data);

      if (data.status === true) {
        navigate("/login");
      } else {
        setError(data.message || "❌ Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Banner */}
      <div
        className="w-full h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e)",
        }}
      >
        <h2 className="text-white text-4xl font-bold px-6 py-2 rounded-lg bg-black/50">
          Register
        </h2>
      </div>

      {/* Form */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
        <form
          onSubmit={handleRegister}
          className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl border border-gray-200"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Your Account
          </h3>

          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mr-2 w-4 h-4 accent-blue-600"
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium text-white transition transform hover:scale-[1.02] shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </>
  );
}

export default PackageRegister;
