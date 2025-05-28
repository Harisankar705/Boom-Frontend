import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../../context/VideoContext';

const UploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoType, setVideoType] = useState<'short' | 'long'>('short');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { uploadVideo } = useVideo();
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      
      setVideoFile(file);
      setError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (videoType === 'short' && !videoFile) {
      setError('Please upload a video file for short-form content');
      return;
    }
    
    if (videoType === 'long' && !videoUrl.trim()) {
      setError('Please provide a video URL for long-form content');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', videoType);
      
      if (videoType === 'short' && videoFile) {
        formData.append('videoFile', videoFile);
      }
      
      if (videoType === 'long') {
        formData.append('videoUrl', videoUrl);
        formData.append('price', price.toString());
      }
      
      await uploadVideo(formData);
      navigate('/');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Video</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB3A26] focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB3A26] focus:border-transparent"
            rows={3}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Video Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="short"
                checked={videoType === 'short'}
                onChange={() => setVideoType('short')}
                className="text-[#FB3A26] focus:ring-[#FB3A26]"
              />
              <span className="ml-2">Short-Form</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="long"
                checked={videoType === 'long'}
                onChange={() => setVideoType('long')}
                className="text-[#FB3A26] focus:ring-[#FB3A26]"
              />
              <span className="ml-2">Long-Form</span>
            </label>
          </div>
        </div>
        
        {videoType === 'short' && (
          <div className="mb-4">
            <label htmlFor="videoFile" className="block text-gray-700 text-sm font-medium mb-1">
              Video File (Max 10MB)
            </label>
            <input
              type="file"
              id="videoFile"
              accept="video/mp4"
              name='videoFile'
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB3A26] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted format: MP4. Maximum file size: 10MB.
            </p>
          </div>
        )}
        
        {videoType === 'long' && (
          <>
            <div className="mb-4">
              <label htmlFor="videoUrl" className="block text-gray-700 text-sm font-medium mb-1">
                Video URL
              </label>
              <input
                type="url"
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB3A26] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a link to your video (YouTube, Vimeo, etc.)
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="price" className="block text-gray-700 text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FB3A26] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set to 0 for free content
              </p>
            </div>
          </>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#FB3A26] text-white rounded-md hover:bg-opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FB3A26] disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;