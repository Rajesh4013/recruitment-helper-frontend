import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Profile: '',
    MobileNumber: '',
    Address: '',
    Gender: '',
    YearsOfExperience: '',
    ReportingManager: '',
    JoiningDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    <div className="add-user-container">
      <ToastContainer />
      <h1 className="page-title">Add User</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="EmployeeID">Employee ID</label>
          <input
            type="text"
            id="EmployeeID"
            name="EmployeeID"
            className="form-control"
            value={formData.EmployeeID}
            onChange={handleChange}
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Designation">Designation</label>
          <input
            type="text"
            id="Designation"
            name="Designation"
            className="form-control"
            value={formData.Designation}
            onChange={handleChange}
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="IsAdmin">Is Admin</label>
          <input
            type="checkbox"
            id="IsAdmin"
            name="IsAdmin"
            className="form-control"
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Role">Role</label>
          <input
            type="text"
            id="Role"
            name="Role"
            className="form-control"
            value={formData.Role}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Profile">Profile</label>
          <textarea
            id="Profile"
            name="Profile"
            className="form-control"
            value={formData.Profile}
            onChange={handleChange}
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
            required
          />
        </div>
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
  );
};

export default AddUser;
