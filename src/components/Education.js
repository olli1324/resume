import React from 'react';
import { useList } from '../hooks/useContent';

const EducationItem = ({ degree, institution, date, description, skills }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800">{degree}</h3>
    <p className="text-gray-600 mb-2">{institution} | {date}</p>
    <p className="text-gray-700 mb-2 whitespace-pre-line">{description}</p>
    {skills && skills.length > 0 && (
      <div>
        <div className="flex flex-wrap gap-2">
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

const Education = () => {
  const { items } = useList('education', { onlyVisible: true });

  return (
    <section id="education" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Education</h2>
      {items.map(item => (
        <EducationItem
          key={item.id}
          degree={item.degree}
          institution={item.institution}
          date={item.date}
          description={item.description}
          skills={item.skills}
        />
      ))}
    </section>
  );
};

export default Education;
