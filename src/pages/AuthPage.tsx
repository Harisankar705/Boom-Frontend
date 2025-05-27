import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB3A26]"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center mb-8">
        <Flame className="h-12 w-12 text-[#FB3A26] mx-auto mb-2" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FB3A26] to-[#FFC344] bg-clip-text text-transparent">
          Boom
        </h1>
        <p className="text-gray-600 mt-2">Discover and share amazing videos</p>
      </div>
      
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;