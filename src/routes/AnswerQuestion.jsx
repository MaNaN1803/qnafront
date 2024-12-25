import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import QuestionActions from "../components/QuestionActions";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp,
  Share2,
  Bookmark,
  AlertCircle,
  Award,
  Eye
} from 'lucide-react';

const AnswerQuestion = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [helpfulAnswers, setHelpfulAnswers] = useState(new Set());
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const questionData = await apiRequest(`/questions/${id}`, "GET");
        const answerData = await apiRequest(`/answers/${id}`, "GET");
        setQuestion(questionData);
        setAnswers(answerData);
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await apiRequest("/auth/profile", "GET", null, token);
          setUser(userData);
        }
      } catch (err) {
        setError("Error fetching data");
      }
    };
    fetchQuestionAndAnswers();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Answer cannot be empty");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const newAnswer = await apiRequest(
        "/answers",
        "POST",
        { content, questionId: id },
        token
      );
      setAnswers([newAnswer, ...answers]);
      setContent("");
      setError("");
    } catch (err) {
      setError("Error submitting answer");
    }
  };

  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    try {
      const date = new Date(dateField);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return "Invalid date";
    }
  };

  const navigateToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'under review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: question.title,
        text: question.description,
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleHelpful = (answerId) => {
    setHelpfulAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(answerId)) {
        newSet.delete(answerId);
      } else {
        newSet.add(answerId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Question Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all hover:shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(question.status)} border shadow-sm`}>
                  {question.status?.toUpperCase()}
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  {question.views || 0} views
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <QuestionActions question={question} userRole={user?.role} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {question.title}
              </h1>
              <div className="flex items-center space-x-4">
                <img
                  src={question.user?.profileImage || "https://t4.ftcdn.net/jpg/06/84/44/27/360_F_684442786_I7KBvpQdJWSNpol3j0pUVeEiOcB8nDss.jpg"}
                  alt={question.user?.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
                <div>
                  <button
                    onClick={() => navigateToUserProfile(question.user?._id)}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {question.user?.name || "Anonymous"}
                  </button>
                  <p className="text-xs text-gray-500">
                    Posted {formatDate(question.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div className="prose max-w-none">
                <div className={`text-gray-600 ${!isDescriptionExpanded && 'line-clamp-3'}`}>
                  {question.description}
                </div>
                {question.description?.length > 200 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center text-blue-600 hover:text-blue-700 mt-2 text-sm font-medium"
                  >
                    {isDescriptionExpanded ? (
                      <>Show less <ChevronUp className="ml-1 w-4 h-4" /></>
                    ) : (
                      <>Read more <ChevronDown className="ml-1 w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>

              {/* Image Carousel */}
              {question.images?.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
                  <Carousel
                    showThumbs={false}
                    dynamicHeight={true}
                    infiniteLoop={true}
                    autoPlay={true}
                    showStatus={false}
                    className="carousel-container"
                    showArrows={true}
                    swipeable={true}
                  >
                    {question.images.map((image, index) => (
                      <div key={index} className="aspect-w-16 aspect-h-9">
                        <img
                          src={image.startsWith("http") ? image : `http://localhost:5000/${image}`}
                          alt={`Slide ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}

              {/* Question Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm">Category: {question.category || "General"}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  <a
                    href={`https://www.google.com/maps?q=${question.gpsLocation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Location
                  </a>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  <span className="text-sm">{formatDate(question.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Activity className="w-5 h-5 mr-2 text-purple-500" />
                  <span className="text-sm">
                    {question.attempts || "No"} attempts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Form */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
            Your Answer
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your knowledge..."
              required
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Post Answer
              </button>
            </div>
          </form>
        </div>

        {/* Answers Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          <div className="space-y-6">
            {answers.length > 0 ? (
              answers.map((answer) => (
                <div
                  key={answer._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={answer.user?.profileImage || "https://t4.ftcdn.net/jpg/06/84/44/27/360_F_684442786_I7KBvpQdJWSNpol3j0pUVeEiOcB8nDss.jpg"}
                      alt={answer.user?.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigateToUserProfile(answer.user?._id)}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {answer.user?.name || "Anonymous"}
                        </button>
                        <span className="text-xs text-gray-500">
                          {formatDate(answer.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{answer.content}</p>
                      <div className="mt-4 flex items-center space-x-4">
                        <button 
                          onClick={() => toggleHelpful(answer._id)}
                          className={`flex items-center px-3 py-1 rounded-full transition-colors ${
                            helpfulAnswers.has(answer._id)
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-500 hover:text-blue-600'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {helpfulAnswers.has(answer._id) ? 'Helpful' : 'Mark as Helpful'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-lg">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-600">No answers yet. Be the first to share your knowledge!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerQuestion;