import React, { useEffect, useState } from 'react';
import { getAdminSession } from '../lib/api';
import Login from './Login';
import Dashboard from './Dashboard';

const AdminApp = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminSession().then((ok) => {
      setLoggedIn(ok);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">Loading…</div>;
  }

  return loggedIn
    ? <Dashboard onLogout={() => setLoggedIn(false)} />
    : <Login onLogin={() => setLoggedIn(true)} />;
};

export default AdminApp;
