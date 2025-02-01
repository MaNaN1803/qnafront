# Municipal QnA Frontend

## Overview
This is the frontend of a **MERN-based Question-and-Answer Platform** designed for municipal issue resolution. The application provides a user-friendly interface for posting, answering, and moderating questions related to municipal issues.

## Features
- **User Authentication & Authorization** (Admin, Moderator, User)
- **Geolocation-enabled Questions with Map Clustering**
- **Dark Mode Support**
- **Question & Answer System with Voting**
- **Content Moderation & Report System**
- **Dashboard for Admins & Moderators**
- **Profile Management**
- **Real-time Notifications (Planned Feature)**

## Tech Stack
- **React.js** (Frontend framework)
- **Vite** (Build tool)
- **TailwindCSS** (Styling framework)
- **React Router** (Navigation & routing)
- **Axios** (API communication)
- **Leaflet.js & React-Leaflet** (Maps & Geolocation)
- **Cloudinary** (Image Uploads)
- **Filepond** (File Upload Handling)
- **React Google Recaptcha** (Spam protection)

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Vite](https://vitejs.dev/)

### Clone the Repository
```sh
git clone https://github.com/MaNaN1803/qnafront.git
cd qnafront
```

### Install Dependencies
```sh
npm install
```

### Setup Environment Variables
Create a `.env` file in the `frontend` directory and add the following:
```sh
VITE_API_BASE_URL=<your_backend_api_url>
VITE_CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
VITE_GOOGLE_RECAPTCHA_SITE_KEY=<your_recaptcha_site_key>
```

### Run the Development Server
```sh
npm run dev
```

### Build for Production
```sh
npm run build
```

## Folder Structure
```
qnafront/
│── src/
│   │── components/  # Reusable UI components
│   │── routes/      # Page routes (Login, Home, Profile, etc.)
│   │── utils/       # Utility functions (API, Cloudinary config, etc.)
│   │── assets/      # Static assets like images
│   │── App.jsx      # Main App component
│── public/          # Static files like index.html
│── package.json     # Project dependencies and scripts
│── tailwind.config.js # Tailwind CSS configuration
│── vite.config.js    # Vite build configuration
```

## Key Components & Pages

### Authentication
- **Login & Signup Pages** (User authentication with JWT tokens)
- **PrivateRoute** (Restricts access to authenticated users)

### Main Pages
- **Home Page** (Displays questions based on categories & location)
- **Submit Question** (Users can post new questions with images & geolocation data)
- **Search Results** (Search questions by title, category, or keywords)
- **Profile Management** (Update user details & preferences)

### Moderation & Admin
- **Admin Dashboard** (Manage users, reports, and categories)
- **Moderator Dashboard** (Moderate reported questions & answers)
- **Report System** (Users can report inappropriate content)

## API Integration
The frontend interacts with the backend API via Axios to:
- Fetch questions, answers, and user data
- Handle authentication & token storage
- Submit questions, answers, and votes
- Manage reports & moderation actions

## Security Features
- **Auto Names Assigning (editable)**
- **JWT-based authentication**
- **Role-based access control (RBAC)**
- **ReCAPTCHA protection for forms**
- **Secure API requests using Axios interceptors**

## Contribution Guidelines
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Added new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## Contact
For any queries, reach out to [Manan Telrandhe](https://manan18.vercel.app/).

