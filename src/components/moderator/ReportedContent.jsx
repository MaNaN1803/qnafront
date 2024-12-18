import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Flag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ReportedContent = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [moderationNote, setModerationNote] = useState('');

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest(
        `/moderator/reported-content?page=${page}`,
        'GET',
        null,
        token
      );
      setReports(response.reports);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      const token = localStorage.getItem('token');
      await apiRequest(
        `/moderator/reports/${reportId}/moderate`,
        'PUT',
        { action, moderationNote },
        token
      );
      fetchReports();
      setSelectedReport(null);
      setModerationNote('');
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reported Content</h2>
        <div className="flex items-center space-x-2">
          <Flag className="text-red-500" size={20} />
          <span className="text-sm text-gray-500">
            {reports.length} reports pending review
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">
                    {report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Reported by: {report.reportedBy?.name}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{report.reason}</p>
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm">
                    {report.contentType === 'question'
                      ? report.contentId?.title
                      : report.contentId?.content}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReportAction(report._id, 'approve')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={() => handleReportAction(report._id, 'reject')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <XCircle size={20} />
                </button>
                <button
                  onClick={() => setSelectedReport(report)}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                >
                  <AlertTriangle size={20} />
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
      {selectedReport && (
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
                  setSelectedReport(null);
                  setModerationNote('');
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReportAction(selectedReport._id, 'warning')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md"
              >
                Issue Warning
              </button>
              <button
                onClick={() => handleReportAction(selectedReport._id, 'remove')}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Remove Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedContent;