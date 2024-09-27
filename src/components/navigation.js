import React from 'react';

const Navigation = () => {
  return (
    <nav className="sticky top-0 bg-white shadow-md z-10">
      <div className="max-w-4xl mx-auto py-4 px-8 flex justify-center space-x-4">
        <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
        <a href="#experience" className="text-gray-600 hover:text-gray-900">Experience</a>
        <a href="#education" className="text-gray-600 hover:text-gray-900">Education</a>
        <a href="#activities" className="text-gray-600 hover:text-gray-900">Activities</a>
        <a href="#references" className="text-gray-600 hover:text-gray-900">References</a>
      </div>
    </nav>
  );
};

export default Navigation;
