import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold">404</h1>
        <p className="text-xl md:text-2xl font-light mt-4">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <p className="mt-2 text-md md:text-lg">
          It seems like you’ve hit a dead end. Let’s get you back on track.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-800 dark:bg-gray-700 text-gray-100 dark:text-gray-300 font-semibold rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <img
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMW9zNWl3czh4OXl0ejQ3dmdvZ3NnZXgxZTNucGk5dTM4MzY0dTBhNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UoeaPqYrimha6rdTFV/giphy.gif"
          alt="Astronaut floating in space"
          className="w-64 md:w-80 opacity-75 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default NotFound;
