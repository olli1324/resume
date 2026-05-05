import React from 'react';
import { useList } from '../hooks/useContent';

const ExperienceItem = ({ title, company, date, description, skills }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-2">{company} | {date}</p>
    <p className="text-gray-700 mb-2 whitespace-pre-line">{description}</p>
    {skills && skills.length > 0 && (
      <div>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill, index) => (
            <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const Experience = () => {
  const { items } = useList('experiences', { onlyVisible: true });

  return (
    <section id="experience" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Work Experience</h2>
      {items.map(item => (
        <ExperienceItem
          key={item.id}
          title={item.title}
          company={item.company}
          date={item.date}
          description={item.description}
          skills={item.skills}
        />
      ))}
    </section>
  );
};

export default Experience;
