import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Trash2 } from 'lucide-react';

const ReportActions = ({ onAction, report }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onAction(report._id, 'approve')}
        className="p-2 text-green-600 hover:bg-green-50 rounded"
        title="Approve"
      >
        <CheckCircle size={20} />
      </button>
      <button
        onClick={() => onAction(report._id, 'reject')}
        className="p-2 text-red-600 hover:bg-red-50 rounded"
        title="Reject"
      >
        <XCircle size={20} />
      </button>
      <button
        onClick={() => onAction(report._id, 'delete')}
        className="p-2 text-red-600 hover:bg-red-50 rounded"
        title="Delete Content"
      >
        <Trash2 size={20} />
      </button>
      <button
        onClick={() => onAction(report._id, 'warn')}
        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
        title="Warn User"
      >
        <AlertTriangle size={20} />
      </button>
    </div>
  );
};

export default ReportActions;