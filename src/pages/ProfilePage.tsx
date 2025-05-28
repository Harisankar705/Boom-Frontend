import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { balance } = useWallet();
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading profile...</h2>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#FB3A26] to-[#FFC344] h-32"></div>
        
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center -mt-16 border-4 border-white shadow">
              <span className="text-3xl font-bold text-gray-500">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            
            <div className="bg-gray-100 px-6 py-3 rounded-full text-gray-800 font-semibold">
              Wallet Balance: ₹{balance}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Purchases</h2>
            
            {user.purchases && user.purchases.length > 0 ? (
              <div>
                <p className="text-gray-600">You have {user.purchases.length} purchased videos.</p>
              </div>
            ) : (
              <p className="text-gray-500">You haven't purchased any videos yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;