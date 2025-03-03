import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Settings as SettingsIcon, 
  ChevronLeft,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  toggleSidebar,
  onNavigate
}) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div 
          className="logo" 
          onClick={collapsed ? toggleSidebar : undefined}
          style={{ cursor: collapsed ? 'pointer' : 'default' }}
        >
          <Briefcase className="logo-icon" size={24} />
          <span className="logo-text">RecHelper</span>
        </div>
        {!collapsed && (
          <div className="toggle-btn" onClick={toggleSidebar}>
            <ChevronLeft size={20} />
          </div>
        )}
      </div>
      <nav className="sidebar-menu">
        <div 
          className="menu-item" 
          onClick={() => onNavigate('/')}
          title={collapsed ? "Dashboard" : ""}
        >
          <div className="menu-icon">
            <Home size={20} />
          </div>
          <span className="menu-text">Dashboard</span>
        </div>
        <div 
          className="menu-item"
          onClick={() => onNavigate('/resource-requests')}
          title={collapsed ? "Resource Requests" : ""}
        >
          <div className="menu-icon">
            <Users size={20} />
          </div>
          <span className="menu-text">Resource Requests</span>
        </div>
        <div 
          className="menu-item"
          onClick={() => onNavigate('/request-form')}
          title={collapsed ? "Request Form" : ""}
        >
          <div className="menu-icon">
            <FileText size={20} />
          </div>
          <span className="menu-text">Request Form</span>
        </div>
        <div 
          className="menu-item"
          onClick={() => onNavigate('/settings')}
          title={collapsed ? "Settings" : ""}
        >
          <div className="menu-icon">
            <SettingsIcon size={20} />
          </div>
          <span className="menu-text">Settings</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;