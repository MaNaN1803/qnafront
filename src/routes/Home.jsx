import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await apiRequest("/questions");
        const sortedQuestions = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setQuestions(sortedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const getImageSrc = (images) => {
    if (images && images[0] && images[0].startsWith("http")) {
      return images[0];
    }
    if (images && images[0]) {
      return `http://localhost:5000/${images[0]}`;
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

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Hero Section */}
      <div className="bg-blue-500 text-white p-6 rounded-lg text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Q&A Hub</h1>
        <p className="text-lg">
          Discover answers, ask questions, and connect with the community.
        </p>
        <Link
          to="/submit-question"
          className="mt-4 inline-block bg-white text-blue-500 px-6 py-2 rounded hover:bg-gray-200 transition"
        >
          Ask a Question
        </Link>
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
              {/* Add more categories */}
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
              <li>
                <Link to="/category/energy" className="text-blue-500 hover:underline">
                  Energy
                </Link>
              </li>
              <li>
                <Link to="/category/sustainability" className="text-blue-500 hover:underline">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/category/community" className="text-blue-500 hover:underline">
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Question Feed */}
        <div className="w-3/4">
          <h2 className="text-2xl font-semibold mb-4">Latest Questions</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading questions...</p>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question._id}
                  className="bg-white p-4 shadow rounded-lg flex items-start"
                >
                  {/* Thumbnail */}
                  <img
                    src={getImageSrc(question.images)}
                    alt="Thumbnail"
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    {/* Question Title */}
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
                      |{" "}
    <span>
      <strong>Posted by:</strong> {question.user?.name || "Anonymous"}
    </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-right ml-4">
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

export default Home;
