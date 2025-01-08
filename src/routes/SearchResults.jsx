import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await apiRequest(`/search?q=${query}`, "GET", null, token);
        setResults(response);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

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

  const handleVote = async (questionId, voteType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to vote');
        navigate('/login');
        return;
      }

      const response = await apiRequest(
        `/questions/${questionId}/vote`,
        'PUT',
        { vote: voteType },
        token
      );

      if (response) {
        setResults(prevResults =>
          prevResults.map(q =>
            q._id === questionId ? { ...q, votes: response.votes } : q
          )
        );
        toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully!`);
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to vote. Please try again.';
      if (errorMessage.includes('already voted')) {
        toast.warning('You have already voted on this question');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="bg-blue-500 dark:bg-blue-600 text-white p-4 sm:p-6 rounded-lg text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            Search Results for: <span className="text-gray-100">{query}</span>
          </h1>
          <p className="text-sm sm:text-lg">
            Found {results.length} results matching your search
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading results...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((question) => (
              <div key={question._id} className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg flex flex-col sm:flex-row items-start gap-4 transition-colors duration-300 hover:shadow-lg">
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
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span><strong>Category:</strong> {question.category || "General"}</span>
                    <span className="hidden sm:inline">•</span>
                    <span><strong>Created:</strong> {formatDate(question.createdAt)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span><strong>Views:</strong> {question.views || 0}</span>
                    <span className="hidden sm:inline">•</span>
                    <span><strong>Posted by:</strong> {question.user?.name || "Anonymous"}</span>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:text-right gap-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Answers:</strong> {question.answersCount || 0}
                  </p>
                  <p className="text-sm dark:text-gray-300">
                    <strong>Status:</strong>{" "}
                    <span className={`${
                      question.status === "resolved"
                        ? "text-green-500 dark:text-green-400"
                        : question.status === "under review"
                        ? "text-yellow-500 dark:text-yellow-400"
                        : "text-red-500 dark:text-red-400"
                    }`}>
                      {question.status}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => handleVote(question._id, 'up')}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Upvote"
                  >
                    <ThumbsUp className={`h-4 w-4 ${
                      question.voters?.some(v => v.user === localStorage.getItem('userId') && v.vote === 1)
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`} />
                    <span className="text-sm font-medium">{question.votes || 0}</span>
                  </button>
                  <button
                    onClick={() => handleVote(question._id, 'down')}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Downvote"
                  >
                    <ThumbsDown className={`h-4 w-4 ${
                      question.voters?.some(v => v.user === localStorage.getItem('userId') && v.vote === -1)
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No results found for your search.</p>
            <Link
              to="/"
              className="mt-4 inline-block text-blue-500 dark:text-blue-400 hover:underline"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;