import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: user?.FirstName + ' ' + user?.LastName || '',
    email: user?.Email || '',
    phone: '(555) 123-4567',
    department: 'HR',
    position: user?.Role,
    bio: 'Experienced with 5+ years.'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the form data to an API
    console.log('Profile updated:', formData);
    // Show success message
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.FirstName?.charAt(0) || 'U'}
          {user?.LastName?.charAt(0) || 'S'}
        </div>
        <div className="profile-info">
          <h2>{user?.FirstName} {user?.LastName}</h2>
          <p>{user?.Role}</p>
        </div>
      </div>
      
      <div className="profile-tabs">
        <div 
          className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </div>
        <div 
          className={`profile-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account Settings
        </div>
      </div>
      
      {activeTab === 'personal' && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                className="form-control"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      
      {activeTab === 'account' && (
        <div className="card">
          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              className="form-control"
            />
          </div>
          
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-primary">
              Update Password
            </button>
          </div>
          
          <hr style={{ margin: '30px 0', borderColor: 'var(--border-color)' }} />
          
          <h3 className="mb-3">Danger Zone</h3>
          <p className="mb-3">Once you delete your account, there is no going back. Please be certain.</p>
          <button type="button" className="btn" style={{ backgroundColor: 'var(--danger-color)', color: 'white' }}>
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;