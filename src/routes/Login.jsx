import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import { apiRequest } from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      toast.error("Only Gmail IDs are allowed.");
      return;
    }

    if (!captchaValid) {
      toast.error("Please verify the CAPTCHA.");
      return;
    }

    try {
      const response = await apiRequest("/auth/login", "POST", { email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/", { replace: true }), 2000);
      } else {
        toast.error("Invalid response from server");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials. Please try again.");
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValid(!!value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full sm:w-96 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-4xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mb-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 mb-6 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            required
          />
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={handleCaptchaChange}
            className="mb-6"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gray-800 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gray-800 dark:text-gray-300 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
