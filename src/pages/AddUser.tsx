import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    EmployeeID: '',
    FirstName: '',
    LastName: '',
    Designation: '',
    DepartmentID: '',
    ManagerEmployeeID: '',
    IsAdmin: false,
    Email: '',
    Password: '',
    Role: '',
    ProfilePicture: null as File | null,
    MobileNumber: '',
    Address: '',
    Gender: '',
    YearsOfExperience: '',
    ReportingManager: '',
    JoiningDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userService.addUser(token!, formData);
      if (response.success) {
        toast.success('User added successfully', {
          onClose: () => navigate('/admin-controls')
        });
      } else {
        toast.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user');
    }
  };

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/dashboard" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-item active">Add User</span>
      </nav>
      <div className="add-user-container">
        <ToastContainer />
        <h1 className="page-title">Add User</h1>
        <form onSubmit={handleSubmit}>
          <div className="avatar-upload">
            <label htmlFor="ProfilePicture" className="avatar-label">
              {formData.ProfilePicture ? (
                <img
                  src={URL.createObjectURL(formData.ProfilePicture)}
                  alt="Profile"
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <span className="plus-symbol">+</span>
                  Upload Profile Picture
                </div>
              )}
            </label>
            <input
              type="file"
              id="ProfilePicture"
              name="ProfilePicture"
              className="form-control"
              onChange={handleChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="EmployeeID">Employee ID</label>
                <input
                  type="text"
                  id="EmployeeID"
                  name="EmployeeID"
                  className="form-control"
                  value={formData.EmployeeID}
                  onChange={handleChange}
                  placeholder="Enter Employee ID"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="FirstName">First Name</label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  className="form-control"
                  value={formData.FirstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="LastName">Last Name</label>
                <input
                  type="text"
                  id="LastName"
                  name="LastName"
                  className="form-control"
                  value={formData.LastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  required
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="Designation">Designation</label>
                <input
                  type="text"
                  id="Designation"
                  name="Designation"
                  className="form-control"
                  value={formData.Designation}
                  onChange={handleChange}
                  placeholder="Enter Designation"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="DepartmentID">Department ID</label>
                <input
                  type="text"
                  id="DepartmentID"
                  name="DepartmentID"
                  className="form-control"
                  value={formData.DepartmentID}
                  onChange={handleChange}
                  placeholder="Enter Department ID"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ManagerEmployeeID">Manager Employee ID</label>
                <input
                  type="text"
                  id="ManagerEmployeeID"
                  name="ManagerEmployeeID"
                  className="form-control"
                  value={formData.ManagerEmployeeID}
                  onChange={handleChange}
                  placeholder="Enter Manager Employee ID"
                  required
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="IsAdmin">Is Admin</label>
                <input
                  type="checkbox"
                  id="IsAdmin"
                  name="IsAdmin"
                  className="form-control-checkbox"
                  checked={formData.IsAdmin}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Email">Email</label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  className="form-control"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Password">Password</label>
                <input
                  type="password"
                  id="Password"
                  name="Password"
                  className="form-control"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="Role">Role</label>
                <input
                  type="text"
                  id="Role"
                  name="Role"
                  className="form-control"
                  value={formData.Role}
                  onChange={handleChange}
                  placeholder="Enter Role"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="MobileNumber">Mobile Number</label>
                <input
                  type="text"
                  id="MobileNumber"
                  name="MobileNumber"
                  className="form-control"
                  value={formData.MobileNumber}
                  onChange={handleChange}
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Address">Address</label>
                <textarea
                  id="Address"
                  name="Address"
                  className="form-control"
                  value={formData.Address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  required
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="Gender">Gender</label>
                <select
                  id="Gender"
                  name="Gender"
                  className="form-control"
                  value={formData.Gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="YearsOfExperience">Years of Experience</label>
                <input
                  type="number"
                  id="YearsOfExperience"
                  name="YearsOfExperience"
                  className="form-control"
                  value={formData.YearsOfExperience}
                  onChange={handleChange}
                  placeholder="Enter Years of Experience"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ReportingManager">Reporting Manager</label>
                <input
                  type="text"
                  id="ReportingManager"
                  name="ReportingManager"
                  className="form-control"
                  value={formData.ReportingManager}
                  onChange={handleChange}
                  placeholder="Enter Reporting Manager"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="JoiningDate">Joining Date</label>
                <input
                  type="date"
                  id="JoiningDate"
                  name="JoiningDate"
                  className="form-control"
                  value={formData.JoiningDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin-controls')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add User
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
