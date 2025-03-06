import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService, Profile as ProfileType } from '../services/profileService';
import './Profile.css'; // Import the CSS file

const UserProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    designation: '',
    manager: '',
    mobileNumber: '',
    address: '',
    yearsOfExperience: 0,
    joiningDate: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.EmployeeID && token) {
        try {
          const response = await profileService.getProfile(token, user.EmployeeID);
          if (response.success) {
            setProfile(response.data);
            setFormData({
              id: response.data.EmployeeID,
              name: `${response.data.FirstName} ${response.data.LastName}`,
              email: response.data.Email,
              phone: response.data.MobileNumber,
              department: response.data.Department,
              position: response.data.Role,
              designation: response.data.Designation,
              manager: response.data.Manager.ManagerName,
              mobileNumber: response.data.MobileNumber,
              address: response.data.Address,
              yearsOfExperience: response.data.YearsOfExperience,
              joiningDate: response.data.JoiningDate
            });
            console.log('Profile data:', response.data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [user?.EmployeeID, token]);

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

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <nav className="breadcrumb">
        <Link to="/dashboard" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-item active">Profile</span>
      </nav>
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.FirstName.charAt(0)}
          {profile.LastName.charAt(0)}
        </div>
        <div className="profile-info">
          <h2>{profile.FirstName} {profile.LastName}</h2>
          <p>{profile.Role}</p>
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
                  <label htmlFor="id">Employee ID</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    className="form-control"
                    value={formData.id}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
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
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
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
                    readOnly
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
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
                    readOnly
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    className="form-control"
                    value={formData.position}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    className="form-control"
                    value={formData.designation}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="manager">Manager</label>
                  <input
                    type="text"
                    id="manager"
                    name="manager"
                    className="form-control"
                    value={formData.manager}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="mobileNumber">Mobile Number</label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    className="form-control"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="yearsOfExperience">Years of Experience</label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    className="form-control"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="joiningDate">Joining Date</label>
                  <input
                    type="date"
                    id="joiningDate"
                    name="joiningDate"
                    className="form-control"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
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

export default UserProfile;