import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import ModeratorReportActions from './ModeratorReportActions';
import { Flag } from 'lucide-react';

const ReportedContent = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
        { action },
        token
      );
      fetchReports();
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
                <p className="text-sm text-gray-500 mt-1">{report.details}</p>
                <div className="mt-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm">
                    {report.contentType === 'question'
                      ? report.contentId?.title
                      : report.contentId?.content}
                  </p>
                </div>
              </div>
              <ModeratorReportActions onAction={handleReportAction} report={report} />
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
    </div>
  );
};

export default ReportedContent;