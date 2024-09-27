import React from 'react';
import { Mail, Linkedin, Github, Phone } from 'lucide-react';

const Hero = () => (
  <div className="py-24 px-8">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center">
      <div className="md:mr-8 mb-6 md:mb-0">
        <img
          src="/assets/profilepicture.jpg"
          alt="Oliver H. Ekelund"
          className="rounded-full w-48 h-48 object-cover border-4 border-gray-200 shadow-lg"
        />
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Oliver H. Ekelund</h1>
        <p className="text-2xl mb-6 text-gray-700">Leader @ Ascend NTNU | M. Sc. Cybernetics and Robotics student @ NTNU</p>
        <div className="flex justify-center md:justify-start space-x-6">
          <a href="tel:+4746788648" className="text-gray-700 hover:text-gray-900" aria-label="Phone">
            <Phone size={24} />
          </a>
          <a href="mailto:oliver.hole.ekelund@hotmail.no" className="text-gray-700 hover:text-gray-900" aria-label="Email">
            <Mail size={24} />
          </a>
          <a href="https://github.com/olli1324" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900" aria-label="GitHub">
            <Github size={24} />
          </a>
          <a href="https://www.linkedin.com/in/oliver-hole-ekelund" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900" aria-label="LinkedIn">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
