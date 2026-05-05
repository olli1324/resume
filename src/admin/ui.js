import React from 'react';

export const Input = ({ label, ...props }) => (
  <label className="block mb-3">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    <input
      {...props}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
    />
  </label>
);

export const Textarea = ({ label, rows = 4, ...props }) => (
  <label className="block mb-3">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    <textarea
      {...props}
      rows={rows}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
    />
  </label>
);

export const Toggle = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center cursor-pointer select-none">
    <span className="text-sm text-gray-700 mr-2">{label}</span>
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only peer"
    />
    <div className="relative w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-gray-800 transition-colors">
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </div>
  </label>
);

export const Button = ({ variant = 'primary', className = '', ...props }) => {
  const base = 'px-3 py-1.5 rounded font-medium text-sm transition-colors disabled:opacity-60';
  const variants = {
    primary: 'bg-gray-800 text-white hover:bg-gray-900',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-700 hover:bg-gray-200',
  };
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-5 ${className}`}>{children}</div>
);

export const TagsInput = ({ value = [], onChange, label, placeholder = 'Add and press Enter' }) => {
  const [draft, setDraft] = React.useState('');
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...value, t]);
    setDraft('');
  };
  return (
    <div className="mb-3">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((t, i) => (
          <span key={i} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {t}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="text-gray-500 hover:text-gray-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <Button type="button" variant="secondary" onClick={add}>Add</Button>
      </div>
    </div>
  );
};
