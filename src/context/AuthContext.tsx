import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
  EmployeeID: string;
  Email: string;
  FirstName: string;
  LastName: string;
  Role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (data: { token: string; employee: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const navigate = useNavigate();

  const login = (data: { token: string; employee: User }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.employee));
    setToken(data.token);
    setUser(data.employee);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};