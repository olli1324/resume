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
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      <Hero />
      <Navigation />
      <div className="max-w-4xl mx-auto py-12 px-8">
        <section id="about"><About /></section>
        <section id="experience"><Experience /></section>
        <section id="education"><Education /></section>
        <section id="activities"><Activities /></section>
        <section id="references"><References /></section>
      </div>
    </div>
  );
};

export default Portfolio;