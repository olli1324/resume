import React from 'react';

const ExperienceItem = ({ title, company, date, description, skills }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-2">{company} | {date}</p>
    <p className="text-gray-700 mb-2">{description}</p>
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
  return (
    <section id="experience" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Work Experience</h2>
      <ExperienceItem
        title="Automation Engineer Intern"
        company="Ulmatec Handling Systems"
        date="Jun. 2024 – Jul. 2024"
        description="I worked several projects across different areas of the company. The main project involved a distance measuring system using LiDAR technology.  I applied various methods to pre-process, segment, and extract data from the LiDAR sensors. As part of this project, I also explored ways to combine point cloud data with an RGB camera feed in different coordinate systems. In another project, I helped improve an A-frame winch's control system by developing a prototype for an anti-collision system. Separately, I conducted a feasibility study to assess the potential implementation of an in-house chatbot for the service department, aiming to improve internal communication and efficiency."
        skills={["LiDAR Technology", "Control Systems", "PLS", "Python", "Git"]}
      />

      <ExperienceItem
        title="NTNU Ambassador"
        company="NTNU"
        date="Sep. 2023 – Mar. 2024"
        description="Represented NTNU to prospective students, traveling around Norway to visit high schools and provide valuable information about the university's programs and opportunities."
        skills={["Public Speaking", "University Program Knowledge", "Student Outreach", "Communication"]}
      />

      <ExperienceItem
        title="Course Leader"
        company="Forskerfabrikken"
        date="Jun. 2023"
        description="Led a science course for primary school students, conducting engaging experiments and tutoring in natural sciences. This role involved implementing interactive learning experiences to spark curiosity and foster a love for science in young minds."
        skills={["Teaching", "Experiment Facilitation"]}
      />  

      <ExperienceItem
        title="Event Coordinator"
        company="NTNU"
        date="Sep. 2022 – Jun. 2024"
        description="Event Coordinator for the Class of 2022 in the Cybernetics and Robotics program, responsible for planning and organizing various social events throughout the academic year."
        skills={["Event Planning", "Team Coordination", "Time Management", "Budgeting"]}
      />


    </section>
  );
};

export default Experience;
