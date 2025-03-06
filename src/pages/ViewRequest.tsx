import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { viewRequestService, ResourceRequest } from '../services/viewRequestService';

const ViewRequest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState<ResourceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const parseSlots = (slots: string) => {
        try {
            const parsedSlots = JSON.parse(slots);
            return parsedSlots.map((slot: { id: number; name: string }) => slot.name).join(', ');
        } catch (error) {
            console.error('Error parsing slots:', error);
            return 'Not provided';
        }
    };

    useEffect(() => {
        const fetchRequest = async () => {
            if (id && token) {
                try {
                    const data = await viewRequestService.getRequestDetails(id, token);
                    console.log('Request:', data);
                    if (data.success) {
                        setRequest(data.data);
                        setStatus(data.data.Status);
                        setFeedback(data.data.Feedback || '');
                        toast.info(`Request is ${data.data.Status}`);
                        console.log('request:', data.data);
                    } else {
                        setError('Failed to fetch resource request');
                    }
                } catch (error) {
                    console.error('Error fetching resource request:', error);
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
                await viewRequestService.updateRequestDetails(request?.ResourceRequestID, token, { Status: status, Feedback: feedback });
                toast.success('Request updated successfully', {
                    onClose: () => navigate('/resource-requests')
                });
            } catch (error) {
                console.error('Error updating resource request:', error);
                toast.error('Failed to update request');
            }
        }
    };

    const handleDelete = async () => {
        if (request && token) {
            try {
                await viewRequestService.deleteRequest(request?.ResourceRequestID, token);
                toast.success('Request deleted successfully', {
                    onClose: () => navigate('/resource-requests')
                });
            } catch (error) {
                console.error('Error deleting resource request:', error);
                toast.error('Failed to delete request');
            }
        }
    };

    const openDeleteDialog = () => {
        setShowDeleteDialog(true);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
    };

    const handleEdit = () => {
        if (request?.EmployeeID === parseInt(user?.EmployeeID || '')) {
            navigate(`/request-form/edit/${request.ResourceRequestID}`);
        } else {
            navigate(`/resource-requests/edit/${request.ResourceRequestID}`);
        }
    };

    const handleDisabledClick = (action: string) => {
        toast.info(`Cannot ${action} request. Status is ${request?.Status}.`);
    };

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

    if (!request) {
        return <div>No request found</div>;
    }

    const jobDescription = request.JobDescription;
    const updateTracker = request.updateTracker[0];

    console.log('Update Tracker:', updateTracker);

    return (
        <>
            <nav className="breadcrumb">
                <Link to="/dashboard" className="breadcrumb-item">Dashboard</Link>
                <Link to="/resource-requests" className="breadcrumb-item">Requests Placed</Link>
                <span className="breadcrumb-item active">View Request</span>
            </nav>

            <div className="view-request-container container">
                <ToastContainer />
                <h1 className="request-title">{request.RequestTitle}</h1>
                <form className="form">
                    <div className="card">
                        <div className="card-body">
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label><strong>Priority:</strong></label>
                                        <span className="value">{updateTracker.Priority.PriorityName || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Requested By:</strong></label>
                                        <span className="value">{request.Employee.FirstName} {request.Employee.LastName}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Department:</strong></label>
                                        <span className="value">{request.Employee.Department.DepartmentName || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Role:</strong></label>
                                        <span className="value">{jobDescription.Role || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Open Positions:</strong></label>
                                        <span className="value">{jobDescription.OpenPositions || 'Not provided'}</span>
                                    </div>
                                </div>
                                <div className="form-col">
                                    <div className="form-group">
                                        <label><strong>Job Type:</strong></label>
                                        <span className="value">{jobDescription.JobType.JobTypeName || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Budget:</strong></label>
                                        <span className="value">{updateTracker.BudgetRanges.BudgetName || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Location:</strong></label>
                                        <span className="value">{jobDescription.Location || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Expected Timeline:</strong></label>
                                        <span className="value">{updateTracker.ExpectedTimeline || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Notice Period:</strong></label>
                                        <span className="value">{jobDescription.NoticePeriod.NoticePeriodName || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-col">
                                    <div className="form-group">
                                        <label><strong>Status:</strong></label>
                                        <span className="value">{request.Status || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Created At:</strong></label>
                                        <span className="value">{new Date(request.CreatedAt).toLocaleString()}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Updated At:</strong></label>
                                        <span className="value">{new Date(request.UpdatedAt).toLocaleString()}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Feedback:</strong></label>
                                        <span className="value">{request.Feedback || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Mode Of Work:</strong></label>
                                        <span className="value">{jobDescription.ModeOfWork.ModeOfWorkName || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Education:</strong></label>
                                        <span className="value">{jobDescription.Education.EducationName || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Experience:</strong></label>
                                        <span className="value">{jobDescription.Experience ? `${jobDescription.Experience} years` : 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Required Skills:</strong></label>
                                        <span className="value">{jobDescription.RequiredTechnicalSkills || 'Not provided'}</span>
                                    </div>
                                </div>
                                <div className="form-col">
                                    <div className="form-group">
                                        <label><strong>Preferred Skills:</strong></label>
                                        <span className="value">{jobDescription.PreferredTechnicalSkills || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Responsibilities:</strong></label>
                                        <span className="value">{jobDescription.Responsibility || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Certifications:</strong></label>
                                        <span className="value">{jobDescription.Certifications || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Additional Reasons:</strong></label>
                                        <span className="value">{jobDescription.AdditionalReasons || 'Not provided'}</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Level 1 Panel Interview:</strong></label>
                                        <span className="value">{updateTracker.Employee_UpdateTracker_Level1PanelIDToEmployee.FirstName} {updateTracker.Employee_UpdateTracker_Level1PanelIDToEmployee.LastName} ({parseSlots(updateTracker.Level1PanelInterviewSlots)})</span>
                                    </div>
                                    <div className="form-group">
                                        <label><strong>Level 2 Panel Interview:</strong></label>
                                        <span className="value">{updateTracker.Employee_UpdateTracker_Level2PanelIDToEmployee.FirstName} {updateTracker.Employee_UpdateTracker_Level2PanelIDToEmployee.LastName} ({parseSlots(updateTracker.Level2PanelInterviewSlots)})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {user?.Role == 'Recruiter' && request?.Employee.Login.Role !== user?.Role && (
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group small-input">
                                    <label htmlFor="status">Change Status</label>
                                    <select style={{ width: '75%' }}
                                        id="status"
                                        name="status"
                                        className="form-control small-input"
                                        value={status}
                                        onChange={handleStatusChange}
                                        required
                                        disabled={request.Status === 'Accepted' || request.Status === 'Rejected'}
                                    >
                                        <option value="InProgress">In Progress</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <div className="form-group small-input">
                                    <label htmlFor="feedback">Feedback</label>
                                    <textarea style={{ width: '75%' }}
                                        id="feedback"
                                        name="feedback"
                                        className="form-control small-input"
                                        value={feedback}
                                        onChange={handleFeedbackChange}
                                        required
                                        disabled={request.Status === 'Accepted' || request.Status === 'Rejected'}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={request.Status === 'Accepted' || request.Status === 'Rejected'}>
                                        Update Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                <div className="edit-button-container">
                    {(user?.Role !== 'Recruiter' && user?.Role !== 'Admin') || request?.EmployeeID === parseInt(user?.EmployeeID || '') ? (
                        <button
                            type="button"
                            className="btn btn-outline small-btn"
                            onClick={(e) => {
                                if (request.Status === 'Accepted' || request.Status === 'Rejected') {
                                    e.preventDefault(); // Prevents unintended behavior
                                    handleDisabledClick('edit');
                                } else {
                                    handleEdit();
                                }
                            }}
                        >
                            Edit Request
                        </button>
                    ) : null}
                </div>

            </div>

            {showDeleteDialog && (
                <div className="delete-dialog">
                    <div className="delete-dialog-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this request?</p>
                        <div className="delete-dialog-actions">
                            <button className="btn btn-secondary" onClick={closeDeleteDialog}>Cancel</button>
                            <button className="btn btn-danger custom-danger-btn" onClick={handleDelete} disabled={request.Status === 'Accepted' || request.Status === 'Rejected'}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewRequest;
