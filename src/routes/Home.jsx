import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { toast } from "react-toastify";
import { Menu, ThumbsUp, ThumbsDown, Map as MapIcon, List } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await apiRequest('/admin/categories', 'GET', null, token);
        setCategories(data.map(category => category.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        setCategories([
          "Waste Management", "Road Maintenance", "Public Safety", "Water Supply",
          "Sanitation", "Electricity", "Garbage Collection", "Colony Issue",
          "Public Transport", "Public Health", "Pollution", "Other",
        ]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const query = categoryParam ? `?category=${categoryParam}` : "";
        const data = await apiRequest(`/questions${query}`);
        const sortedQuestions = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setQuestions(sortedQuestions);
        toast.success("Questions loaded successfully!", { autoClose: 2000 });
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions. Please try again later.", {
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryParam]);

  const getImageSrc = (images) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  };

  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    try {
      return new Date(dateField).toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCategoryClick = (category) => {
    setSearchParams({ category });
    toast.info(`Category changed to: ${category}`, { autoClose: 1500 });
  };

  const handleVote = async (questionId, voteType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to vote');
        navigate('/login');
        return;
      }

      const response = await apiRequest(
        `/questions/${questionId}/vote`,
        'PUT',
        { vote: voteType },
        token
      );

      if (response) {
        setQuestions(prevQuestions =>
          prevQuestions.map(q =>
            q._id === questionId ? { ...q, votes: response.votes } : q
          )
        );
        toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully!`);
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to vote. Please try again.';
      if (errorMessage.includes('already voted')) {
        toast.warning('You have already voted on this question');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const getMarkerPosition = (gpsLocation) => {
    try {
      const [lat, lng] = gpsLocation.split(',').map(Number);
      return [lat, lng];
    } catch {
      return null;
    }
  };

  const QuestionCard = ({ question, inPopup = false }) => (
    <div className={`${inPopup ? 'max-w-xs' : 'bg-white dark:bg-gray-800 p-4 shadow rounded-lg flex flex-col sm:flex-row items-start gap-4 transition-colors duration-300 hover:shadow-lg'}`}>
      {!inPopup && (
        <img
          src={getImageSrc(question.images)}
          alt="Question thumbnail"
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400"
          loading="lazy"
        />
      )}
      <div className="flex-grow space-y-2">
        <Link
          to={`/questions/${question._id}`}
          className="text-base sm:text-lg font-semibold text-blue-500 dark:text-blue-400 hover:underline block transition-colors duration-300"
        >
          {question.title}
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {question.description.slice(0, 100)}...
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span><strong>Category:</strong> {question.category || "General"}</span>
          {!inPopup && (
            <>
              <span className="hidden sm:inline">•</span>
              <span><strong>Created:</strong> {formatDate(question.createdAt)}</span>
              <span className="hidden sm:inline">•</span>
              <span><strong>Views:</strong> {question.views || 0}</span>
              <span className="hidden sm:inline">•</span>
              <span>
                          <strong>Posted by:</strong> {question.user?.name || "Anonymous"}
                        </span>
            </>
          )}
        </div>
      </div>
      {!inPopup && (
        <>
          <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:text-right gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Answers:</strong> {question.answersCount || 0}
            </p>
            <p className="text-sm dark:text-gray-300">
              <strong>Status:</strong>{" "}
              <span className={`${
                question.status === "resolved"
                  ? "text-green-500 dark:text-green-400"
                  : question.status === "under review"
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-red-500 dark:text-red-400"
              }`}>
                {question.status}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleVote(question._id, 'up')}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Upvote"
            >
              <ThumbsUp className={`h-4 w-4 ${
                question.voters?.some(v => v.user === localStorage.getItem('userId') && v.vote === 1)
                  ? 'text-green-500'
                  : 'text-gray-500'
              }`} />
              <span className="text-sm font-medium">{question.votes || 0}</span>
            </button>
            <button
              onClick={() => handleVote(question._id, 'down')}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Downvote"
            >
              <ThumbsDown className={`h-4 w-4 ${
                question.voters?.some(v => v.user === localStorage.getItem('userId') && v.vote === -1)
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`} />
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        {/* Hero Section */}
        <div className="bg-blue-500 dark:bg-blue-600 text-white p-4 sm:p-6 rounded-lg text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Welcome to Q&A Hub</h1>
          <p className="text-sm sm:text-lg">
            Discover answers, ask questions, and connect with the community.
          </p>
          <Link
            to="/submit-question"
            className="mt-3 sm:mt-4 inline-block bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-300 px-4 sm:px-6 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-sm sm:text-base"
          >
            Ask a Question
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className={`lg:w-1/4 ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
            <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg mb-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="text-blue-500 dark:text-blue-400 hover:underline block py-1 w-full text-left"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold dark:text-white">
                {categoryParam ? `${categoryParam} Questions` : "Latest Questions"}
              </h2>
              
              {/* View Toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  transition-all duration-300
                  ${showMap ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                  hover:bg-blue-600 hover:text-white
                `}
              >
                {showMap ? (
                  <>
                    <List className="w-4 h-4" />
                    <span>Show List</span>
                  </>
                ) : (
                  <>
                    <MapIcon className="w-4 h-4" />
                    <span>Show Map</span>
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Loading questions...</p>
            ) : questions.length > 0 ? (
              showMap ? (
                <div className="w-full h-[70vh] rounded-lg overflow-hidden shadow-lg bg-white">
                  <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    className="w-full h-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <MarkerClusterGroup
                      chunkedLoading
                      iconCreateFunction={(cluster) => {
                        return L.divIcon({
                          html: `<div class="bg-blue-500 bg-opacity-80 text-white rounded-full flex items-center justify-center font-bold" style="width: 30px; height: 30px;">${cluster.getChildCount()}</div>`,
                          className: 'custom-marker-cluster',
                          iconSize: L.point(30, 30)
                        });
                      }}
                    >
                      {questions.map((question) => {
                        const position = getMarkerPosition(question.gpsLocation);
                        if (!position) return null;

                        return (
                          <Marker key={question._id} position={position}>
                            <Popup>
                              <QuestionCard question={question} inPopup={true} />
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MarkerClusterGroup>
                  </MapContainer>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center mt-6">
                No questions available.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center text-gray-500 dark:text-gray-400 text-sm">
          <p className="mb-2">&copy; 2024 Q&A Hub. All rights reserved.</p>
          <div className="space-x-2">
            <Link to="/about" className="text-blue-500 dark:text-blue-400 hover:underline">About Us</Link>
            <span>•</span>
            <Link to="/contact" className="text-blue-500 dark:text-blue-400 hover:underline">Contact</Link>
            <span>•</span>
            <Link to="/privacy" className="text-blue-500 dark:text-blue-400 hover:underline">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;