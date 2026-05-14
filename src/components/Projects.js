import React, { useState } from 'react';
import { useList } from '../hooks/useContent';

const ProjectImages = ({ urls, title }) => {
  const [active, setActive] = useState(0);
  if (!urls || urls.length === 0) return null;
  return (
    <div>
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-sm">
        <img
          src={urls[active]}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {urls.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className={`w-12 h-12 rounded overflow-hidden border-2 ${
                i === active ? 'border-gray-800' : 'border-transparent'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectItem = ({ project, featured }) => {
  const hasImages = project.image_urls && project.image_urls.length > 0;
  return (
    <div className={`mb-10 ${featured ? 'border-l-4 border-gray-800 pl-4' : ''}`}>
      <div className="grid md:grid-cols-12 gap-6 items-start">
        <div className={hasImages ? 'md:col-span-7 order-2 md:order-1' : 'md:col-span-12'}>
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
            {project.date && <p className="text-gray-600 text-sm">{project.date}</p>}
          </div>
          {project.description && (
            <p className="text-gray-700 mb-2 mt-1 whitespace-pre-line">{project.description}</p>
          )}
          <div className="flex flex-wrap gap-3 mb-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 underline hover:text-gray-900"
              >
                Live →
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 underline hover:text-gray-900"
              >
                Code →
              </a>
            )}
          </div>
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tech_stack.map((t, i) => (
                <span
                  key={i}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        {hasImages && (
          <div className="md:col-span-5 order-1 md:order-2">
            <ProjectImages urls={project.image_urls} title={project.title} />
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const { items } = useList('projects', { onlyVisible: true });
  const featured = items.filter(p => p.featured);
  const rest = items.filter(p => !p.featured);

  return (
    <section id="projects" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Projects</h2>
      {featured.map(p => <ProjectItem key={p.id} project={p} featured />)}
      {rest.map(p => <ProjectItem key={p.id} project={p} />)}
    </section>
  );
};

export default Projects;
