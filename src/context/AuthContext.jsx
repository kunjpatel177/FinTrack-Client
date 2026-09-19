import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fintrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fintrack_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fintrack_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('fintrack_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Failed to verify token on boot:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.mfaRequired) {
      return res.data; // { mfaRequired: true, mfaType, mfaToken, email, message }
    }
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fintrack_token', jwtToken);
      localStorage.setItem('fintrack_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
  };

  const verifyMfaLogin = async ({ mfaToken, totpCode, emailOtp }) => {
    const res = await api.post('/auth/mfa/verify', { mfaToken, totpCode, emailOtp });
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fintrack_token', jwtToken);
      localStorage.setItem('fintrack_user', JSON.stringify(userData));
      return userData;
    }
  };

  const register = async (name, email, password, currency = 'INR', startingBalance = 0) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
      currency,
      startingBalance: parseFloat(startingBalance) || 0,
    });
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fintrack_token', jwtToken);
      localStorage.setItem('fintrack_user', JSON.stringify(userData));
      return userData;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
  };

  const deleteAccount = async (password) => {
    const res = await api.delete('/auth/delete-account', { data: { password } });
    if (res.data.success) {
      logout();
      return res.data;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fintrack_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        currency: user?.currency || 'INR',
        login,
        verifyMfaLogin,
        register,
        logout,
        deleteAccount,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
