import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const EditRequest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState<ResourceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            if (id && token) {
                try {
                    const response = await fetch(`http://localhost:3001/api/resource-requests/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            setRequest(data.data);
                        } else {
                            setError('Failed to fetch resource request');
                        }
                    } else {
                        setError('Failed to fetch resource request');
                    }
                } catch (error) {
                    setError('Error fetching resource request');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRequest();
    }, [id, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRequest(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (request && token) {
            try {
                const response = await fetch(`http://localhost:3001/api/resource-requests/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(request)
                });
                if (response.ok) {
                    toast.success('Request updated successfully');
                    navigate('/resource-requests');
                } else {
                    toast.error('Failed to update request');
                }
            } catch (error) {
                toast.error('Error updating request');
            }
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="loading-spinner"></div></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!request) {
        return <div>No request found</div>;
    }

    return (
        <div>
            <nav className="breadcrumb">
                <Link to="/dashboard" className="breadcrumb-item">Dashboard</Link>
                <Link to="/resource-requests" className="breadcrumb-item">Requests Placed</Link>
                <span className="breadcrumb-item active">Edit Request</span>
            </nav>
            <div className="edit-request-container">
                <ToastContainer />
                <h1>Edit Request</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="requestTitle">Request Title</label>
                        <input
                            type="text"
                            id="requestTitle"
                            name="RequestTitle"
                            className="form-control"
                            value={request.RequestTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="Status"
                            className="form-control"
                            value={request.Status}
                            onChange={handleChange}
                            required
                        >
                            <option value="InProgress">In Progress</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="feedback">Feedback</label>
                        <textarea
                            id="feedback"
                            name="Feedback"
                            className="form-control"
                            value={request.Feedback || ''}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Add more fields as necessary */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/resource-requests')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Update Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRequest;
