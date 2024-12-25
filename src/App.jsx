import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import SubmitQuestion from './routes/SubmitQuestion';
import QuestionList from './routes/QuestionList';
import Profile from './routes/Profile';
import Navbar from './components/Navbar';
import SearchResults from './routes/SearchResults';
import AnswerQuestion from './routes/AnswerQuestion';
import UnansweredQuestions from './routes/UnansweredQuestions';
import AdminDashboard from './routes/AdminDashboard';
import ModeratorDashboard from './routes/ModeratorDashboard';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isAuthenticated = !!localStorage.getItem('token');
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-100 text-black'}`}>
      {!isAuthPage && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      <div className="container mx-auto py-6 px-4">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <Login />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <Signup />
            } 
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-question"
            element={
              <PrivateRoute>
                <SubmitQuestion />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions"
            element={
              <PrivateRoute>
                <QuestionList />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions/unanswered"
            element={
              <PrivateRoute>
                <UnansweredQuestions />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <PrivateRoute>
                <AnswerQuestion />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/moderator"
            element={
              <PrivateRoute>
                <ModeratorDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;