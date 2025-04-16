import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
const api = axios.create({
  baseURL: 'https://login-8elt.vercel.app',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    return Promise.reject(error);
  }
);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/api/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Profile fetch error:', error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Server is taking too long to respond. Please try again.');
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please check your internet connection.');
      } else {
        throw new Error('An unexpected error occurred during login');
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/signup', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Server is taking too long to respond. Please try again.');
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please check your internet connection.');
      } else {
        throw new Error('An unexpected error occurred during registration');
      }
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      setUser(prevUser => ({ ...prevUser, ...response.data }));
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Profile update failed');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Server is taking too long to respond. Please try again.');
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please check your internet connection.');
      } else {
        throw new Error('An unexpected error occurred during profile update');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 