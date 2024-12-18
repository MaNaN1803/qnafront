import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", response.token);
      navigate("/home");
    } catch {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full sm:w-96 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-400 p-8 rounded-lg shadow-xl">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-gray-800 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
