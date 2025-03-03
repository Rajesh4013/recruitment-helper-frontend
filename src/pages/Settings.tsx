import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    autoSave: true,
    language: 'english'
  });

  const handleToggleChange = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="settings-container">
      <h1 className="mb-4">Settings</h1>
      
      <div className="card mb-4">
        <div className="settings-section">
          <h3 className="settings-title">Notifications</h3>
          
          <div className="form-group flex justify-between align-center">
            <label>Enable Notifications</label>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.notifications} 
                onChange={() => handleToggleChange('notifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="form-group flex justify-between align-center">
            <label>Email Alerts</label>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.emailAlerts} 
                onChange={() => handleToggleChange('emailAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="settings-section">
          <h3 className="settings-title">Appearance</h3>
          
          <div className="form-group flex justify-between align-center">
            <label>Dark Mode</label>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.darkMode} 
                onChange={() => handleToggleChange('darkMode')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              className="form-control"
              value={settings.language}
              onChange={handleSelectChange}
              style={{ maxWidth: '200px' }}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="settings-section">
          <h3 className="settings-title">Application</h3>
          
          <div className="form-group flex justify-between align-center">
            <label>Auto Save</label>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.autoSave} 
                onChange={() => handleToggleChange('autoSave')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="form-group">
            <button className="btn btn-outline">Clear Cache</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;