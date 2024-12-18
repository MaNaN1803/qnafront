import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const Navbar = () => {
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

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <Link to="/home" className="text-xl font-bold text-gray-800" onClick={closeMobileMenu}>
          Municipal Q&A
        </Link>

        <div className="block lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
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
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-black transition"
            >
              Search
            </button>
          </form>

          {token && (
            <>
              <Link to="/submit-question" className="text-gray-600 hover:text-black transition">
                Submit Question
              </Link>
              <Link to="/questions" className="text-gray-600 hover:text-black transition">
                Questions
              </Link>
              <Link to="/questions/unanswered" className="text-gray-600 hover:text-black transition">
                Unanswered
              </Link>
              
              {/* Role-specific navigation items */}
              {userRole === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-black transition">
                  Admin Dashboard
                </Link>
              )}
              {userRole === 'moderator' && (
                <Link to="/moderator" className="text-gray-600 hover:text-black transition">
                  Moderator Dashboard
                </Link>
              )}
              
              <Link to="/profile" className="text-gray-600 hover:text-black transition">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition"
              >
                Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link to="/login" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
      

      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-800 text-white px-6 py-4`}>
        <form onSubmit={handleSearch} className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-full text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-600 text-white rounded-r-md hover:bg-black transition"
          >
            Search
          </button>
        </form>

        {token && (
          <>
            <Link to="/submit-question" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Submit Question
            </Link>
            <Link to="/questions" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Questions
            </Link>
            <Link to="/questions/unanswered" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Unanswered
            </Link>
            
            {/* Role-specific mobile navigation items */}
            {userRole === 'admin' && (
              <Link to="/admin" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
                Admin Dashboard
              </Link>
            )}
            {userRole === 'moderator' && (
              <Link to="/moderator" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
                Moderator Dashboard
              </Link>
            )}
            
            <Link to="/profile" className="block text-white py-2 hover:bg-gray-600 transition" onClick={closeMobileMenu}>
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="block w-full text-white py-2 bg-gray-600 hover:bg-black transition mt-4"
            >
              Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <Link to="/login" className="block text-white py-2 bg-gray-600 hover:bg-black transition" onClick={closeMobileMenu}>
              Login
            </Link>
            <Link to="/signup" className="block text-white py-2 bg-gray-600 hover:bg-black transition" onClick={closeMobileMenu}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;