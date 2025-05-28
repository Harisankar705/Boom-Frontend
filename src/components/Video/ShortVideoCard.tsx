import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../../context/VideoContext';

interface ShortVideoCardProps {
  video: Video;
}

const ShortVideoCard: React.FC<ShortVideoCardProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsVisible(entry.isIntersecting);
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(error => {
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isVisible]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link to={`/video/${video._id}`}>
        <div className="relative w-full aspect-[9/16] bg-black" onClick={togglePlayPause}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={video.fileUrl}
            loop
            muted
            playsInline
            onClick={(e) => e.preventDefault()}
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-lg">{video.title}</h3>
            <p className="text-sm opacity-90">@{video.creator.username}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShortVideoCard;