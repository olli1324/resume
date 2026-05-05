-- Run in Supabase SQL Editor to populate your DB with the current hardcoded content.
-- Safe to run once. If you re-run, delete first or it'll duplicate.

-- ============ PROFILE ============
update profile set
  name = 'Oliver H. Ekelund',
  tagline = 'Consultant @ Wideangle | Cybernetics and Robotics student on exchange in Italy',
  phone = '+4746788648',
  email = 'hei@olivere.no',
  github_url = 'https://github.com/olli1324',
  linkedin_url = 'https://www.linkedin.com/in/oliverholee'
where id = 1;

-- ============ ABOUT ============
update about set
  body = '- 4th-year MSc student in Cybernetics and Robotics at NTNU, currently on exchange in Italy at Politecnico di Torino.
- Intern experience as a full stack developer, automation engineer and mentor in the Schibsted Connect program.
- Experience managing Ascend NTNU, one of NTNUs leading technical organizations, overseeing a team of 46 students at the forefront of autonomous drone technology.
- Active in extracurriculars, being class representative for the Cybernetics Robotics Class of 2022, and previously the Head of IT at Nettverksdagene.
- Feedback from superiors and fellow students is that I am a sociable, dedicated, and hard-working individual, always seeking to improve my professional skills and innovative problem-solving abilities.
- Energized by projects that spark my interest, I thrive on facing new challenges, value supporting others'' success, and take pride in achieving measurable results in my work.'
where id = 1;

-- ============ EXPERIENCES ============
insert into experiences (title, company, date, description, skills, order_index) values
('Consultant', 'Wideangle', 'Oct. 2024 – Present',
 'Currently working for our customer Sirken, a second-hand store for B2B and B2C in the construction business. Here I am developing a new database system for their backend operations, a partner page and a new digital webstore. Previously done backend work for Drifti, as well as web development for Didit and Nidaros Bilvask. Also worked with digital marketing for several of our customers.',
 ARRAY['Web Development','Business Strategy','PostgreSQL','Next.js','TypeScript','Google/Meta Ad Tracking','Technical Consulting','Digital Marketing'], 0),
('Full Stack Developer Intern', 'FINN.no', 'Jun. 2025 – Aug. 2025',
 'I worked in a cross-functional summer team of eight students (six developers and two designers) in FINN''s Torget department. Starting from the initial idea Streaks, we designed, tested, and launched FINN Flyt, a product that reached over five million users. The process included workshops and guerrilla testing on the street, giving us direct feedback from customers throughout the design and development phases. Through the summer I got experience from a variety of technologies: building the frontend in React with TypeScript and Vite using island architecture, designing and implementing REST APIs and database models in PostgreSQL, handling data streams from Kafka with JSON serialization, and developing backend functionality in Kotlin with Ktor. The internship gave me hands-on experience with user-centered product development, modern tech stacks, and how to efficiently develop an MVP out of an idea, and eventually take it to production.',
 ARRAY['Kotlin','React','TypeScript','PostgreSQL','Kafka','JSON Serialization','REST API','Ktor','Guerrilla Testing'], 1),
('Automation Engineer Intern', 'Ulmatec Handling Systems', 'Jun. 2024 – Jul. 2024',
 'I worked at several projects across different areas of the company. The main project involved a distance measuring system using LiDAR technology. I tested and applied various methods to pre-process, segment, and extract data from the LiDAR sensors. As part of this project, I also explored methods to align and fuse point cloud data with an RGB camera feed from a different coordinate system. In another project, I helped improve an A-frame winch''s control system by developing a prototype for an anti-collision system in Python. Additionally, I explored Large Language Models (LLMs), using Retrieval-Augmented Generation (RAG) and LangChain to develop a chatbot. I then conducted a feasibility study on implementing an in-house chatbot for the service department, aiming to enhance internal communication and improve efficiency.',
 ARRAY['LiDAR Technology','Control Systems','PLS','Python','Git'], 2),
('NTNU Ambassador', 'NTNU', 'Sep. 2023 – Mar. 2024',
 'Represented NTNU to prospective students, traveling around Norway to visit high schools and provide valuable information about the university''s programs and opportunities.',
 ARRAY['Public Speaking','University Program Knowledge','Student Outreach','Communication'], 3),
('Course Leader', 'Forskerfabrikken', 'Jun. 2023',
 'Led a science course for primary school students, conducting engaging experiments and tutoring in natural sciences. This role involved implementing interactive learning experiences to spark curiosity and foster a love for science in young minds.',
 ARRAY['Teaching','Experiment Facilitation'], 4),
('Event Coordinator', 'NTNU', 'Sep. 2022 – Jun. 2024',
 'Event Coordinator for the Class of 2022 in the Cybernetics and Robotics program, responsible for planning and organizing various social events throughout the academic year.',
 ARRAY['Event Planning','Team Coordination','Time Management','Budgeting'], 5);

-- ============ ACTIVITIES ============
insert into activities (title, organization, date, description, skills, order_index) values
('Leader', 'Ascend NTNU', 'Apr. 2024 – Sep. 2025',
 'Led Ascend NTNU, a student organization at NTNU developing autonomous drones for international competitions. Coordinated 46 students across six interdisciplinary groups, balancing technical planning with project execution, and worked with the board to provide strategic direction.',
 ARRAY['Leadership','Project Management','Drone Technology','Team Coordination','Strategic Planning','Recruitment'], 0),
('Head of IT', 'Nettverksdagene NTNU', 'Jan. 2024 – Mar. 2025',
 'Served as a board member and leader of the IT group for Nettverksdagene, an annual career fair for engineering students. Led development and maintenance of nettverksdagene.no, implementing new features for students, companies, and members, including a digital student + company matchmaker in JavaScript, a dynamic stand map in Vue.js, and a more reliable email system.',
 ARRAY['Web Development','IT Management','Vue','JavaScript','Docker','Git','GitHub','Event Planning'], 1),
('Mentor Candidate', 'Schibsted Connect', 'Sep. 2023 – Jun. 2024',
 'Participated in a mutual mentorship program with the CTO of Schibsted SMB, engaging in hands-on learning opportunities and bringing new perspectives to enrich the experience for both parties. Gained valuable insights into technical leadership and strategic business development within the media and technology sector.',
 ARRAY['Strategic Mentoring','Professional Networking','Business Strategy','Knowledge Sharing','Industry Insights'], 2),
('Election- and Control Committee Member', 'NTNUI Triathlon', 'Feb. 2024 – Feb. 2025',
 'Propose the next board at the annual meeting and participate in awarding prizes to outstanding student athletes.',
 ARRAY['Student Athlete Support'], 3),
('Head of Finance', 'Kielderstyret - Sct. Omega', 'Sep. 2023 – Sep. 2024',
 'The Kielder Committee manages and maintains Omega''s student bar at Moholt. I was responsible for accounting and budgeting, as well as securing funding from various organizations.',
 ARRAY['Financial Management','Budgeting','Accounting'], 4),
('Videographer', 'UKA', 'Feb. 2023 - Des. 2023',
 'Video photographer for UKA 2023, Norway''s largest cultural festival. My role involved filming and editing content of events leading up to and during UKA 2023.',
 ARRAY['Video Production','DaVinci Resolve','Editing','Creative Content'], 5),
('Coordinator', 'Fadderstyret - Sct. Omega', 'Jan. 2023 - Sep. 2023',
 'The Student Buddy Committee organizes the welcome period for the 400 new students who join the Omega student association each fall. I was responsible for planning and organizing activities, as well as securing sponsorships.',
 ARRAY['Event Planning','Team Coordination'], 6),
('Class Representative', 'NTNU', 'Aug. 2022 – Present',
 'Represent the interests of the Cybernetics Robotics Class of 2022.',
 ARRAY['Communication','Advocacy','Problem-solving'], 7);

-- ============ EDUCATION ============
-- NOTE: education table needs a `skills` column. If you didn't add it, run:
-- alter table education add column if not exists skills text[] not null default '{}';
insert into education (degree, institution, date, description, skills, order_index) values
('M.Sc. Cybernetics and Robotics', 'NTNU Trondheim', 'Aug. 2022 – Present',
 '5-year Engineering Master''s program.

Combining mathematics, control systems, natural sciences, and computer technology to analyze dynamic systems. Specializing in machine learning and autonomous systems.
Experience from comprehensive labs with everything from developing distributed systems of three synced elevators, to regulating a helicopter''s flight dynamics.',
 ARRAY['Control Systems','Machine Learning','Mathematics','Computer Science','Robotics','PID'], 0),
('Folk High School', 'Valdres Folkehøgskole', 'Aug. 2021 – Jun. 2022',
 'Paragliding class of 2021. Lushoto Committee member.',
 ARRAY['Paragliding','Team Collaboration'], 1);
