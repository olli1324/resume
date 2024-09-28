import React from 'react';

const EducationItem = ({ title, institution, date, description, skills }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-2">{institution} | {date}</p>
    <p className="text-gray-700 mb-2">{description}</p>
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
  return (
    <section id="education" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Education</h2>
      <EducationItem
        title="M.Sc. Cybernetics and Robotics"
        institution="NTNU Trondheim"
        date="August 2022 – Present"
        description="
        5-year Engineering Master's program.

        Combining mathematics, control systems, natural sciences, and computer technology to analyze dynamic systems. Focused on diving deeper into machine learning."
        skills={["Control Systems", "Machine Learning", "Mathematics", "Computer Science", "Robotics"]}
      />
      <EducationItem
        title="Folk High School"
        institution="Valdres Folkehøgskole"
        date="August 2021 – June 2022"
        description="Paragliding class of 2021. Lushoto Committee member."
        skills={["Paragliding", "Team Collaboration"]}
      />
    </section>
  );
};

export default Education;
