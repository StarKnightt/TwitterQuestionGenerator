import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="mb-4 md:mb-0">&copy; 2024 TechQuest. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;