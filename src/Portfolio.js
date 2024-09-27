import React from 'react';
import Hero from './components/Hero.js';
import Navigation from './components/Navigation.js';
import About from './components/About.js';
import Experience from './components/Experience.js';
import Education from './components/Education.js';
import Activities from './components/Activities.js';
import References from './components/References.js';

const Portfolio = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Hero />
      <Navigation />
      <div className="max-w-4xl mx-auto py-12 px-8">
        <About />
        <Experience />
        <Education />
        <Activities />
        <References />
      </div>
    </div>
  );
};

export default Portfolio;
