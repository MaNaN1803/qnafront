import React from 'react';
import { UserCircle, Mail, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ profile, stats, formatDate }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <UserCircle size={64} className="text-gray-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile?.name}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
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
              <p className="text-2xl font-bold text-gray-900">{stats.questions}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.answers}</p>
              <p className="text-sm text-gray-600">Answers</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/settings')} 
          className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Settings size={16} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;