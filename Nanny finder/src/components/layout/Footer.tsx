import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex items-center text-primary-400">
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
            </div>
            <p className="text-gray-400 text-sm">
              NannyConnect helps Ugandan families find trusted, qualified childcare providers. 
              We connect parents with experienced nannies for reliable childcare services.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/nannies" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Find Nannies
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* For Nannies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Nannies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register-as-nanny" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Register as a Nanny
                </Link>
              </li>
              <li>
                <Link to="/nanny-resources" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Nanny Resources
                </Link>
              </li>
              <li>
                <Link to="/nanny-faq" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Nanny FAQ
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Training Opportunities
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-primary-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Plot 45, Kampala Road<br />
                  Kampala, Uganda
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">+256 700 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">info@nannyconnect.ug</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} NannyConnect Uganda. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-sm text-gray-500 hover:text-primary-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;