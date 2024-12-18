import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/submit-question"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <SubmitQuestion />
                </PrivateRoute>
              }
            />
            <Route
              path="/questions"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <QuestionList />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <SearchResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/questions/unanswered"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <UnansweredQuestions />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/questions/:id"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <AnswerQuestion />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/moderator"
              element={
                <PrivateRoute>
                  {isAuthenticated && <Navbar />}
                  <ModeratorDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;