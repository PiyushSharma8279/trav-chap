// src/pages/Account.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const savedUser = localStorage.getItem("travchap_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/login"); // If not logged in → redirect to login
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("travchap_user");
    navigate("/login");
  };

  if (!user) return null;

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
            <span className="font-semibold">📞 Phone:</span>{" "}
            {user.phone_no || "N/A"}
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

          <p
            onClick={() => navigate("/reset-password")}
            className="text-blue-500 hover:underline block mt-2 cursor-pointer text-center"
          >
            Change Password?
          </p>
        </div>
      </div>
    </div>
  );
}
