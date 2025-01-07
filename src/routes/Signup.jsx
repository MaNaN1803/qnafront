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
    "Chai88", "Lassi7", "Cool12", "Desi99", "Masala22", "Samosa9", "Bollywood5", "Paneer14", "Curry11", "GolGappa77",
    "Biryani1", "Tandoori33", "Spicy88", "Dosa21", "Roti55", "Rajma19", "Butter4", "Naan60", "Pakka10", "Chatori27",
    "Khaati2", "Garam70", "Zesty16", "Fluffy9", "Jalwa31", "Dhamaka99", "Thali8", "Andaz57", "Swag25", "Mithai18",
    "Kesar32", "Rasmalai43", "Pista12", "Gulab56", "Bhaijaan34", "Dhamal13", "Tikka64", "Doodh4", "Halwa38", "Makhni23",
    "Chatpata29", "Puchka5", "Andaaz90", "Shahi73", "Royal18", "Khatti4", "Sweet31", "Aloo13", "DesiCool66", "Classic22",
    "Khaas14", "Zabardast9", "Kadak30", "Swaggy17", "Heera45", "Chatori56", "Baingan9", "Rang27", "Butterlicious10", "Kabab33",
    "Zing15", "Fried5", "Chutney21", "Bhel7", "Pakora34", "Tandoor23", "Shahi5", "Mango39", "Jalebi44", "Fresco32",
    "Kebab18", "Badshah11", "Shaadi50", "Nashte64", "Patakha1", "Rajput2", "Chatka99", "LassiSwag4", "AlooMasti16", "BiryaniRaja2",
    "GulabJamun9", "Sheermal18", "MithaiMaan10", "MirchMasala11", "PaniPuri3", "Pakodi7", "JalebiKing17", "Raita5", "TandoorVibes22",
    "Chingari10", "Chawal16", "Kachori5", "Jugaad29", "DilliWala12", "Patiala7", "GulabRaja18", "KesarLover9", "Mawa12", "CurryKing34",
    "MasalaLover23", "Kadhi11", "PavBhaji30", "TikkaMasala1", "ButterNaan12", "ChaatKing24", "Pyaaz16", "PaneerMasti8", "DesiRaja3",
    "AlooTikki7", "BiryaniRani9", "KadhiPakora12", "Meetha17", "TandooriMasti7", "Zaitoon33", "DesiTadka2", "ChutneyLover8", "GulabSweets12",
    "Khoya13", "GajarHalwa2", "LassiMan7", "MithiMithai6", "Swaad5", "RotiWala23", "Dum15", "AlooChaat17", "PistaBarfi9", "ChanaChaat11",
    "ChanaMasala6", "LassiQueen12", "AlooGobi4", "NaanBaba10", "TikkaWala5", "RoyalBiryani2", "DosaSwag1", "PannaCotta7", "TandooriMagic11",
    "MithaiMania6", "Papad5", "GulabJamunKing2", "MirchBiryani10", "DosaDhamaka9", "AlooParatha8", "SamosaDuke17", "MasalaTadka33", 
    "BiryaniGuru4", "BhaiyaVibes12", "Methi6", "MawaDelight11", "PistaLover8", "Makkhan7", "TandooriKing9", "MirchMasala7", "Peshawari12",
    "BiryaniLove22", "AlooWala33", "GulabWala11", "PaanKing5", "PaneerKing16", "ChappalSwag18", "MithiMithai9", "PuriMania7", "SabziKing12",
    "Kaddu2", "Bhature9", "Chole5", "Gajar9", "Rava6", "MethiWala11", "Kheema7", "Rasam22", "CurryWala5", "AlooGhee33"
];

const nouns = [
  "Wala", "Lover", "Bhaiya", "King", "Rider", "Magic", "Fan", "Buff", "Lover", "Craze",
  "Nawab", "Dancer", "Boss", "Queen", "Dude", "Champion", "Dhamaka", "Master", "Ruler", "Shan",
  "Bhakt", "Guru", "Chowkidar", "Foodie", "Prince", "Addict", "Chef", "Explorer", "Eater", "Snack",
  "Kingpin", "Monarch", "Pataka", "Baba", "Knight", "Sher", "Sundar", "Wali", "Pehelwan", "Tadka",
  "Rockstar", "Admi", "Badshah", "Maharaja", "Sakhi", "Tiger", "Khiladi", "Sardar", "Babu", "Queen",
  "Captain", "Samosa", "Masti", "Bhature", "Lassi", "Kachori", "Paratha", "Kheer", "Paan", "Laddoo",
  "Maharani", "Desi", "Sundar", "Puri", "Samosa", "Singh", "Tandoori", "Wale", "Foodie", "Gulab",
  "Maharaj", "Jazba", "Champion", "Prince", "Thakur", "Raja", "Shahenshah", "Rani", "Baba", "Zaheer",
  "Mithai", "Sherpa", "Badshahi", "Mithai", "Kebab", "Sardar", "Babu", "Mahi", "Pachis", "RajaBabu",
  "Mochi", "Chowkidar", "MithaiWala", "Pataka", "Curry", "Khush", "Vichar", "Guruji", "Mukti", "RaniMaa",
  "Taj", "Zinda", "Shah", "Gourmet", "Swaad", "Sweets", "Mirchi", "Raza", "Ustaad", "Dharma",
  "Ali", "Garam", "Shehzada", "Rattan", "Patiala", "Ghazi", "Jazba", "Jaggi", "RamLover", "Haveli",
  "SherWala", "ThaliWala", "Chota", "Ratan", "Bandhu", "LassiDuke", "TandoorKing", "BiryaniMania", 
  "BiryaniQueen", "MasalaRaja", "RajmaWala", "Pind", "Shashi", "Tandoori", "MithaiWala", "Butter",
  "Ghee", "SundarWala", "Bajra", "Gajra", "Bhindi", "KachoriMaster", "BiryaniWala", "SamosaRani",
  "KheerWala", "CholeBhature", "WalePataka", "GulabSwag", "Murg", "AlooWala", "Pineapple", "Mango"
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
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
  
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
  
      // Handle duplicate key error
      if (errorMessage.includes("E11000 duplicate key error")) {
        toast.error("A user with this email already exists. try with another I'd.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
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
