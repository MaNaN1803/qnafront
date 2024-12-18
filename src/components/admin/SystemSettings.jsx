import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { Save, RefreshCw } from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    questionModeration: false,
    autoFlagThreshold: 3,
    userReputationThreshold: 50,
    allowAnonymousReports: true,
    moderationCategories: [],
    notificationSettings: {
      emailNotifications: true,
      adminAlerts: true,
      moderatorAlerts: true
    },
    contentFilters: {
      enabled: true,
      keywords: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);


const fetchSettings = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await apiRequest('/admin/settings', 'GET', null, token);
    if (response) {
      setSettings(response);
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching settings:', error);
    setMessage('Error loading settings');
  }
};

const handleSave = async () => {
  try {
    setSaving(true);
    const token = localStorage.getItem('token');
    await apiRequest('/admin/settings', 'PUT', settings, token);
    setMessage('Settings saved successfully');
    setTimeout(() => setMessage(''), 3000);
  } catch (error) {
    console.error('Error saving settings:', error);
    setMessage('Error saving settings');
  } finally {
    setSaving(false);
  }
};

  const handleChange = (section, key, value) => {
    if (section) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Enable Question Moderation
            </label>
            <input
              type="checkbox"
              checked={settings.questionModeration}
              onChange={(e) => handleChange(null, 'questionModeration', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Auto-Flag Threshold
            </label>
            <input
              type="number"
              value={settings.autoFlagThreshold}
              onChange={(e) => handleChange(null, 'autoFlagThreshold', parseInt(e.target.value))}
              className="border rounded-md p-2 w-24"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              User Reputation Threshold
            </label>
            <input
              type="number"
              value={settings.userReputationThreshold}
              onChange={(e) => handleChange(null, 'userReputationThreshold', parseInt(e.target.value))}
              className="border rounded-md p-2 w-24"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Email Notifications
            </label>
            <input
              type="checkbox"
              checked={settings.notificationSettings.emailNotifications}
              onChange={(e) => handleChange('notificationSettings', 'emailNotifications', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Admin Alerts
            </label>
            <input
              type="checkbox"
              checked={settings.notificationSettings.adminAlerts}
              onChange={(e) => handleChange('notificationSettings', 'adminAlerts', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Moderator Alerts
            </label>
            <input
              type="checkbox"
              checked={settings.notificationSettings.moderatorAlerts}
              onChange={(e) => handleChange('notificationSettings', 'moderatorAlerts', e.target.checked)}
              className="toggle"
            />
          </div>
        </div>
      </div>

      {/* Content Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Content Filters</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Enable Content Filters
            </label>
            <input
              type="checkbox"
              checked={settings.contentFilters.enabled}
              onChange={(e) => handleChange('contentFilters', 'enabled', e.target.checked)}
              className="toggle"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              Filtered Keywords
            </label>
            <textarea
              value={settings.contentFilters.keywords.join('\n')}
              onChange={(e) => handleChange('contentFilters', 'keywords', e.target.value.split('\n'))}
              className="border rounded-md p-2 w-full h-32"
              placeholder="Enter keywords (one per line)"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;