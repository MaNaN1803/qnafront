import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { CheckCircle, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';

const QuestionModeration = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [moderationNote, setModerationNote] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await apiRequest(
        `/moderator/review-queue?page=${page}`,
        'GET',
        null,
        token
      );
      setQuestions(response.questions);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions for review');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (questionId, status) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(
        `/moderator/questions/${questionId}/moderate`,
        'PUT',
        { status, moderationNote },
        token
      );
      await fetchQuestions();
      setSelectedQuestion(null);
      setModerationNote('');
    } catch (error) {
      console.error('Error moderating question:', error);
      setError('Failed to update question status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <AlertTriangle className="text-red-400" size={24} />
          <p className="ml-3 text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Question Moderation</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {questions.length} questions pending review
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{question.title}</h3>
                <p className="text-gray-600 mt-2">{question.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">
                    Category: {question.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    Posted by: {question.user?.name}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleModeration(question._id, 'resolved')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={() => handleModeration(question._id, 'rejected')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <XCircle size={20} />
                </button>
                <button
                  onClick={() => setSelectedQuestion(question)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Moderation Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Add Moderation Note</h3>
            <textarea
              value={moderationNote}
              onChange={(e) => setModerationNote(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              rows="4"
              placeholder="Enter moderation note..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  setModerationNote('');
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleModeration(selectedQuestion._id, 'resolved')}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Approve
              </button>
              <button
                onClick={() => handleModeration(selectedQuestion._id, 'rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionModeration;
