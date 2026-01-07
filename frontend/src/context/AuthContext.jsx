import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (token) {
        // Ideally verify token with backend
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Fetch user profile if needed
        setUser({ name: 'User' }); // Placeholder
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => { // Username or email
    const response = await api.post('/auth/login', { username, password });
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setUser({ username }); // Decoded token would be better
  };

  const register = async (username, password) => {
    await api.post('/users', { username, password }); // Or /auth/register
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
