import React from 'react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Activities from './components/Activities';
import Projects from './components/Projects';
import References from './components/References';
import { useSections } from './hooks/useContent';

const sectionComponents = {
  about: About,
  experience: Experience,
  education: Education,
  activities: Activities,
  projects: Projects,
  references: References,
};

const Portfolio = () => {
  const { sections } = useSections({ onlyVisible: true });

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      <Hero />
      <Navigation sections={sections} />
      <div className="max-w-4xl mx-auto py-12 px-8">
        {sections.map(s => {
          const Component = sectionComponents[s.key];
          if (!Component) return null;
          return (
            <section key={s.key} id={s.key}>
              <Component />
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;
