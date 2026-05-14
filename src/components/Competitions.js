import React, { useState } from 'react';
import { useList } from '../hooks/useContent';

const CompetitionImages = ({ urls, title }) => {
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

const CompetitionItem = ({ item }) => {
  const hasImages = item.image_urls && item.image_urls.length > 0;
  return (
    <div className="mb-10 grid md:grid-cols-12 gap-6 items-start">
      <div className={hasImages ? 'md:col-span-7 order-2 md:order-1' : 'md:col-span-12'}>
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
          {item.date && <p className="text-gray-600 text-sm">{item.date}</p>}
        </div>
        <p className="text-gray-600 mb-2">
          {[item.event, item.role, item.location].filter(Boolean).join(' | ')}
        </p>
        {item.placement && (
          <div className="mb-2">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              🏆 {item.placement}
            </span>
          </div>
        )}
        {item.description && (
          <p className="text-gray-700 mb-2 whitespace-pre-line">{item.description}</p>
        )}
        {item.link_url && (
          <a
            href={item.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-700 underline hover:text-gray-900"
          >
            Read more →
          </a>
        )}
        {item.skills && item.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {item.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
      {hasImages && (
        <div className="md:col-span-5 order-1 md:order-2">
          <CompetitionImages urls={item.image_urls} title={item.title} />
        </div>
      )}
    </div>
  );
};

const Competitions = () => {
  const { items } = useList('competitions', { onlyVisible: true });

  return (
    <section id="competitions" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Competitions</h2>
      {items.map(item => (
        <CompetitionItem key={item.id} item={item} />
      ))}
    </section>
  );
};

export default Competitions;
