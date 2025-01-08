import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Trash2 } from 'lucide-react';

const ReportActions = ({ onAction, report }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onAction(report._id, 'approve')}
        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
        title="Approve"
      >
        <CheckCircle size={20} />
      </button>
      <button
        onClick={() => onAction(report._id, 'reject')}
        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        title="Reject"
      >
        <XCircle size={20} />
      </button>
      <button
        onClick={() => onAction(report._id, 'delete')}
        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        title="Delete Content"
      >
        <Trash2 size={20} />
      </button>
      <button
        onClick={() => onAction(report._id, 'warn')}
        className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
        title="Warn User"
      >
        <AlertTriangle size={20} />
      </button>
    </div>
  );
};

export default ReportActions;