import React from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FileText className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">24</div>
            <div className="stat-title">Total Requests</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Users className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">12</div>
            <div className="stat-title">Active Candidates</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <CheckCircle className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">8</div>
            <div className="stat-title">Completed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Clock className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">4</div>
            <div className="stat-title">Pending</div>
          </div>
        </div>
      </div>
      
      <div className="card recent-activity-card">
        <h2 className="card-title">Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-title">New request submitted</div>
            <div className="activity-meta">Frontend Developer • 2 hours ago</div>
          </div>
          <div className="activity-item">
            <div className="activity-title">Candidate interview scheduled</div>
            <div className="activity-meta">UX Designer • 5 hours ago</div>
          </div>
          <div className="activity-item">
            <div className="activity-title">Request approved</div>
            <div className="activity-meta">DevOps Engineer • 1 day ago</div>
          </div>
          <div className="activity-item">
            <div className="activity-title">New candidate added</div>
            <div className="activity-meta">Product Manager • 2 days ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;