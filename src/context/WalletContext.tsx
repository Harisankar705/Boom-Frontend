import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: number;
  purchaseVideo: (videoId: string, price: number) => Promise<boolean>;
  sendGift: (creatorId: string, videoId: string, amount: number) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  purchaseVideo: async () => false,
  sendGift: async () => false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(user?.wallet || 0);

  useEffect(() => {
    if (user) {
      setBalance(user.wallet);
    }
  }, [user]);

  const purchaseVideo = async (videoId: string, price: number): Promise<boolean> => {
    try {
      const response = await api.post('/videos/purchase', { videoId });
      setBalance(response.data.newBalance);
      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  };

  const sendGift = async (creatorId: string, videoId: string, amount: number): Promise<boolean> => {
    try {
      const response = await api.post('/gifts/send', { creatorId, videoId, amount });
      setBalance(response.data.newBalance);
      return true;
    } catch (error) {
      console.error('Gift sending failed:', error);
      return false;
    }
  };

  return (
    <WalletContext.Provider value={{ 
      balance, 
      purchaseVideo,
      sendGift
    }}>
      {children}
    </WalletContext.Provider>
  );
};