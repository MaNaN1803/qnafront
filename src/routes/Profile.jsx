import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import ProfileHeader from '../components/ProfileHeader';
import ActivityTabs from '../components/ActivityTabs';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [activeTab, setActiveTab] = useState('questions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
  
        // Fetch user profile
        const profileData = await apiRequest('/auth/profile', 'GET', null, token);
        setProfile(profileData);
  
        // Fetch user's questions (filter by user ID)
        const questionsData = await apiRequest('/questions', 'GET', null, token, {
          params: { userId: profileData._id } // Pass the user's ID as a query parameter
        });
        setUserQuestions(questionsData);
  
        // Fetch user's answers
        const answersData = await apiRequest('/answers', 'GET', null, token, {
          params: { userId: profileData._id }
        });
        setUserAnswers(answersData || []);
  
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };
  
    fetchProfileData();
  }, [navigate]);

  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const stats = {
    questions: userQuestions.length,
    answers: userAnswers.length
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProfileHeader 
        profile={profile} 
        stats={stats} 
        formatDate={formatDate} 
      />
      <ActivityTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userQuestions={userQuestions}
        userAnswers={userAnswers}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Profile;