import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

const UnansweredQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiRequest("/questions");
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.message || "Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const unansweredQuestions = questions.filter(
    (question) => question.answersCount === 0
  );

  const getImageSrc = (images) => {
    if (!images?.length) {
      return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    }

    const imagePath = images[0];
    return imagePath.startsWith("http")
      ? imagePath
      : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${imagePath}`;
  };

  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    try {
      return new Date(dateField).toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Hero Section */}
      <div className="bg-blue-500 text-white p-6 rounded-lg text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Unanswered Questions</h1>
        <p className="text-lg">
          Explore questions waiting for your insights!
        </p>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 pr-4">
          <div className="bg-white p-4 shadow rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/category/general" className="text-blue-500 hover:underline">
                  General
                </Link>
              </li>
              <li>
                <Link to="/category/waste-management" className="text-blue-500 hover:underline">
                  Waste Management
                </Link>
              </li>
              <li>
                <Link to="/category/road-maintenance" className="text-blue-500 hover:underline">
                  Road Maintenance
                </Link>
              </li>
              <li>
                <Link to="/category/public-safety" className="text-blue-500 hover:underline">
                  Public Safety
                </Link>
              </li>
              <li>
                <Link to="/category/environmental" className="text-blue-500 hover:underline">
                  Environmental
                </Link>
              </li>
              <li>
                <Link to="/category/healthcare" className="text-blue-500 hover:underline">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link to="/category/education" className="text-blue-500 hover:underline">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/category/transportation" className="text-blue-500 hover:underline">
                  Transportation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Question Feed */}
        <div className="w-3/4">
          <h2 className="text-2xl font-semibold mb-4">Unanswered Questions</h2>
          {error ? (
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <p className="text-center text-gray-500">Loading unanswered questions...</p>
          ) : unansweredQuestions.length > 0 ? (
            <div className="space-y-4">
              {unansweredQuestions.map((question) => (
                <div
                  key={question._id}
                  className="bg-white p-4 shadow rounded-lg flex items-start"
                >
                  <img
                    src={getImageSrc(question.images)}
                    alt="Thumbnail"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <Link
                      to={`/questions/${question._id}`}
                      className="text-lg font-semibold text-blue-500 hover:underline"
                    >
                      {question.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {question.description.slice(0, 100)}...
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      <span>
                        <strong>Category:</strong> {question.category || "General"}
                      </span>{" "}
                      |{" "}
                      <span>
                        <strong>Created:</strong> {formatDate(question.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-6">
              No unanswered questions available.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 bg-gray-100 p-4 text-center text-gray-500">
        <p>&copy; 2024 Q&A Hub. All rights reserved.</p>
        <p>
          <Link to="/about" className="text-blue-500 hover:underline">
            About Us
          </Link>{" "}
          |{" "}
          <Link to="/contact" className="text-blue-500 hover:underline">
            Contact
          </Link>{" "}
          |{" "}
          <Link to="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default UnansweredQuestions;
