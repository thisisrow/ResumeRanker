import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'recruiter' or 'job_seeker'

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user || null);
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
  };

  const signup = async (email, password, role) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    await supabase.from('profiles').insert([{ id: data.user.id, role }]); // Store role
    setUser(data.user);
    setRole(role);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
