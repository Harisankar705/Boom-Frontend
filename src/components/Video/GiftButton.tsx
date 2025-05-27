import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface GiftButtonProps {
  creatorId: string;
  videoId: string;
}

const GiftButton: React.FC<GiftButtonProps> = ({ creatorId, videoId }) => {
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { sendGift, balance } = useWallet();
  
  const giftAmounts = [10, 50, 100, 200, 500];
  
  const handleGift = async () => {
    if (selectedAmount <= 0) return;
    
    setIsLoading(true);
    try {
      const result = await sendGift(creatorId, videoId, selectedAmount);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setIsGiftModalOpen(false);
          setSuccess(false);
          setSelectedAmount(0);
        }, 2000);
      } else {
        alert('Insufficient balance to send this gift');
      }
    } catch (error) {
      console.error('Error sending gift:', error);
      alert('Failed to send gift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsGiftModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-[#FFC344] text-[#FB3A26] rounded-md hover:bg-opacity-90 transition"
      >
        <Gift size={18} />
        <span>Gift Creator</span>
      </button>
      
      {isGiftModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Gift the Creator</h3>
            
            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-green-600 font-semibold text-lg">Gift sent successfully!</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Show your appreciation by sending a gift to the creator. Current balance: ₹{balance}
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {giftAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`py-2 px-4 rounded-md ${
                        selectedAmount === amount
                          ? 'bg-[#FB3A26] text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } transition ${balance < amount ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={balance < amount}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsGiftModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGift}
                    disabled={selectedAmount === 0 || isLoading || balance < selectedAmount}
                    className="px-4 py-2 bg-[#FB3A26] text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : `Send ₹${selectedAmount}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GiftButton;