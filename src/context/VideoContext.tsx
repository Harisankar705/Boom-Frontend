import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

export interface Video {
  _id: string;
  creator: {
    _id: string;
    username: string;
  };
  title: string;
  description: string;
  type: 'short' | 'long';
  fileUrl?: string;
  videoUrl?: string;
  price: number;
  createdAt: string;
  thumbnail?: string;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
  createdAt: string;
}

interface VideoContextType {
  videos: Video[];
  loading: boolean;
  error: string | null;
  fetchVideos: () => Promise<void>;
  getVideoById: (id: string) => Promise<Video | undefined>;
  addComment: (videoId: string, text: string) => Promise<void>;
  getComments: (videoId: string) => Promise<Comment[]>;
  uploadVideo: (videoData: FormData) => Promise<void>;
}

const VideoContext = createContext<VideoContextType>({
  videos: [],
  loading: false,
  error: null,
  fetchVideos: async () => {},
  getVideoById: async () => undefined,
  addComment: async () => {},
  getComments: async () => [],
  uploadVideo: async () => {},
});

export const useVideo = () => useContext(VideoContext);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/videos/feed');
      console.log("RESPONSE",response)
      setVideos(response.data );
    } catch (err) {
      setError('Failed to fetch videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVideoById = async (id: string) => {
    try {
      const response = await api.get(`/videos/${id}`);
      console.log(response)
      return response.data.videos
    } catch (error) {
      console.error('Error fetching video:', error);
      return undefined;
    }
  };

  const addComment = async (videoId: string, comment: string) => {
    try {
      await api.post(`/videos/createcomment`, { comment,videoId});
    } catch (err) {
      console.error('Error adding comment:', err);
      throw new Error('Failed to add comment');
    }
  };

    const getComments = async (videoId: string): Promise<Comment[]> => {
      try {
        const response = await api.get(`/videos/comments/${videoId}`);
        console.log("COMMENTS",response)
        return response.data
      } catch (err) {
        console.error('Error fetching comments:', err);
        return [];
      }
    };

  const uploadVideo = async (videoData: FormData) => {
    try {
      await api.post('/videos/upload', videoData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      console.error('Error uploading video:', err);
      throw new Error('Failed to upload video');
    }
  };

  return (
    <VideoContext.Provider value={{
      videos,
      loading,
      error,
      fetchVideos,
      getVideoById,
      addComment,
      getComments,
      uploadVideo
    }}>
      {children}
    </VideoContext.Provider>
  );
};