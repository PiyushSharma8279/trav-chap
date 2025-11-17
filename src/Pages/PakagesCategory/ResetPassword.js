import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const savedUser = localStorage.getItem("travchap_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      // ✅ Strong user_id detection from any API format
      const id =
        parsedUser?.id ||
        parsedUser?.user_id ||
        parsedUser?.data?.id ||
        parsedUser?.data?.user_id ||
        "";

      setUserId(id);
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("⚠️ All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("⚠️ New password and confirm password do not match.");
      return;
    }

    if (!userId) {
      setError("⚠️ User ID missing. Please login again.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const API_URL =
        "https://demandonsale.com/trav-chap/api/user/change_password";

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("current_password", currentPassword);
      formData.append("new_password", newPassword);
      formData.append("confirm_password", confirmPassword);
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("🔄 Reset Password Response:", data);

      if (data.status === true || data.status === "success") {
        setSuccess(data.message || "✔ Password changed successfully!");
      } else {
        setError(data.message || "❌ Failed to change password.");
      }
    } catch (err) {
      console.error("❌ Reset password error:", err);
      setError("⚠ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full h-80 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1542744173-8e7e53415bb0)`,
        }}
      >
        <h2 className="text-center text-white font-semibold text-4xl px-6 py-2 rounded-lg bg-black/40">
          Reset Password
        </h2>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
        <form
          onSubmit={handleReset}
          className="bg-[#0a2c53] w-full max-w-md p-8 rounded-lg shadow-lg"
        >
          <h3 className="text-white text-2xl mb-6 text-center font-semibold">
            Change Your Password
          </h3>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter your current password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Confirm new password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-300 text-sm mb-4 text-center">{success}</p>
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
            {loading ? "Updating..." : "Update Password"}
          </button>

          <p
            onClick={() => navigate("/login")}
            className="text-blue-300 cursor-pointer hover:underline mt-6 text-center"
          >
            Back to Login
          </p>
        </form>
      </div>
    </>
  );
}
