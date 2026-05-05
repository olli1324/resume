import React from 'react';

const Navigation = ({ sections = [] }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 bg-gray-100 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="w-10 h-10" />
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => scrollToSection(s.key)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 ease-in-out transform hover:scale-110"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:block" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
