import React from 'react';
import { Users, FileText, CheckCircle, Clock, Briefcase, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard: React.FC = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Requests Over Time',
        data: [12, 19, 3, 5, 2, 3, 7],
        fill: false,
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
      },
    ],
  };

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

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Briefcase className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">5</div>
            <div className="stat-title">New Jobs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Calendar className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">3</div>
            <div className="stat-title">Interviews Scheduled</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Requests Over Time</h2>
        <div className="chart-container small-chart">
          <Line data={chartData} />
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

      <div className="card notifications-card">
        <h2 className="card-title">Recent Notifications</h2>
        <div className="notifications-list">
          <div className="notification-item">
            <div className="notification-title">System maintenance scheduled</div>
            <div className="notification-meta">Tomorrow at 3:00 PM</div>
          </div>
          <div className="notification-item">
            <div className="notification-title">New feature released</div>
            <div className="notification-meta">Version 2.1.0 is now available</div>
          </div>
          <div className="notification-item">
            <div className="notification-title">Policy update</div>
            <div className="notification-meta">Please review the updated privacy policy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;