import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';

const ContentModeration = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest('/admin/questions/resolved', 'GET', null, token, {
        params: { page, limit },
      });
      setQuestions(response?.questions || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setError('Authentication required');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await apiRequest(`/admin/questions/${id}`, 'DELETE', null, token);
      
      // Update UI on successful deletion
      setSuccess(result.message || 'Question deleted successfully');
      setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== id));
      
      // Handle pagination when deleting the last item on a page
      if (questions.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete the question');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchQuestions();
  }, [page]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Content Moderation</h2>
      <p className="mb-4">Manage resolved questions and their associated answers.</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{success}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question ID
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.map((question) => (
                <tr key={question._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {question._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => deleteQuestion(question._id)}
                      disabled={loading}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    No questions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={questions.length < limit || loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;