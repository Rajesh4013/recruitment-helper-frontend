import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Sun, Moon, LogOut } from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  theme: string;
  onNavigate: (path: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarCollapsed, 
  toggleTheme, 
  theme,
  onNavigate
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const openLogoutDialog = () => {
    setShowLogoutDialog(true);
  };

  const closeLogoutDialog = () => {
    setShowLogoutDialog(false);
  };

  const handleProfileClick = () => {
    onNavigate('/profile');
    setDropdownOpen(false);
  };

  return (
    <header className={`header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <h2>Recruitment Helper</h2>
      </div>
      <div className="header-right">
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </div>
        <div className="user-info">
          <span className="user-name">{user?.FirstName} { user?.LastName}</span>
        </div>
        <div className="profile-dropdown">
          <div className="dropdown-toggle" onClick={toggleDropdown}>
            <User size={24} />
          </div>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            <div className="dropdown-item" onClick={handleProfileClick}>
              <User size={16} className="dropdown-icon" />
              <span>Profile</span>
            </div>
            <div className="dropdown-item" onClick={openLogoutDialog}>
              <LogOut size={16} className="dropdown-icon" />
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </div>

      {showLogoutDialog && (
        <div className="dialog-overlay">
          <div className="dialog dialog-center">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="dialog-actions">
              <button className="btn btn-outline small-btn" onClick={closeLogoutDialog}>Cancel</button>
              <button className="btn btn-danger small-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;