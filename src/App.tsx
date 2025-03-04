import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth
import Login from './pages/Login';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import ResourceRequests from './pages/ResourceRequests';
import RequestForm from './pages/RequestForm';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ViewRequest from './pages/ViewRequest';
import EditRequest from './pages/EditRequest';
import AdminControls from './pages/AdminControls';
import EditRequestForm from './pages/EditRequestForm';
import AddUser from './pages/AddUser';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
};

// Public Route Component - redirects to dashboard if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <div className="app">
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/resource-requests" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <ResourceRequests />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/resource-requests/view/:id" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <ViewRequest />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/resource-requests/edit/:id" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <EditRequest />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/request-form" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <RequestForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/request-form/edit/:id" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <EditRequestForm />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin-controls" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <AdminControls />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/add-user" element={
              <ProtectedRoute>
                <Layout toggleTheme={toggleTheme} theme={theme}>
                  <AddUser />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;