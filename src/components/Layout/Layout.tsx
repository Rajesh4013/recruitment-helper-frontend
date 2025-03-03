import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  theme: string;
}

const Layout: React.FC<LayoutProps> = ({ children, toggleTheme, theme }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        onNavigate={handleNavigate}
      />
      <div className={`layout-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header 
          sidebarCollapsed={sidebarCollapsed} 
          toggleTheme={toggleTheme} 
          theme={theme}
          onNavigate={handleNavigate}
        />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;