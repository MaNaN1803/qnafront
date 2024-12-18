import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await apiRequest("/auth/signup", "POST", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-200 via-gray-200 to-gray-600">
      <div className="w-full sm:w-96 bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-gray-800 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
