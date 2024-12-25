import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { Menu } from "lucide-react";

const UnansweredQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = categoryParam ? `?category=${categoryParam}` : "";
        const data = await apiRequest(`/questions${query}`);
        const unanswered = data.filter((question) => question.answersCount === 0);
        setQuestions(unanswered);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.message || "Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryParam]);

  const handleCategoryClick = (category) => {
    setSearchParams({ category });
  };

  const getImageSrc = (images) => {
    if (!images?.length) {
      return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    }
    return images[0].startsWith("http")
      ? images[0]
      : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${images[0]}`;
  };

  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    return new Date(dateField).toLocaleString();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-blue-500 dark:bg-blue-600 text-white p-4 sm:p-6 rounded-lg text-center mb-6 sm:mb-8 transition-colors duration-300">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            {categoryParam ? `${categoryParam} Unanswered Questions` : "Unanswered Questions"}
          </h1>
          <p className="text-sm sm:text-lg">
            Explore questions waiting for your insights!
          </p>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden mb-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
        >
          <Menu className="h-6 w-6 mr-2" />
          <span>Toggle Categories</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className={`lg:w-1/4 ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
            <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg mb-6 sticky top-4 transition-colors duration-300">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Categories</h2>
              <ul className="space-y-2">
                {[
                  "Waste Management",
                  "Road Maintenance",
                  "Public Safety",
                  "Water Supply",
                  "Sanitation",
                  "Electricity",
                  "Garbage Collection",
                  "Colony Issue",
                  "Public Transport",
                  "Public Health",
                  "Pollution",
                  "Other",
                ].map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="text-blue-500 dark:text-blue-400 hover:underline block py-1 w-full text-left transition-colors duration-300"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question Feed */}
          <div className="lg:w-3/4">
            {error ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-700 dark:text-gray-300">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading unanswered questions...</p>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div
                    key={question._id}
                    className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg flex flex-col sm:flex-row items-start gap-4 transition-colors duration-300 hover:shadow-lg"
                  >
                    <img
                      src={getImageSrc(question.images)}
                      alt="Question thumbnail"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400"
                      loading="lazy"
                    />
                   <div className="flex-grow space-y-2">
  <Link
    to={`/questions/${question._id}`}
    className="text-base sm:text-lg font-semibold text-blue-500 dark:text-blue-400 hover:underline block transition-colors duration-300"
  >
    {question.title}
  </Link>
  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
    {question.description.slice(0, 100)}...
  </p>
  <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
    <span>
      <strong>Category:</strong> {question.category || "General"}
    </span>
    <span className="hidden sm:inline">•</span>
    <span>
      <strong>Created:</strong> {formatDate(question.createdAt)}
    </span>
  </div>
</div>
{/* Status aligned to the right */}
<div className="relative">
  <p className="text-sm dark:text-gray-300 transition-colors duration-300">
    <strong>Status:</strong>{" "}
    <span
      className={`transition-colors duration-300 ${
        question.status === "resolved"
          ? "text-green-500 dark:text-green-400"
          : question.status === "under review"
          ? "text-yellow-500 dark:text-yellow-400"
          : "text-red-500 dark:text-red-400"
      }`}
    >
      {question.status}
    </span>
  </p>
</div>

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center mt-6 transition-colors duration-300">
                No unanswered questions available.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
          <p className="mb-2">&copy; 2024 Q&A Hub. All rights reserved.</p>
          <div className="space-x-2">
            <Link to="/about" className="text-blue-500 dark:text-blue-400 hover:underline transition-colors duration-300">
              About Us
            </Link>
            <span>•</span>
            <Link to="/contact" className="text-blue-500 dark:text-blue-400 hover:underline transition-colors duration-300">
              Contact
            </Link>
            <span>•</span>
            <Link to="/privacy" className="text-blue-500 dark:text-blue-400 hover:underline transition-colors duration-300">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UnansweredQuestions;
