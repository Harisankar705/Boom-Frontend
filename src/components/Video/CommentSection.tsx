import React, { useState, useEffect } from 'react';
import { useVideo, Comment } from '../../context/VideoContext';
import { useAuth } from '../../context/AuthContext';

interface CommentSectionProps {
  videoId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { addComment, getComments } = useVideo();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    fetchComments();
  }, [videoId]);
  
  const fetchComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await getComments(videoId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    try {
      await addComment(videoId, comment);
      setComment('');
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-semibold">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-grow">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FB3A26] focus:border-transparent resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-[#FB3A26] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FB3A26]"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-semibold">
                  {comment.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <h4 className="font-semibold text-gray-800">{comment.user.username}</h4>
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;