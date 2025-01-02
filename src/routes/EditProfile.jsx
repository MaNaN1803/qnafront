import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';

registerPlugin(FilePondPluginImagePreview);

const EditProfile = ({ darkMode, setDarkMode }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '', // Ensure password has an empty string as initial value
  });
  const [profilePicture, setProfilePicture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profileData = await apiRequest('/auth/profile', 'GET', null, token);
        setProfile({ name: profileData.name, email: profileData.email, password: '' }); // Set default password as empty string
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      if (profile.password) formData.append('password', profile.password);
      if (profilePicture.length > 0) formData.append('profilePicture', profilePicture[0].file);
  
      console.log([...formData.entries()]); // Debugging: Log data before sending
  
      const response = await apiRequest('/auth/profile', 'PUT', formData, token, true);
  
      // Update profile state with response data
      setProfile({
        name: response.user.name,
        email: response.user.email,
        password: '', // Clear the password field
      });
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err.message);
      setError('Failed to update profile. Please try again.');
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };
  

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div
      className={`max-w-xl mx-auto p-6 transition-all ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <ToastContainer />
      <div className={`p-6 rounded shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ''} // Ensure value is always a string
              onChange={handleChange}
              className={`w-full border rounded p-2 focus:outline-none focus:ring ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'
              }`}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ''} // Ensure value is always a string
              onChange={handleChange}
              className={`w-full border rounded p-2 focus:outline-none focus:ring ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'
              }`}
              required
            />
          </div>
          <div>
            <label className="block font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={profile.password || ''} // Ensure password is always a string
              onChange={handleChange}
              className={`w-full border rounded p-2 focus:outline-none focus:ring ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'
              }`}
            />
          </div>
          <div>
            <label className="block font-medium">Profile Picture</label>
            <FilePond
              files={profilePicture}
              onupdatefiles={setProfilePicture}
              allowMultiple={false}
              maxFiles={1}
              name="profilePicture"
              labelIdle="Drag & Drop your profile picture or <span class='filepond--label-action'>Browse</span>"
              className={`focus:outline-none focus:ring ${darkMode ? 'text-white' : 'text-gray-900'}`}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded font-medium ${
              submitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
