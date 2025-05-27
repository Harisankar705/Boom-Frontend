import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useVideo, Video } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../../src/context/WalletContext';
import CommentSection from '../components/Video/CommentSection';
import GiftButton from '../components/Video/GiftButton';

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<Video | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { getVideoById } = useVideo();
  const { user } = useAuth();
  const { purchaseVideo } = useWallet();
  const navigate = useNavigate();
  
  useEffect(() => {
  const fetchVideo = async () => {
    if (videoId) {
      setLoading(true);
      const videoData = await getVideoById(videoId);
      setVideo(videoData);
      setLoading(false);
    }
  };

  fetchVideo();
}, [videoId, getVideoById]);
      console.log("VIDEODATA",video)

  
  const handlePurchase = async () => {
    if (!video) return;
    
    const success = await purchaseVideo(video._id, video.price);
    
    if (!success) {
      alert('Insufficient balance to purchase this video');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB3A26]"></div>
      </div>
    );
  }
  
  if (!video) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Video not found</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 bg-[#FB3A26] text-white rounded-md hover:bg-opacity-90 transition"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </button>
      </div>
    );
  }
  
  const isPurchased = user?.purchases?.includes(video._id);
  const canWatch = video.price === 0 || isPurchased;
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-video bg-black relative">
          {canWatch ? (
            video.type === 'short' ? (
              <video
                src={video.fileUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${video.videoUrl?.split('v=')[1]}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="z-10 text-center p-6">
                <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
                <p className="text-lg mb-4">Purchase this video to watch it</p>
                <button
                  onClick={handlePurchase}
                  className="px-6 py-3 bg-[#FB3A26] text-white rounded-full hover:bg-opacity-90 transition"
                >
                  Buy for ₹{video.price}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
              <p className="text-gray-600 mt-1">@{video.creator.username||"User"}</p>
            </div>
            
            {canWatch && (
              <GiftButton creatorId={video.creator._id} videoId={video._id} />
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
          </div>
        </div>
      </div>
      
      {canWatch && <CommentSection videoId={video._id} />}
    </div>
  );
};

export default VideoPage;