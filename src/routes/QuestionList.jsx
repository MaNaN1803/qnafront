import React, { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { Link } from "react-router-dom";

const QuestionList = () => {
  const categories = [
    "General",
    "Waste Management",
    "Road Maintenance",
    "Public Safety",
    "Environmental",
    "Healthcare",
    "Education",
    "Transportation",
    "Energy",
    "Sustainability",
    "Community",
  ];

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = selectedCategory ? `?category=${selectedCategory}` : "";
        const data = await apiRequest(`/questions${query}`);
        const sortedQuestions = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setQuestions(sortedQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to fetch questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory]);

  const getImageSrc = (images) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  };

  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    try {
      return new Date(dateField).toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Hero Section */}
      <div className="bg-blue-500 text-white p-6 rounded-lg text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Explore Questions</h1>
        <p className="text-lg">Browse through the latest questions and share your knowledge.</p>
        <Link
          to="/submit-question"
          className="mt-4 inline-block bg-white text-blue-500 px-6 py-2 rounded hover:bg-gray-200 transition"
        >
          Ask a Question
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-1/4 lg:pr-4 mb-6 lg:mb-0">
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`text-blue-500 hover:underline block py-1 w-full text-left ${
                      selectedCategory === category ? "font-bold text-blue-700" : ""
                    }`}
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
          <h2 className="text-2xl font-semibold mb-4">
            {selectedCategory ? `${selectedCategory} Questions` : "All Questions"}
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading ? (
            <p className="text-center text-gray-500">Loading questions...</p>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question._id}
                  className="bg-white p-4 shadow rounded-lg flex flex-col sm:flex-row items-start gap-4"
                >
                  {/* Thumbnail */}
                  <img
                    src={getImageSrc(question.images)}
                    alt="Question thumbnail"
                    className="w-16 h-16 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex-grow">
                    {/* Question Title */}
                    <Link
                      to={`/questions/${question._id}`}
                      className="text-lg font-semibold text-blue-500 hover:underline block"
                    >
                      {question.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {question.description.slice(0, 100)}...
                    </p>
                    <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
                      <span>
                        <strong>Category:</strong> {question.category || "General"}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        <strong>Created:</strong> {formatDate(question.createdAt)}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        <strong>Posted by:</strong> {question.user?.name || "Anonymous"}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    <p>
                      <strong>Answers:</strong> {question.answersCount || 0}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          question.status === "resolved"
                            ? "text-green-500"
                            : question.status === "under review"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }
                      >
                        {question.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-6">No questions available.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 bg-gray-100 p-4 rounded-lg text-center text-gray-500">
        <p className="mb-2">&copy; 2024 Q&A Hub. All rights reserved.</p>
        <div className="space-x-2">
          <Link to="/about" className="text-blue-500 hover:underline">
            About Us
          </Link>
          <span>•</span>
          <Link to="/contact" className="text-blue-500 hover:underline">
            Contact
          </Link>
          <span>•</span>
          <Link to="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default QuestionList;
