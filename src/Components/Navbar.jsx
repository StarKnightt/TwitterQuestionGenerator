// components/Navbar.js
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">TechQuest</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-800 hover:text-blue-600 transition">Home</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 transition">About</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 transition">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;