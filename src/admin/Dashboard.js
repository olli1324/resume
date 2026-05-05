import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui';
import ProfileForm from './forms/ProfileForm';
import SectionsForm from './forms/SectionsForm';
import AboutForm from './forms/AboutForm';
import ItemList from './ItemList';
import ExperienceForm from './forms/ExperienceForm';
import ActivityForm from './forms/ActivityForm';
import EducationForm from './forms/EducationForm';
import ReferenceForm from './forms/ReferenceForm';
import ProjectForm from './forms/ProjectForm';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'sections', label: 'Sections' },
  { key: 'about', label: 'About' },
  { key: 'experience', label: 'Experience' },
  { key: 'activities', label: 'Activities' },
  { key: 'education', label: 'Education' },
  { key: 'projects', label: 'Projects' },
  { key: 'references', label: 'References' },
];

const Dashboard = () => {
  const [tab, setTab] = useState('profile');

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const renderTab = () => {
    switch (tab) {
      case 'profile':
        return <ProfileForm />;
      case 'sections':
        return <SectionsForm />;
      case 'about':
        return <AboutForm />;
      case 'experience':
        return (
          <ItemList
            table="experiences"
            FormComponent={ExperienceForm}
            renderSummary={(item) => (
              <div>
                <div className="font-semibold text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">{item.company} | {item.date}</div>
                <div className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</div>
              </div>
            )}
          />
        );
      case 'activities':
        return (
          <ItemList
            table="activities"
            FormComponent={ActivityForm}
            renderSummary={(item) => (
              <div>
                <div className="font-semibold text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">{item.organization} | {item.date}</div>
                <div className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</div>
              </div>
            )}
          />
        );
      case 'education':
        return (
          <ItemList
            table="education"
            FormComponent={EducationForm}
            renderSummary={(item) => (
              <div>
                <div className="font-semibold text-gray-800">{item.degree}</div>
                <div className="text-sm text-gray-600">{item.institution} | {item.date}</div>
              </div>
            )}
          />
        );
      case 'projects':
        return (
          <ItemList
            table="projects"
            FormComponent={ProjectForm}
            renderSummary={(item) => (
              <div className="flex gap-3">
                {item.image_urls && item.image_urls[0] && (
                  <img src={item.image_urls[0]} alt="" className="w-20 h-20 rounded object-cover shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-gray-800">
                    {item.title}
                    {item.featured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Featured</span>}
                  </div>
                  <div className="text-sm text-gray-600">{item.date}</div>
                  <div className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</div>
                </div>
              </div>
            )}
          />
        );
      case 'references':
        return (
          <ItemList
            table="references"
            FormComponent={ReferenceForm}
            renderSummary={(item) => (
              <div>
                <div className="font-semibold text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-600">{item.title}</div>
                <div className="text-sm text-gray-500">{item.contact}</div>
              </div>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Portfolio CMS</h1>
            <a href="/" className="text-sm text-gray-500 hover:text-gray-800">← Back to site</a>
          </div>
          <Button variant="secondary" onClick={logout}>Sign out</Button>
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-3 flex flex-wrap gap-1 border-t border-gray-100 pt-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                tab === t.key ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{renderTab()}</main>
    </div>
  );
};

export default Dashboard;
