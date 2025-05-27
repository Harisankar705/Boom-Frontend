import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoFeed from '../components/Video/VideoFeed';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isAuthenticated ? (
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="bg-gradient-to-r from-[#FB3A26] to-[#FFC344] bg-clip-text text-transparent">Boom</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover and interact with both short-form and long-form videos all in one place.
          </p>
          <Link
            to="/auth"
            className="inline-block px-6 py-3 bg-[#FB3A26] text-white font-medium rounded-full hover:bg-opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <VideoFeed />
      )}
    </div>
  );
};

export default HomePage;