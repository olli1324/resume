import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Login from './Login';
import Dashboard from './Dashboard';

const AdminApp = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">Loading…</div>;
  }

  return session ? <Dashboard /> : <Login />;
};

export default AdminApp;
