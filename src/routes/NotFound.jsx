import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold animate-pulse">404</h1>
        <p className="text-2xl md:text-3xl font-light mt-4">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <p className="mt-2 text-lg">
          It looks like you took a wrong turn. Let’s get you back on track.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-3 bg-white text-indigo-500 font-semibold rounded-full shadow-md hover:bg-indigo-100 transition duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <img
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMW9zNWl3czh4OXl0ejQ3dmdvZ3NnZXgxZTNucGk5dTM4MzY0dTBhNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UoeaPqYrimha6rdTFV/giphy.gif"
          alt="Astronaut floating in space"
          className="w-72 md:w-96"
        />
      </div>
    </div>
  );
};

export default NotFound;
