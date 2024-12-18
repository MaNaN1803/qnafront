import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { CheckCircle, Clock, AlertTriangle, BarChart2 } from 'lucide-react';

const ModeratorStats = () => {
  const [stats, setStats] = useState({
    totalModerated: 0,
    averageResponseTime: '0h',
    pendingItems: 0,
    resolutionRate: '0%',
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest('/moderator/stats', 'GET', null, token);
      setStats(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching moderator stats:', error);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <AlertTriangle className="text-red-400" size={24} />
          <p className="ml-3 text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Moderated</p>
              <p className="text-2xl font-bold">{stats.totalModerated}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Response</p>
              <p className="text-2xl font-bold">{stats.averageResponseTime}</p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Items</p>
              <p className="text-2xl font-bold">{stats.pendingItems}</p>
            </div>
            <AlertTriangle className="text-yellow-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolution Rate</p>
              <p className="text-2xl font-bold">{stats.resolutionRate}</p>
            </div>
            <BarChart2 className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start border-b pb-4 last:border-0">
                <div className="flex-shrink-0">
                  {activity.type === 'approval' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : activity.type === 'rejection' ? (
                    <AlertTriangle className="text-red-500" size={20} />
                  ) : (
                    <Clock className="text-blue-500" size={20} />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorStats;