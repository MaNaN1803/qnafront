import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { BarChart2, TrendingUp, Users, MessageSquare } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    dailyStats: [],
    userGrowth: [],
    contentMetrics: {},
    topCategories: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

 // Update the useEffect hook in Analytics.jsx
useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await apiRequest(`/admin/analytics?range=${timeRange}`, 'GET', null, token);
      setStats(response);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Users</p>
              <p className="text-2xl font-bold">{stats.contentMetrics.newUsers || 0}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-500">↑ 12%</span>
            <span className="text-sm text-gray-500"> vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Questions</p>
              <p className="text-2xl font-bold">{stats.contentMetrics.newQuestions || 0}</p>
            </div>
            <MessageSquare className="text-green-500" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-500">↑ 8%</span>
            <span className="text-sm text-gray-500"> vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolution Rate</p>
              <p className="text-2xl font-bold">{stats.contentMetrics.resolutionRate || '0%'}</p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-500">↑ 5%</span>
            <span className="text-sm text-gray-500"> vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-bold">{stats.contentMetrics.avgResponseTime || '0h'}</p>
            </div>
            <BarChart2 className="text-yellow-500" size={24} />
          </div>
          <div className="mt-2">
            <span className="text-sm text-red-500">↓ 2%</span>
            <span className="text-sm text-gray-500"> vs last period</span>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
        <div className="space-y-4">
          {stats.topCategories.map((category, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-gray-500">{category.count} questions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(category.count / Math.max(...stats.topCategories.map(c => c.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.dailyStats.map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {activity.type === 'user' ? (
                    <Users size={16} className="text-blue-500" />
                  ) : (
                    <MessageSquare size={16} className="text-blue-500" />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;