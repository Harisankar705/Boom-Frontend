import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

interface User {
  _id: string;
  username: string;
  email: string;
  wallet: number;
  purchases: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  googleLogin: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Storage utility functions with fallbacks
const storageUtils = {
  // Check if localStorage is available and accessible
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e.message);
      return false;
    }
  },

  // In-memory storage fallback
  memoryStorage: {} as Record<string, string>,

  setItem(key: string, value: string): void {
    try {
      if (this.isStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        this.memoryStorage[key] = value;
      }
    } catch (error) {
      console.warn('Failed to set storage item:', error);
      this.memoryStorage[key] = value;
    }
  },

  getItem(key: string): string | null {
    try {
      if (this.isStorageAvailable()) {
        return localStorage.getItem(key);
      } else {
        return this.memoryStorage[key] || null;
      }
    } catch (error) {
      console.warn('Failed to get storage item:', error);
      return this.memoryStorage[key] || null;
    }
  },

  removeItem(key: string): void {
    try {
      if (this.isStorageAvailable()) {
        localStorage.removeItem(key);
      } else {
        delete this.memoryStorage[key];
      }
    } catch (error) {
      console.warn('Failed to remove storage item:', error);
      delete this.memoryStorage[key];
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token: string) => {
    console.log('Setting auth token:', token.substring(0, 20) + '...');
    storageUtils.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const clearAuthToken = () => {
    console.log('Clearing auth token');
    storageUtils.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing authentication...');
      console.log('📦 Storage available:', storageUtils.isStorageAvailable());
      
      try {
        const token = storageUtils.getItem('token');
        console.log('📦 Token from storage:', token ? 'Found' : 'Not found');
        
        if (!token) {
          console.log('❌ No token found, skipping verification');
          setLoading(false);
          return;
        }

        console.log('🔍 Verifying token with backend...');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/auth/me');
        console.log('✅ Token verification response:', response.status, response.data);
        
        if (response.data && response.data.user) {
          console.log('👤 User authenticated:', response.data.user.username);
          setUser(response.data.user);
        } else {
          console.log('❌ Invalid user data format:', response.data);
          throw new Error('Invalid user data received');
        }
        
      } catch (error) {
        console.error('❌ Token verification failed:', error);
        
        if (error.response) {
          console.log('📡 Error response:', error.response.status, error.response.data);
        } else if (error.request) {
          console.log('📡 Network error - no response received');
        } else {
          console.log('📡 Request setup error:', error.message);
        }
        
        clearAuthToken();
        setUser(null);
        
      } finally {
        console.log('🏁 Auth initialization complete');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔐 Attempting login for:', email);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login successful:', response.data);
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid login response - missing token or user');
      }

      setAuthToken(token);
      setUser(user);
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error; 
    }
  };

  const register = async (username: string, email: string, password: string) => {
    console.log('📝 Attempting registration for:', email);
    
    try {
      const response = await api.post('/auth/register', { username, email, password });
      console.log('✅ Registration successful:', response.data);
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid registration response - missing token or user');
      }

      setAuthToken(token);
      setUser(user);
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const googleLogin = async (token: string) => {
    console.log('🔍 Attempting Google login');
    
    try {
      const response = await api.post('/auth/google', { token });
      console.log('✅ Google login successful:', response.data);
      
      const { token: accessToken, user } = response.data;
      
      if (!accessToken || !user) {
        throw new Error('Invalid Google login response - missing token or user');
      }

      setAuthToken(accessToken);
      setUser(user);
      
    } catch (error) {
      console.error('❌ Google login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('👋 Logging out user');
    clearAuthToken();
    setUser(null);
  };

  // Debug current state
  console.log('🔍 Auth State:', { 
    hasUser: !!user, 
    isAuthenticated: !!user && !loading, 
    loading,
    username: user?.username,
    storageAvailable: storageUtils.isStorageAvailable()
  });

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user && !loading,
      loading,
      login, 
      register,
      googleLogin,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};