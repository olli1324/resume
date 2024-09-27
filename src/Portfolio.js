import React from 'react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Activities from './components/Activities';
import References from './components/References';

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
