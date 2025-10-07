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
        title="Consultant"
        company="Wideangle"
        date="Oct. 2024 – Present"
        description="Currently working for our customer Sirken, a second-hand store for B2B and B2C in the construction business. Here I am developing a new database system for their backend operations, a partner page and a new digital webstore. Previously done backend work for Drifti, as well as web development for Didit and Nidaros Bilvask. Also worked with digital marketing for several of our customers."
        skills={["Web Development", "Business Strategy", "PostgreSQL", "Next.js", "TypeScript", "Google/Meta Ad Tracking", "Technical Consulting", "Digital Marketing"]}
      />
      <ExperienceItem
        title="Full Stack Developer Intern"
        company="FINN.no"
        date="Jun. 2025 – Aug. 2025"
        description="I worked in a cross-functional summer team of eight students (six developers and two designers) in FINN’s Torget department. Starting from the initial idea Streaks, we designed, tested, and launched FINN Flyt, a product that reached over five million users. The process included workshops and guerrilla testing on the street, giving us direct feedback from customers throughout the design and development phases. Through the summer I got experience from a variety of technologies: building the frontend in React with TypeScript and Vite using island architecture, designing and implementing REST APIs and database models in PostgreSQL, handling data streams from Kafka with JSON serialization, and developing backend functionality in Kotlin with Ktor. The internship gave me hands-on experience with user-centered product development, modern tech stacks, and how to efficiently develop an MVP out of an idea, and eventually take it to production."
        skills={["Kotlin", "React", "TypeScript", "PostgreSQL", "Kafka", "JSON Serialization", "REST API", "Ktor", "Guerrilla Testing"]}
      />
      <ExperienceItem
        title="Automation Engineer Intern"
        company="Ulmatec Handling Systems"
        date="Jun. 2024 – Jul. 2024"
        description="I worked at several projects across different areas of the company. The main project involved a distance measuring system using LiDAR technology. I tested and applied various methods to pre-process, segment, and extract data from the LiDAR sensors. As part of this project, I also explored methods to align and fuse point cloud data with an RGB camera feed from a different coordinate system. In another project, I helped improve an A-frame winch's control system by developing a prototype for an anti-collision system in Python. Additionally, I explored Large Language Models (LLMs), using Retrieval-Augmented Generation (RAG) and LangChain to develop a chatbot. I then conducted a feasibility study on implementing an in-house chatbot for the service department, aiming to enhance internal communication and improve efficiency."
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
