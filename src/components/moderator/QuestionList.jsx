import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { CheckCircle, XCircle, AlertTriangle, Flag } from 'lucide-react';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest(`/moderator/questions?page=${page}`, 'GET', null, token);
      setQuestions(response.questions);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleStatusChange = async (questionId, status) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(`/moderator/questions/${questionId}/status`, 'PUT', { status }, token);
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question status:', error);
    }
  };

  const handleReport = async (questionId) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest('/reports', 'POST', {
        contentId: questionId,
        contentType: 'question',
        reason: 'Flagged by moderator',
        details: 'This question requires admin review'
      }, token);
      alert('Question reported to admin');
    } catch (error) {
      console.error('Error reporting question:', error);
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{question.title}</h3>
              <p className="text-sm text-gray-600">{question.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Category: {question.category} | Status: {question.status}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange(question._id, 'resolved')}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Mark as Resolved"
              >
                <CheckCircle size={20} />
              </button>
              <button
                onClick={() => handleStatusChange(question._id, 'rejected')}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Reject"
              >
                <XCircle size={20} />
              </button>
              <button
                onClick={() => handleReport(question._id)}
                className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                title="Report to Admin"
              >
                <Flag size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuestionList;