import React from 'react';
import { useList } from '../hooks/useContent';

const References = () => {
  const { items, loading } = useList('references', { onlyVisible: true });

  return (
    <section id="references" className="mb-16">
      <h2 className="text-3xl font-bold mb-4">References</h2>
      {!loading && items.length === 0 && (
        <p className="text-gray-700">References are provided upon request.</p>
      )}
      {items.map(ref => (
        <div key={ref.id} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">{ref.name}</h3>
          {ref.title && <p className="text-gray-600">{ref.title}</p>}
          {ref.contact && <p className="text-gray-600 mb-1">{ref.contact}</p>}
          {ref.body && <p className="text-gray-700 whitespace-pre-line">{ref.body}</p>}
        </div>
      ))}
    </section>
  );
};

export default References;
