import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Upload, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#FB3A26] to-[#FFC344] bg-clip-text text-transparent">
                Boom
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-gray-600 px-3 py-1 rounded-full bg-gray-100">
                  ₹{balance}
                </div>
                <Link 
                  to="/upload" 
                  className="flex items-center px-4 py-2 rounded-full bg-[#FB3A26] text-white hover:bg-opacity-90 transition"
                >
                  <Upload size={18} className="mr-1" />
                  Upload
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                    <User size={20} />
                    <span>{user?.username}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-2 rounded-full bg-[#FB3A26] text-white hover:bg-opacity-90 transition"
              >
                Sign In
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <div className="flex justify-between items-center px-3 py-2">
                  <span className="text-gray-700">{user?.username}</span>
                  <span className="text-gray-600 px-3 py-1 rounded-full bg-gray-100">
                    ₹{balance}
                  </span>
                </div>
                <Link 
                  to="/upload" 
                  className="flex items-center px-3 py-2 rounded-md text-[#FB3A26]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Upload size={18} className="mr-2" />
                  Upload
                </Link>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="inline mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-red-600"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="block px-3 py-2 rounded-md text-[#FB3A26] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;