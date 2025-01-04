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
  ThumbsDown,
  Share2,
  Bookmark,
  AlertCircle,
  Award,
  Eye
} from 'lucide-react';
import { toast } from "react-toastify";

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
        return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
      case 'under review':
        return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800';
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

  const handleVote = async (id, voteType, contentType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to vote');
        navigate('/login');
        return;
      }
  
      const endpoint = contentType === 'question' ? `/questions/${id}/vote` : `/answers/${id}/vote`;
      const response = await apiRequest(endpoint, 'PUT', { vote: voteType }, token);
  
      if (response) {
        if (contentType === 'question') {
          setQuestion(prev => ({
            ...prev,
            votes: response.votes,
            voters: response.voters
          }));
        } else {
          setAnswers(prevAnswers =>
            prevAnswers.map(answer =>
              answer._id === id
                ? { ...answer, votes: response.votes, voters: response.voters }
                : answer
            )
          );
        }
        
        toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'} successfully!`);
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to vote. Please try again.';
      if (errorMessage.includes('already voted')) {
        toast.warning('You have already voted on this content');
      } else {
        toast.error(errorMessage);
        console.error('Error voting:', error);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Question Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all hover:shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(question.status)} border shadow-sm`}>
                  {question.status?.toUpperCase()}
                </span>
                <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  {question.views || 0} views
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50' : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <QuestionActions question={question} userRole={user?.role} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {question.title}
              </h1>
              <div className="flex items-center space-x-4">
                <img
                  src={question.user?.profileImage || "https://t4.ftcdn.net/jpg/06/84/44/27/360_F_684442786_I7KBvpQdJWSNpol3j0pUVeEiOcB8nDss.jpg"}
                  alt={question.user?.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
                <div>
                  <button
                    onClick={() => navigateToUserProfile(question.user?._id)}
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {question.user?.name || "Anonymous"}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Posted {formatDate(question.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div className="prose dark:prose-invert max-w-none">
                <div className={`text-gray-600 dark:text-gray-300 ${!isDescriptionExpanded && 'line-clamp-3'}`}>
                  {question.description}
                </div>
                {question.description?.length > 200 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2 text-sm font-medium"
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
  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
    <Carousel
      showThumbs={false}
      dynamicHeight={false} // Disable dynamic height for consistent size
      infiniteLoop={true}
      autoPlay={true}
      showStatus={false}
      showArrows={true}
      swipeable={true}
      className="carousel-container"
    >
      {question.images.map((image, index) => (
        <div
          key={index}
          className="flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          <img
            src={image.startsWith("http") ? image : `http://localhost:5000/${image}`}
            alt={`Slide ${index + 1}`}
            className="w-full h-[400px] object-cover"
          />
        </div>
      ))}
    </Carousel>
  </div>
)}


              {/* Question Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm">Category: {question.category || "General"}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 mr-2 text-red-500 dark:text-red-400" />
                  <a
                    href={`https://www.google.com/maps?q=${question.gpsLocation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    View Location
                  </a>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <Calendar className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />
                  <span className="text-sm">{formatDate(question.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <Activity className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                  <span className="text-sm">
                    {question.attempts || "No"} attempts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Form */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
            Your Answer
          </h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
              placeholder="Share your knowledge..."
              required
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Post Answer
              </button>
            </div>
          </form>
        </div>

        {/* Answers Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500 dark:text-yellow-400" />
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          <div className="space-y-6">
            {answers.length > 0 ? (
              answers.map((answer) => (
                <div
                  key={answer._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={answer.user?.profileImage || "https://t4.ftcdn.net/jpg/06/84/44/27/360_F_684442786_I7KBvpQdJWSNpol3j0pUVeEiOcB8nDss.jpg"}
                      alt={answer.user?.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => navigateToUserProfile(answer.user?._id)}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {answer.user?.name || "Anonymous"}
                        </button>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(answer.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{answer.content}</p>
                      <div className="mt-4 flex items-center space-x-4">
                        <button 
                          onClick={() => toggleHelpful(answer._id)}
                          className={`flex items-center px-3 py-1 rounded-full transition-colors ${
                            helpfulAnswers.has(answer._id)
                              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {helpfulAnswers.has(answer._id) ? 'Helpful' : 'Mark as Helpful'}
                          </span>
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
  <button
    onClick={() => handleVote(answer._id, 'up', 'answer')}
    className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
    aria-label="Upvote"
  >
    <ThumbsUp 
      className={`h-4 w-4 ${
        answer.voters?.some(v => v.user === localStorage.getItem('userId') && v.vote === 1)
          ? 'text-green-500'
          : 'text-gray-500'
      }`} 
    />
    <span className="text-sm font-medium ml-1">{answer.votes || 0}</span>
  </button>
  <button
    onClick={() => handleVote(answer._id, 'down', 'answer')}
    className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
    aria-label="Downvote"
  >
    <ThumbsDown 
      className={`h-4 w-4 ${
        answer.voters?.some(v => v.user === localStorage.getItem('userId') && v.vote === -1)
          ? 'text-red-500'
          : 'text-gray-500'
      }`} 
    />
  </button>
</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">No answers yet. Be the first to share your knowledge!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerQuestion;