import React, { useState } from 'react';
import { Users, FileText, CheckCircle, Clock, Briefcase, Calendar } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard: React.FC = () => {
  const stats = {
    totalRequests: 50,
    pendingRequests: 10,
    approvedRequests: 30,
    rejectedRequests: 10,
  };

  const [filter, setFilter] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [selectedYear, setSelectedYear] = useState('2023');

  const getChartData = () => {
    switch (filter) {
      case 'weekly':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Requests Over Time',
              data: [12, 19, 3, 5],
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              borderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'yearly':
        return {
          labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
          datasets: [
            {
              label: 'Requests Over Time',
              data: [120, 190, 130, 150, 120, 20],
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              borderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 1,
            },
          ],
        };
      case 'monthly':
      default:
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Requests Over Time',
              data: [12, 19, 3, 5, 2, 3, 7, 8, 2, 13, 11, 20],
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              borderColor: 'rgba(52, 152, 219, 1)',
              borderWidth: 1,
            },
          ],
        };
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FileText className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalRequests}</div>
            <div className="stat-title">Total Requests</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Users className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">12</div>
            <div className="stat-title">Shortlist Candidates</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <CheckCircle className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">8</div>
            <div className="stat-title">Closed positions</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Clock className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingRequests}</div>
            <div className="stat-title">Pending positions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Briefcase className="stat-icon" size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">5</div>
            <div className="stat-title">New Positions</div>
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
        <div className="card-header">
          <h2 className="card-title">Requests Over Time</h2>
          <div className="chart-filters">
            <select className="chart-filter-dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
            {filter === 'weekly' && (
              <select className="chart-filter-dropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            )}
            {(filter === 'monthly' || filter === 'weekly') && (
              <select className="chart-filter-dropdown" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {['2020', '2021', '2022', '2023', '2024', '2025'].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="chart-container small-chart">
          <Bar data={getChartData()} />
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