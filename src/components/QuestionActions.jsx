import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import QuestionReportModal from './QuestionReportModal';

const QuestionActions = ({ question, userRole }) => {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {userRole === 'moderator' || userRole === 'admin' ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center text-gray-600 hover:text-red-500"
          >
            <Flag className="w-4 h-4 mr-1" />
            Report
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center text-gray-600 hover:text-red-500"
        >
          <Flag className="w-4 h-4 mr-1" />
          Report
        </button>
      )}

      {showReportModal && (
        <QuestionReportModal
          questionId={question._id}
          onClose={() => setShowReportModal(false)}
          onReportSubmitted={() => {
            // Optionally refresh the question data
          }}
        />
      )}
    </div>
  );
};

export default QuestionActions;