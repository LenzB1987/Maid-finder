import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Search, MessageCircle, Bell } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // For demo purposes
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Nannies', path: '/nannies' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center text-primary-600">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M16 16v-4a4 4 0 0 0-8 0v4" />
                  <path d="M12 16v4" />
                  <path d="M8 8V5a4 4 0 0 1 8 0v3" />
                </svg>
                <span className="ml-2 text-xl font-bold">NannyConnect</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-base font-medium transition-colors hover:text-primary-600',
                  location.pathname === link.path
                    ? 'text-primary-700 font-medium'
                    : 'text-gray-600'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button className="text-gray-500 hover:text-primary-600 relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent-500 text-[10px] text-white flex items-center justify-center">3</span>
                </button>
                <button className="text-gray-500 hover:text-primary-600 relative">
                  <MessageCircle size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent-500 text-[10px] text-white flex items-center justify-center">2</span>
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <User size={16} />
                    </div>
                    <span className="font-medium">Account</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block animate-slideDown">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">Dashboard</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">Profile</Link>
                    <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">My Bookings</Link>
                    <button 
                      onClick={() => setIsLoggedIn(false)} 
                      className="w-full text-left block px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsLoggedIn(true)}
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => setIsLoggedIn(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slideDown">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'block py-2 text-base font-medium',
                  location.pathname === link.path
                    ? 'text-primary-700'
                    : 'text-gray-600'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-base font-medium text-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-base font-medium text-error-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsMenuOpen(false);
                    }}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;