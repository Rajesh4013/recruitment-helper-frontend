import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Settings as SettingsIcon, 
  ChevronLeft,
  Briefcase,
  UserPlus,
  ShieldAlert,
  FileSearch
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const recruiterManagerEmails = [
    'dhanasri91102@gmail.com'
  ]

  const isRecruiterManager = user?.Role === 'Recruiter' && recruiterManagerEmails.includes(user.Email);
  const isAdmin = user?.Role === 'Admin';

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
          <span className="menu-text">Requests Placed</span>
        </div>
        {(user?.Role !== 'Recruiter' || isRecruiterManager) && (
        <div 
          className="menu-item"
          onClick={() => onNavigate('/request-form')}
          title={collapsed ? "Request Form" : ""}
        >
          <div className="menu-icon">
            <FileText size={20} />
          </div>
          <span className="menu-text">Raise A Request</span>
        </div>
        )}
        {user?.Role === 'Recruiter' && (
          <div 
            className="menu-item"
            onClick={() => onNavigate('/resume-extractor')}
            title={collapsed ? "Resume Extractor" : ""}
          >
            <div className="menu-icon">
              <FileSearch size={20} />
            </div>
            <span className="menu-text">Resume Extractor</span>
          </div>
        )}
        {(user?.Role === 'Recruiter' || user?.Role === 'Admin') && (
          <div
            className="menu-item"
            onClick={() => onNavigate('/admin-controls')}
            title={collapsed ? "Admin Controls" : ""}
          >
            <div className="menu-icon">
              <ShieldAlert size={20} />
            </div>
            <span className="menu-text">Admin Controls</span>
          </div>
        )}
        {(isRecruiterManager || isAdmin) && (
          <div
            className="menu-item"
            onClick={() => onNavigate('/add-user')}
            title={collapsed ? "Add User" : ""}
          >
            <div className="menu-icon">
              <UserPlus size={20} />
            </div>
            <span className="menu-text">Add User</span>
          </div>
        )}
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