import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchResourceRequests, deleteResourceRequest } from '../services/resourceRequestService';

interface ResourceRequest {
  JobDescriptionID: number;
  EmployeeID: number;
  Status: string;
  CreatedAt: string;
  AcceptedAt: string | null;
  UpdatedAt: string;
  Feedback: string | null;
  RequestTitle: string;
  ResourceRequestID: number;
}

const ResourceRequests: React.FC = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const handleNewRequest = () => {
    navigate('/request-form');
  };

  const handleView = (id: number) => {
    navigate(`/resource-requests/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/resource-requests/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await deleteResourceRequest(id.toString(), token!);
        setRequests(requests.filter(request => request.ResourceRequestID !== id));
      } catch (error) {
        alert('Error deleting request');
      }
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (user?.EmployeeID && token) {
        try {
          const data = await fetchResourceRequests(parseInt(user.EmployeeID), token);
          if (data.success) {
            setRequests(data.data);
            setFilteredRequests(data.data);
          } else {
            setError('Failed to fetch resource requests');
          }
        } catch (error) {
          setError('Error fetching resource requests');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRequests();
  }, [user?.EmployeeID, token]);

  useEffect(() => {
    const filtered = requests.filter(request => {
      const matchesSearchTerm = request.RequestTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.Status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearchTerm && matchesStatus;
    });
    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="resource-requests-container">
      <div className="flex justify-between align-center mb-4">
        <h1>Resource Requests</h1>
        {user?.Role !== 'Recruiter' && (
          <button className="btn btn-primary" onClick={handleNewRequest}>
            <Plus size={16} style={{ marginRight: '5px' }} />
            New Request
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex justify-between mb-3">
          <input
            type="text"
            placeholder="Search requests..."
            className="form-control"
            style={{ maxWidth: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="inprogress">In Progress</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <table className="requests-table">
          <thead>
            <tr>
              <th>Request Title</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.ResourceRequestID}>
                <td>{request.RequestTitle}</td>
                <td>
                  <span className={`status-badge status-${request.Status.toLowerCase()}`}>
                    {request.Status}
                  </span>
                </td>
                <td>{new Date(request.CreatedAt).toLocaleString()}</td>
                <td>{new Date(request.UpdatedAt).toLocaleString()}</td>
                <td className="actions-cell">
                  <button className="btn btn-outline" onClick={() => handleView(request.ResourceRequestID)}>
                    <Eye size={16} />
                  </button>
                  {user?.Role !== 'Recruiter' && (
                    <>
                      <button className="btn btn-outline" onClick={() => handleEdit(request.ResourceRequestID)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-outline" onClick={() => handleDelete(request.ResourceRequestID)}>
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceRequests;