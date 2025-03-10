import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Sun, Moon, LogOut, Bell } from 'lucide-react';
import './Header.css'; // Import the CSS file

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
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { message: 'New request submitted', createdAt: new Date() },
    { message: 'Candidate interview scheduled', createdAt: new Date() },
    { message: 'Request approved', createdAt: new Date() },
    { message: 'New candidate added', createdAt: new Date() }
  ];

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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
      notificationsRef.current && !notificationsRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <Link to="/dashboard" className="logo">
          RecHelper
        </Link>
      </div>
      <div className="header-right">
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </div>
        <div className="notification-icon" onClick={toggleNotifications} ref={notificationsRef}>
          <Bell size={20} />
          {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
        </div>
        {user && (
          <>
            {/* <div className="profile-info">
              <span className="profile-name">{user.FirstName} {user.LastName}</span> */}
              {/* <span className="profile-role">{user.Role}</span> */}
            {/* </div> */}
            <div className="header-profile-avatar small-avatar" onClick={toggleDropdown}>
              {user.FirstName.charAt(0)}
              {user.LastName.charAt(0)}
            </div>
          </>
        )}
        <div className="profile-dropdown" ref={dropdownRef}>
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

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
          </div>
          <ul className="notifications-list">
            {notifications.map((notification, index) => (
              <li key={index} className="notification-item">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{new Date(notification.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showLogoutDialog && (
        <div className="dialog-overlay">
          <div className="dialog dialog-center">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="dialog-actions">
              <button className="btn btn-outline small-btn" onClick={closeLogoutDialog}>Cancel</button>
              <button className="btn btn-danger small-btn custom-danger-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;