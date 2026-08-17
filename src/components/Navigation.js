import React from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useSingleton } from '../hooks/useContent';

const Navigation = ({ sections = [] }) => {
  const { data: profile } = useSingleton('profile');
  const showCv = Boolean(profile?.cv_enabled && profile?.cv_url);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownload = async () => {
    if (!profile?.cv_url) return;
    const url = profile.cv_url;
    const name = profile.name?.trim() || 'CV';
    const filename = /\bCV\b/i.test(name) ? `${name}.pdf` : `${name} CV.pdf`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <nav className="sticky top-0 bg-gray-100 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="w-10 h-10" />
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => scrollToSection(s.key)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 ease-in-out transform hover:scale-110"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex w-10 h-10 items-center justify-center">
            {showCv && (
              <button
                onClick={handleDownload}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                aria-label="Download CV"
              >
                <ArrowDownToLine className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
