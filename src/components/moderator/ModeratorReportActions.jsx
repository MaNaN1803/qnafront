import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ModeratorReportActions = ({ onAction, report }) => {
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
        onClick={() => onAction(report._id, 'flag')}
        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
        title="Flag for Admin Review"
      >
        <AlertTriangle size={20} />
      </button>
    </div>
  );
};

export default ModeratorReportActions;