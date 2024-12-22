import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const AnswerQuestion = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const navigate = useNavigate();

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

  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    try {
      return new Date(dateField).toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  const getImageSrc = (images) => {
    if (images && images[0] && images[0].startsWith("http")) {
      return images[0];
    }
    if (images && images[0]) {
      return `http://localhost:5000/${images[0]}`;
    }
    return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  };

  const navigateToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 p-6 bg-gray-100 shadow-xl rounded-lg text-gray-900">
      {error && <p className="text-red-500 text-center font-medium">{error}</p>}

      {/* Question Card */}
      <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-300">
        {/* Status */}
        <span
          className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
            question.status === "resolved"
              ? "bg-green-100 text-green-800"
              : question.status === "under review"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {question.status}
        </span>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">{question.title}</h1>

        {/* Description */}
        <div className="space-y-4">
          <p
            className={`text-lg leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}
          >
            <strong className="block text-gray-600 mb-2">Description:</strong>
            {question.description}
          </p>
          {!isDescriptionExpanded && question.description?.length > 200 && (
            <button
              onClick={() => setIsDescriptionExpanded(true)}
              className="text-blue-600 text-sm hover:underline focus:outline-none"
            >
              View Full Description
            </button>
          )}
        </div>

        {/* Other Details */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <p>
            <strong className="text-gray-600">Category:</strong> {question.category || "General"}
          </p>
          <p>
            <strong className="text-gray-600">Location:</strong>{' '}
            <a
              href={`https://www.google.com/maps?q=${question.gpsLocation}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on Google Maps
            </a>
          </p>
          <p>
            <strong className="text-gray-600">Created At:</strong> {formatDate(question.createdAt)}
          </p>
          <p>
            <strong className="text-gray-600">Attempts:</strong> {question.attempts || "No attempts yet"}
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <img
            src={getImageSrc(question.images)}
            alt={question.title}
            className="w-64 h-40 object-cover rounded-lg border border-gray-300 shadow-md"
          />
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
        <label htmlFor="answerContent" className="block text-lg font-semibold mb-2 text-gray-800">
          Your Answer
        </label>
        <textarea
          id="answerContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          placeholder="Write your answer here..."
          className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm text-gray-800"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 focus:outline-none transition duration-200"
        >
          Submit Answer
        </button>
      </form>

      {/* Answers Section */}
      <h2 className="mt-8 text-2xl font-bold text-gray-800">Answers</h2>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <div
            key={answer._id}
            className="flex items-start p-4 mt-4 bg-white rounded-lg shadow-md border border-gray-300"
          >
            <img
              src={answer.user?.profileImage || 'https://via.placeholder.com/50'}
              alt={answer.user?.name}
              className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"
            />
            <div>
              <p className="text-gray-800 text-sm">{answer.content}</p>
              <p
                className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline"
                onClick={() => navigateToUserProfile(answer.user?._id)}
              >
                By: {answer.user?.name || 'Anonymous'}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 mt-4">No answers yet. Be the first to answer!</p>
      )}
    </div>
  );
};

export default AnswerQuestion;
