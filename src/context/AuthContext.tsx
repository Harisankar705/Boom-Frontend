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

const storageUtils = {
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  memoryStorage: {} as Record<string, string>,

  setItem(key: string, value: string): void {
    try {
      if (this.isStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        this.memoryStorage[key] = value;
      }
    } catch (error) {
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
      delete this.memoryStorage[key];
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token: string) => {
    storageUtils.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const clearAuthToken = () => {
    storageUtils.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const initializeAuth = async () => {
      
      try {
        const token = storageUtils.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

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