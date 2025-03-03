import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchResourceRequest, updateResourceRequest } from '../services/resourceRequestService';

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
    ModeOfWork: string;
    Education: string;
    Experience: number;
    RequiredSkills: string;
    PreferredSkills: string;
    Responsibilities: string;
    Certifications: string;
    AdditionalReasons: string;
    Level1PanelInterview: string;
    Level1PanelInterviewName: string;
    Level1PanelInterviewSlots: string;
    Level2PanelInterview: string;
    Level2PanelInterviewName: string;
    Level2PanelInterviewSlots: string;
    OpenPositions: number;
    RequestedBy: string;
    RequestedByName: string;
    Department: string;
    Role: string;
    JobType: string;
    ExpectedTimeline: string;
    Budget: string;
    Priority: string;
    Location: string;
    NoticePeriod: string;
}

const ViewRequest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState<ResourceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchRequest = async () => {
            if (id && token) {
                try {
                    const data = await fetchResourceRequest(id, token);
                    console.log('Request:', data);
                    if (data.success) {
                        setRequest(data.data);
                        setStatus(data.data.Status);
                        setFeedback(data.data.Feedback || '');
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

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
    };

    const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (request && token) {
            try {
                await updateResourceRequest(id, token, { ...request, Status: status, Feedback: feedback });
                toast.success('Request updated successfully');
                navigate('/resource-requests');
            } catch (error) {
                toast.error('Failed to update request');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!request) {
        return <div>No request found</div>;
    }

    return (
        <div className="view-request-container">
            <ToastContainer />
            <h1>{request.RequestTitle}</h1>
            <p><strong>Status:</strong> {request.Status}</p>
            <p><strong>Created At:</strong> {new Date(request.CreatedAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(request.UpdatedAt).toLocaleString()}</p>
            <p><strong>Feedback:</strong> {request.Feedback || 'No feedback'}</p>
            <p><strong>Mode Of Work:</strong> {request.ModeOfWork}</p>
            <p><strong>Education:</strong> {request.Education}</p>
            <p><strong>Experience:</strong> {request.Experience} years</p>
            <p><strong>Required Skills:</strong> {request.RequiredSkills}</p>
            <p><strong>Preferred Skills:</strong> {request.PreferredSkills}</p>
            <p><strong>Responsibilities:</strong> {request.Responsibilities}</p>
            <p><strong>Certifications:</strong> {request.Certifications}</p>
            <p><strong>Additional Reasons:</strong> {request.AdditionalReasons}</p>
            <p><strong>Level 1 Panel Interview:</strong> {request.Level1PanelInterviewName} ({request.Level1PanelInterview})</p>
            <p><strong>Level 1 Panel Interview Slots:</strong> {request.Level1PanelInterviewSlots}</p>
            <p><strong>Level 2 Panel Interview:</strong> {request.Level2PanelInterviewName} ({request.Level2PanelInterview})</p>
            <p><strong>Level 2 Panel Interview Slots:</strong> {request.Level2PanelInterviewSlots}</p>
            <p><strong>Open Positions:</strong> {request.OpenPositions}</p>
            <p><strong>Requested By:</strong> {request.RequestedByName} ({request.RequestedBy})</p>
            <p><strong>Department:</strong> {request.Department}</p>
            <p><strong>Role:</strong> {request.Role}</p>
            <p><strong>Job Type:</strong> {request.JobType}</p>
            <p><strong>Expected Timeline:</strong> {request.ExpectedTimeline}</p>
            <p><strong>Budget:</strong> {request.Budget}</p>
            <p><strong>Priority:</strong> {request.Priority}</p>
            <p><strong>Location:</strong> {request.Location}</p>
            <p><strong>Notice Period:</strong> {request.NoticePeriod}</p>

            {user?.Role === 'Recruiter' && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="status">Change Status</label>
                        <select
                            id="status"
                            name="status"
                            className="form-control"
                            value={status}
                            onChange={handleStatusChange}
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
                            name="feedback"
                            className="form-control"
                            value={feedback}
                            onChange={handleFeedbackChange}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Update Request
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ViewRequest;
