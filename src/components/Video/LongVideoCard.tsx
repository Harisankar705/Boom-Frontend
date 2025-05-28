import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, DollarSign } from 'lucide-react';
import { Video } from '../../context/VideoContext';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';

interface LongVideoCardProps {
  video: Video;
}
const LongVideoCard: React.FC<LongVideoCardProps> = ({ video }) => {
  const { user } = useAuth();
  const { purchaseVideo, balance,getBalance} = useWallet();
  const navigate = useNavigate();
 

  const isPurchased = user?.purchases?.includes(video._id);
  const canAfford = balance >= video.price;
  
  const handlePurchase = async (e: React.MouseEvent) => {
  e.preventDefault();
  
  if (video.price === 0 || isPurchased) {
    navigate(`/video/${video._id}`);
    return;
  }
  
  const result = await purchaseVideo(video._id, video.price);
  
  if (result.success) {
    await getBalance()
    alert('Video purchased!')
    user?.purchases?.push(video._id);
    navigate(`/video/${video._id}`);
  } else {
    alert(result.message);
  }
};
  
  return (
    <Link to={`/video/${video._id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            {video.price > 0 && !isPurchased ? (
              <button
                onClick={handlePurchase}
                className={`px-4 py-2 rounded-full flex items-center space-x-1 ${
                  canAfford 
                    ? 'bg-[#FB3A26] text-white hover:bg-opacity-90' 
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                <DollarSign size={16} />
                <span>Buy for ₹{video.price}</span>
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                className="bg-[#FB3A26] text-white px-4 py-2 rounded-full flex items-center space-x-1 hover:bg-opacity-90"
              >
                <Play size={16} />
                <span>Watch</span>
              </button>
            )}
          </div>
          
          {video.price > 0 && !isPurchased && (
            <div className="absolute top-2 right-2 bg-[#FFC344] text-[#FB3A26] font-semibold px-3 py-1 rounded-full text-sm">
              ₹{video.price}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{video.title}</h3>
          <p className="text-sm text-gray-600 mt-1">@{video.creator.username}</p>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{video.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default LongVideoCard;