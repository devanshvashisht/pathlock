import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {api} from "../utils/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (username.trim().length > 20) {
      setError("Username must be less than 20 characters");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Username already exists. Please choose another one.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Registration failed. Invalid input.");
      } else if (err.message === "Network Error") {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      }
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-8">Register</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={loading}
          />
          <input
            type="password"
            className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
          />
          <input
            type="password"
            className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-lg px-8 py-3 font-semibold text-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-gray-500 text-center">
          Already registered?{" "}
          <Link className="text-indigo-500 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}