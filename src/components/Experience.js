import React from 'react';

const ExperienceItem = ({ title, company, date, description, skills }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-2">{company} | {date}</p>
    <p className="text-gray-700 mb-2">{description}</p>
    {skills && skills.length > 0 && (
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-1">Skills:</p>
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

const Experience = () => {
  return (
    <section id="experience" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Experience</h2>
      <ExperienceItem
        title="Leader"
        company="Ascend NTNU"
        date="April 2024 – Present"
        description="Leading one of NTNU's technical organizations, specializing in developing autonomous drones for international competitions. Managing and coordinating six teams, working closely with the board to strategically guide Ascend."
        skills={["Leadership", "Project Management", "Drone Technology", "Team Coordination", "Strategic Planning", "Recruitment"]}
      />
      <ExperienceItem
        title="Head of IT"
        company="Nettverksdagene NTNU"
        date="January 2024 – Present"
        description="Board member and leader of the IT group for Nettverksdagene, a yearly career fair. Responsible for the development and maintenance of nettverksdagene.no."
        skills={["Web Development", "IT Management", "Vue", "JavaScript", "Docker", "Event Planning"]}
      />
      <ExperienceItem
        title="Automation Engineer Intern"
        company="Ulmatec Handling Systems"
        date="June 2024 – July 2024"
        description="Worked on a distance measuring project using LiDAR technology and contributed to enhancing the control system of an A-frame winch by prototyping an anti-collision system. Conducted a feasibility study for an in-house chatbot to improve communication and efficiency within the service department."
        skills={["LiDAR Technology", "Control Systems", "Prototyping", "Feasibility Studies", "Python", "Git", "Linux"]}
      />
      <ExperienceItem
        title="Social Coordinator"
        company="NTNU"
        date="September 2022 – June 2024"
        description="Event Coordinator for the Class of 2022 in the Cybernetics and Robotics program, responsible for planning and organizing various social events throughout the academic year."
        skills={["Event Planning", "Team Coordination", "Time Management", "Budgeting"]}
      />
      <ExperienceItem
        title="NTNU Ambassador"
        company="NTNU"
        date="September 2023 – March 2024"
        description="Represented NTNU to prospective students, traveling around Norway to visit high schools and provide valuable information about the university's programs and opportunities."
        skills={["Public Speaking", "University Program Knowledge", "Student Outreach", "Communication"]}
      />
    </section>
  );
};

export default Experience;
