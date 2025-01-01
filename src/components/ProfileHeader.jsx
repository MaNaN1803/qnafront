import React from 'react';
import { UserCircle, Mail, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ profile, stats, formatDate }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-gray-800">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center dark:bg-gray-700">
          <UserCircle size={64} className="text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">{profile?.name}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Joined {formatDate(profile?.createdAt || new Date())}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.questions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.answers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Answers</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/edit-profile')}
          className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Settings size={16} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
