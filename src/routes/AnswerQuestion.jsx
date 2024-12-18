import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate here
import { apiRequest } from '../utils/api';

const AnswerQuestion = () => {
  const { id } = useParams(); // Question ID
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const questionData = await apiRequest(`/questions/${id}`, 'GET');
        const answerData = await apiRequest(`/answers/${id}`, 'GET');
        setQuestion(questionData);
        setAnswers(answerData);
      } catch (err) {
        setError('Error fetching data');
      }
    };
    fetchQuestionAndAnswers();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newAnswer = await apiRequest(
        '/answers',
        'POST',
        { content, questionId: id },
        token
      );
      setAnswers([newAnswer, ...answers]);
      setContent('');
    } catch (err) {
      setError('Error submitting answer');
    }
  };

  // Function to format date
  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    try {
      return new Date(dateField).toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  // Function to get image src
  const getImageSrc = (images) => {
    if (images && images[0] && images[0].startsWith("http")) {
      return images[0];
    }
    if (images && images[0]) {
      return `http://localhost:5000/${images[0]}`;
    }
    return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  };

  // Navigate to the user's profile page when the username is clicked
  const navigateToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Question Details Section */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-5xl text-center font-bold text-gray-800 mb-4">Question Details</h3>

        {/* Title with Label */}
        <div className="space-y-2">
          <label className="block text-gray-600 font-medium">Title:</label>
          <h1 className="text-3xl font-bold text-gray-800 text-left">{question.title}</h1>
        </div>

        {/* Description with Label and Expand Option */}
        <div className="space-y-2 mt-4">
          <label className="block text-gray-600 font-medium">Description:</label>
          <p
            className={`text-lg text-gray-700 ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}
          >
            {question.description}
          </p>
          {!isDescriptionExpanded && question.description?.length > 200 && (
            <button
              onClick={() => setIsDescriptionExpanded(true)}
              className="text-blue-600 text-sm mt-2 hover:underline hover:bg-white"
            >
              Click to view full description
            </button>
          )}
        </div>

        {/* Other Question Details */}
        <div className="space-y-2 mt-4">
          <div>
            <strong className="text-gray-600">Category:</strong> {question.category || "General"}
          </div>
          <div>
            <strong className="text-gray-600">Status:</strong>
            <span
              className={`${
                question.status === "resolved"
                  ? "text-green-600"
                  : question.status === "under review"
                  ? "text-yellow-500"
                  : "text-red-600"
              }`}
            >
              {question.status}
            </span>
          </div>
          <div>
            <strong className="text-gray-600">Location:</strong> {question.gpsLocation || "Not provided"}
          </div>
          <div>
            <strong className="text-gray-600">Created At:</strong> {formatDate(question.createdAt)}
          </div>
          <div>
            <strong className="text-gray-600">Image:</strong>
            <img src={getImageSrc(question.images)} alt={question.title} className="w-40 mt-2" />
          </div>
          {/* Displaying Attempts */}
          <div>
            <strong className="text-gray-600">Attempts:</strong> {question.attempts || "No attempts yet"}
          </div>
        </div>
      </div>

      {/* Answer Form Section */}
      <form onSubmit={handleSubmit} className="mt-6">
        <label htmlFor="answerContent" className="block text-lg font-medium text-gray-700 mb-2">Your Answer</label>
        <textarea
          id="answerContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          placeholder="Write your answer here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Submit Answer
        </button>
      </form>

      {/* Displaying Answers */}
      <h2 className="mt-6 text-xl font-semibold text-gray-800">Answers</h2>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <div key={answer._id} className="p-4 border-b mt-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{answer.content}</p>
            <p
              className="text-sm text-gray-500 mt-2 cursor-pointer"
              onClick={() => navigateToUserProfile(answer.user?._id)}
            >
              By: {answer.user?.name}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 mt-4">No answers yet. Be the first to answer!</p>
      )}
    </div>
  );
};

export default AnswerQuestion;
