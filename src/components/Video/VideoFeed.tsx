import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, DollarSign } from 'lucide-react';
import { useVideo, Video } from '../../context/VideoContext';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';
import ShortVideoCard from './ShortVideoCard';
import LongVideoCard from './LongVideoCard';

const VideoFeed: React.FC = () => {
  const { videos, loading, error, fetchVideos } = useVideo();
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && videos.length > 0) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, videos.length]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign in to discover videos</h2>
        <Link to="/auth" className="inline-block px-6 py-3 bg-[#FB3A26] text-white rounded-full hover:bg-opacity-90 transition">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB3A26]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => fetchVideos()}
          className="mt-4 px-4 py-2 bg-[#FB3A26] text-white rounded-md hover:bg-opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Paginate videos
  const displayedVideos = videos.slice(0, page * 3);

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="space-y-6 py-6">
        {displayedVideos.map((video) => (
          <div key={video._id} className="mb-8">
            {video.type === 'short' ? (
              <ShortVideoCard video={video} />
            ) : (
              <LongVideoCard video={video} />
            )}
          </div>
        ))}
        
        {loading && videos.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FB3A26]"></div>
          </div>
        )}
        
        <div ref={loaderRef} className="h-10" />
      </div>
    </div>
  );
};

export default VideoFeed;