import React from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Flame className="h-6 w-6 text-[#FB3A26] mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#FB3A26] to-[#FFC344] bg-clip-text text-transparent">
                Boom
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              The platform for both short-form and long-form video content.
              Discover, create, and monetize your videos.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-400 hover:text-white transition">
                  Upload
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Copyright
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Boom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;