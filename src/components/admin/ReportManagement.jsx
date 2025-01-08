import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import ReportActions from './ReportActions';
import { Flag } from 'lucide-react';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, [page, filter]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest(
        `/admin/reports?page=${page}&status=${filter}`,
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
      await apiRequest(`/admin/reports/${reportId}`, 'PUT', { action }, token);
      fetchReports();
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold dark:text-white">Report Management</h2>
      <div className="flex items-center space-x-2">
        <Flag className="text-red-500" size={20} />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {reports.length} reports pending review
        </span>
      </div>
    </div>

    <div className="mb-4">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="all">All Reports</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
        <option value="flagged">Flagged by Moderators</option>
      </select>
    </div>

    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report._id} className="border dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold dark:text-white">
                  {report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Reported by: {report.reportedBy?.name}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{report.reason}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.details}</p>
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-sm dark:text-gray-300">
                  {report.contentType === 'question'
                    ? report.contentId?.title
                    : report.contentId?.content}
                </p>
              </div>
            </div>
            <ReportActions onAction={handleReportAction} report={report} />
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2 border dark:border-gray-700 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2 border dark:border-gray-700 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-white"
      >
        Next
      </button>
    </div>
  </div>
  );
};

export default ReportManagement;