import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: number;
  purchaseVideo: (videoId: string, price: number) =>  Promise<{ success: boolean; message?: string }>
  sendGift: (creatorId: string,videoId: string,amount: number) => Promise<{ success: boolean; reason?: string }>;
  reloadBalance: () => Promise<void>;
  getBalance:()=>Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  purchaseVideo:  async () => ({ success: false, message: 'Not initialized' }),
  sendGift: async () => ({ success: false, reason: 'Not initialized' }),
  reloadBalance: async () => {},
   getBalance:async()=>{}
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

  const purchaseVideo = async (videoId: string, price: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.post('/videos/purchase', { videoId });
    setBalance(response.data.newBalance);
    return { success: true };
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Purchase failed';
    return { success: false, message };
  }
};

  const sendGift = async (creatorId: string,videoId: string,amount: number): Promise<{ success: boolean; reason?: string }> => {
    try {
      const response = await api.post('/gifts/send', { creatorId, videoId, amount });
      console.log("GIFT RESPONSE:", response.data);
      setBalance(response.data.newBalance);
      return { success: true };
    } catch (error: any) {
      console.error('Gift sending failed:', error);
      const message = error?.response?.data?.message || 'Unknown error';
      return { success: false, reason: message };
    }
  };

   const reloadBalance = async () => {
    try {
      const response = await api.get('/auth/me');
      console.log('fetchbalanace',response)
      setBalance(response.data.user.wallet);
    } catch (err) {
      console.error("Failed to reload wallet balance:", err);
    }
  };
  const getBalance = async () => {
    try {
      const response = await api.get('/videos/balance');  
      console.log('getBalance',response)
      setBalance(response.data.balance);
    } catch (err) {
      console.error("Failed to reload wallet balance:", err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        purchaseVideo,
        sendGift,
        reloadBalance,
        getBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
