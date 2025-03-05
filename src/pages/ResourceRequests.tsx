import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchResourceRequests, deleteResourceRequest } from '../services/resourceRequestService';
import './ResourceRequests.css'; // Import the CSS file

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleNewRequest = () => {
    navigate('/request-form');
  };

  const handleView = (id: number) => {
    navigate(`/resource-requests/view/${id}`);
  };

  const handleEdit = (request: ResourceRequest) => {
    if (request.EmployeeID === parseInt(user?.EmployeeID || '')) {
      navigate(`/request-form/edit/${request.ResourceRequestID}`);
    } else {
      navigate(`/resource-requests/edit/${request.ResourceRequestID}`);
    }
  };

  const handleDelete = async () => {
    if (deleteRequestId !== null) {
      try {
        await deleteResourceRequest(deleteRequestId.toString(), token!);
        setRequests(requests.filter(request => request.ResourceRequestID !== deleteRequestId));
        setShowDeleteDialog(false);
        setDeleteRequestId(null);
      } catch (error) {
        alert('Error deleting request');
      }
    }
  };

  const openDeleteDialog = (id: number) => {
    setDeleteRequestId(id);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteRequestId(null);
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
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <nav className="breadcrumb">
        <Link to="/dashboard" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-item active">Requests Placed</span>
      </nav>
      <div className="resource-requests-container">
        <div className="flex justify-between align-center mb-4">
          <h1>Requests Placed</h1>
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
                <th>Requested By</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.ResourceRequestID} onClick={() => handleView(request.ResourceRequestID)}>
                  <td>{request.RequestTitle}</td>
                  <td>{`${request?.Employee?.FirstName} ${request?.Employee?.LastName}`}</td>
                  <td>
                    <span className={`status-badge status-${request.Status.toLowerCase()}`}>
                      {request.Status}
                    </span>
                  </td>
                  <td>{new Date(request.CreatedAt).toLocaleString()}</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); handleView(request.ResourceRequestID); }}>
                      <Eye size={16} />
                    </button>
                    {user?.Role !== 'Recruiter' && (
                      <>
                        <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); handleEdit(request); }}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); openDeleteDialog(request.ResourceRequestID); }}>
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

      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this request?</p>
            <div className="dialog-actions">
              <button className="btn btn-outline" onClick={closeDeleteDialog}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceRequests;