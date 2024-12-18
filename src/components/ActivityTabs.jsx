import React from 'react';
import { HelpCircle, MessageSquare, Award } from 'lucide-react';

const ActivityTabs = ({ activeTab, setActiveTab, userQuestions, userAnswers, formatDate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b">
        <nav className="flex gap-4 px-6">
          <button
            className={`py-4 px-2 font-medium border-b-2 ${
              activeTab === 'questions'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('questions')}
          >
            <div className="flex items-center gap-2">
              <HelpCircle size={16} />
              <span>Questions</span>
            </div>
          </button>
          <button
            className={`py-4 px-2 font-medium border-b-2 ${
              activeTab === 'answers'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('answers')}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Answers</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'questions' ? (
          <QuestionsList questions={userQuestions} formatDate={formatDate} />
        ) : (
          <AnswersList answers={userAnswers} formatDate={formatDate} />
        )}
      </div>
    </div>
  );
};

const QuestionsList = ({ questions, formatDate }) => (
  <div className="space-y-6">
    {questions.length > 0 ? (
      questions.map((question) => (
        <div key={question._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">
            <a href={`/questions/${question._id}`} className="hover:text-gray-600">
              {question.title}
            </a>
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{question.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{formatDate(question.createdAt)}</span>
            <span>{question.category}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              question.status === 'resolved' 
                ? 'bg-green-100 text-green-800'
                : question.status === 'under review'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {question.status}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 py-8">No questions asked yet.</p>
    )}
  </div>
);

const AnswersList = ({ answers, formatDate }) => (
  <div className="space-y-6">
    {answers.length > 0 ? (
      answers.map((answer) => (
        <div key={answer._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <p className="text-gray-600 mb-4">{answer.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{formatDate(answer.createdAt)}</span>
            <div className="flex items-center gap-1">
              <Award size={16} />
              <span>{answer.votes} votes</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 py-8">No answers provided yet.</p>
    )}
  </div>
);

export default ActivityTabs;