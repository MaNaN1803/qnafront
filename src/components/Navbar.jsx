import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { Moon, Sun } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await apiRequest('/auth/profile', 'GET', null, token);
        setUserRole(userData.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    if (token) {
      fetchUserRole();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const closeMobileMenu = () => setIsMenuOpen(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className={`${darkMode ? 'dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-200'} border-b shadow-md sticky top-0 z-50 transition-colors duration-300`}>
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <Link to="/" className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`} onClick={closeMobileMenu}>
          Municipal Q&A
        </Link>

        <div className="block lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${darkMode ? 'text-white' : 'text-gray-800'} focus:outline-none transition-colors duration-300`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`px-4 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors duration-300`}
            />
            <button
              type="submit"
              className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-black'} text-white rounded-r-md transition-colors duration-300`}
            >
              Search
            </button>
          </form>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-300`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {token && (
            <>
              <Link to="/submit-question" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}>
                Submit Question
              </Link>
              <Link to="/questions" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}>
                Questions
              </Link>
              <Link to="/questions/unanswered" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}>
                Unanswered
              </Link>
              
              {userRole === 'admin' && (
                <Link to="/admin" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}>
                  Admin Dashboard
                </Link>
              )}
              {userRole === 'moderator' && (
                <Link to="/moderator" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}>
                  Moderator Dashboard
                </Link>
              )}
              
              <Link to="/profile" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-black'} text-white rounded transition-colors duration-300`}
              >
                Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link to="/login" className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-black'} text-white rounded transition-colors duration-300`}>
                Login
              </Link>
              <Link to="/signup" className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-black'} text-white rounded transition-colors duration-300`}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} text-white px-6 py-4 transition-colors duration-300`}>
        <form onSubmit={handleSearch} className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-4 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-full text-black transition-colors duration-300`}
          />
          <button
            type="submit"
            className={`px-4 py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-800 hover:bg-black'} text-white rounded-r-md transition-colors duration-300`}
          >
            Search
          </button>
        </form>

        <button
          onClick={toggleDarkMode}
          className={`w-full p-2 mb-4 rounded ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'} flex items-center justify-center transition-colors duration-300`}
        >
          {darkMode ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {token && (
          <>
            <Link to="/submit-question" className="block text-white py-2 hover:bg-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
              Submit Question
            </Link>
            <Link to="/questions" className="block text-white py-2 hover:bg-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
              Questions
            </Link>
            <Link to="/questions/unanswered" className="block text-white py-2 hover:bg-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
              Unanswered
            </Link>
            
            {userRole === 'admin' && (
              <Link to="/admin" className="block text-white py-2 hover:bg-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
                Admin Dashboard
              </Link>
            )}
            {userRole === 'moderator' && (
              <Link to="/moderator" className="block text-white py-2 hover:bg-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
                Moderator Dashboard
              </Link>
            )}
            
            <Link to="/profile" className="block text-white py-2 hover:bg-gray-600 transition-colors duration-300" onClick={closeMobileMenu}>
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className={`block w-full text-white py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-300 mt-4`}
            >
              Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <Link to="/login" className={`block text-white py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-300`} onClick={closeMobileMenu}>
              Login
            </Link>
            <Link to="/signup" className={`block text-white py-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-300`} onClick={closeMobileMenu}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;