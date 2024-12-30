import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import { apiRequest } from "../utils/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [captchaValid, setCaptchaValid] = useState(false);
  const [shownameInfo, setShownameInfo] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  const adjectives = [
    "Bold", "Quick", "Bright", "Chill", "Lucky", "Brave", "Clever", "Swift", "Energetic", "Smart",
    "Wise", "Creative", "Happy", "Serene", "Radiant", "Quiet", "Curious", "Loyal", "Fearless", "Mighty",
    "Strong", "Vibrant", "Charming", "Playful", "Brilliant", "Gentle", "Jolly", "Daring", "Graceful", "Noble",
    "Pure", "Fierce", "Adventurous", "Endless", "Jovial", "Quiet", "Joyful", "Patient", "Optimistic", "Friendly",
    "Vigorous", "Sociable", "Energetic", "Steady", "Brisk", "Bold", "Gallant", "Dynamic", "Witty", "Imaginative",
    "Innovative", "Compassionate", "Sincere", "Humble", "Determined", "Fearless", "Diligent", "Ambitious", "Gutsy",
    "Sensible", "Mellow", "Spirited", "Adorable", "Harmonious", "Luminous", "Upbeat", "Flourishing", "Hopeful",
    "Caring", "Playful", "Unstoppable", "Nurturing", "Lively", "Effervescent", "Radiant", "Positive", "Refreshing",
    "Mature", "Flawless", "Confident", "Wild", "Unbreakable", "Dynamic", "Authentic", "Adventurous", "Enthusiastic",
    "Wise", "Resourceful", "Bouncy", "Bright-eyed", "Hearty", "Invincible", "Loving", "Steadfast", "Gallant", "Playful",
    "Determined", "Unique", "Zesty", "Endearing", "Sincere", "Inspiring", "Peaceful", "Resilient", "Composed",
    "Cheerful", "Magnetic", "Exuberant", "Fearless", "Relentless", "Blissful", "Vibrant", "Persistent", "Graceful",
    "Joyous", "Peaceful", "Upstanding", "Solid", "Refreshing", "Effortless", "Indomitable", "Serene", "Soft-hearted",
    "Majestic", "Hardworking", "Fiery", "Spunky", "Generous", "Luminous", "Honorable", "Innovative", "Unyielding",
    "Bold-hearted", "Dashing", "Soft-spoken", "Thriving", "Sociable", "Grounded", "Mellow", "Relaxed", "Blazing"
  ];
  
  const nouns = [
    "Fox", "Hawk", "Bear", "Wave", "Shade", "Storm", "Lion", "Eagle", "Tiger", "Dragon",
    "Shark", "Wolf", "Flame", "Frost", "Sun", "Moon", "Cloud", "Thunder", "Snow", "Ocean",
    "Flare", "Phoenix", "Bolt", "Dove", "Viper", "Panther", "Cheetah", "Falcon", "Whale",
    "Wolf", "Hummingbird", "Hawk", "Mantis", "Eagle", "Bear", "Crane", "Falcon", "Tiger",
    "Jaguar", "Lion", "Seagull", "Swallow", "Puma", "Crocodile", "Grizzly", "Wolf", "Lion",
    "Leopard", "Zebra", "Kangaroo", "Bison", "Koala", "Penguin", "Wolverine", "Otter", "Sparrow",
    "Owl", "Cougar", "Dolphin", "Turtle", "Lynx", "Butterfly", "Giraffe", "Gorilla", "Lemur",
    "Hedgehog", "Rabbit", "Moose", "Whale", "Fox", "Beaver", "Sparrow", "Ostrich", "Alligator",
    "Zebra", "Pelican", "Kangaroo", "Panther", "Cheetah", "Snake", "Chameleon", "Rabbit", "Elephant",
    "Vulture", "Parrot", "Pigeon", "Horse", "Wildebeest", "Goose", "Camel", "Dragonfly", "Raven",
    "Mole", "Swan", "Duck", "Camel", "Bear", "Tortoise", "Horse", "Koala", "Lynx", "Crow",
    "Hawk", "Bison", "Coyote", "Deer", "Peacock", "Moose", "Geese", "Scorpion", "Bat",
    "Caterpillar", "Lizard", "Frog", "Antelope", "Penguin", "Crocodile", "Fawn", "Lamb",
    "Chinchilla", "Otter", "Shrew", "Fowl", "Raccoon", "Fox", "Kangaroo", "Shark", "Tortoise",
    "Goose", "Salmon", "Shrimp", "Mole", "Octopus", "Squid", "Starfish", "Gull", "Mantis",
    "Hummingbird", "Firefly", "Whale", "Cheetah", "Jaguar", "Parrot", "Falcon", "Bison", "Eagle",
    "Tiger", "Vulture", "Rabbit", "Beetle", "Flamingo", "Hornet", "Owl", "Dolphin", "Mantis",
    "Giraffe", "Penguin", "Snake", "Lion", "Whale", "Pigeon", "Coyote", "Antelope", "Crow",
    "Pelican", "Eagle", "Frog", "Koala", "Sparrow", "Bat", "Bison", "Whale", "Hawk", "Fox"
  ];
  

  const generatename = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}${noun}`;
  };

  useEffect(() => {
    // Generate a name when the component mounts
    setFormData((prev) => ({ ...prev, name: generatename() }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith("@gmail.com")) {
      toast.error("Only Gmail IDs are allowed.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!captchaValid) {
      toast.error("Please verify the CAPTCHA.");
      return;
    }

    try {
      const response = await apiRequest("/auth/signup", "POST", {
        name: formData.name, // Map the name field
        email: formData.email,
        password: formData.password,
      });
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValid(!!value);
  };

  const togglenameInfo = () => {
    setShownameInfo(!shownameInfo); // Toggle modal visibility
  };

  return (
    <div className="flex w-full justify-center items-center dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full sm:w-96 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg dark:shadow-xl">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">
          Sign Up , to get started !!
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 mb-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm dark:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 mb-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm dark:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-4 mb-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm dark:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange} // Allow users to edit if needed
            className="w-full p-4 mb-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg shadow-sm dark:shadow-md"
            readOnly // Prevent users from modifying unless you want to allow changes
          />

          {/* Info Box and Button */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                  System Generated Username
            </p>
            <button
              type="button"
              onClick={togglenameInfo}
              className="text-sm text-blue-500 hover:underline"
            >
              Why is my Username generated automatically?
            </button>
          </div>

          {/* Modal for name Info */}
          {shownameInfo && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
              <div className="w-96 bg-white p-6 rounded-lg shadow-xl dark:bg-gray-800 dark:text-gray-200">
               
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Username Information
                </h3>
                <p className="text-gray-800 dark:text-gray-200">
                  Your Username has been generated automatically for security and privacy reasons. If you'd like to change it, you can do so later in your profile settings.
                </p>
                <button
                  onClick={togglenameInfo}
                  className="mt-4 w-full py-2 bg-gray-800 dark:bg-gray-600 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={handleCaptchaChange}
            className="mb-6"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg shadow-md transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
