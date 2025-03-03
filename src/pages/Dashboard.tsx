import React from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1 className="mb-4">Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Total Requests</div>
          <div className="stat-value">24</div>
          <FileText className="stat-icon" size={24} />
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Active Candidates</div>
          <div className="stat-value">12</div>
          <Users className="stat-icon" size={24} />
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Completed</div>
          <div className="stat-value">8</div>
          <CheckCircle className="stat-icon" size={24} />
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Pending</div>
          <div className="stat-value">4</div>
          <Clock className="stat-icon" size={24} />
        </div>
      </div>
      
      <div className="card">
        <h2 className="mb-3">Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item p-2 mb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="activity-title">New request submitted</div>
            <div className="activity-meta">Frontend Developer • 2 hours ago</div>
          </div>
          <div className="activity-item p-2 mb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="activity-title">Candidate interview scheduled</div>
            <div className="activity-meta">UX Designer • 5 hours ago</div>
          </div>
          <div className="activity-item p-2 mb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="activity-title">Request approved</div>
            <div className="activity-meta">DevOps Engineer • 1 day ago</div>
          </div>
          <div className="activity-item p-2">
            <div className="activity-title">New candidate added</div>
            <div className="activity-meta">Product Manager • 2 days ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;