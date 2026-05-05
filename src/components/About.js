import React from 'react';
import { useSingleton } from '../hooks/useContent';

const About = () => {
  const { data } = useSingleton('about');
  const body = data?.body || '';

  const lines = body.split('\n').map(l => l.trim()).filter(Boolean);
  const isBulleted = lines.every(l => l.startsWith('- ') || l.startsWith('* '));

  return (
    <section id="about" className="mb-16">
      <h2 className="text-3xl font-bold mb-4">About Me</h2>
      {isBulleted && lines.length > 0 ? (
        <ul className="text-gray-700 list-disc pl-5 space-y-1">
          {lines.map((l, i) => (
            <li key={i}>{l.replace(/^[-*]\s+/, '')}</li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-700 whitespace-pre-line">{body}</div>
      )}
    </section>
  );
};

export default About;
