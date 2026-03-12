import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Raiser Uganda</h3>
            <p className="text-gray-400 mb-4">
              Empowering Ugandans to make a difference. Join us in creating positive change in our communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/campaigns" className="text-gray-400 hover:text-white transition">Campaigns</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-white transition">How It Works</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/help" className="text-gray-400 hover:text-white transition">Help Center</Link></li>
              <li><Link to="/safety" className="text-gray-400 hover:text-white transition">Safety Tips</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-gray-400">Kampala, Uganda</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">+256 700 123456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">info@raiser.ug</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Raiser Uganda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
