import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { editRequestService, ResourceRequest } from '../services/editRequestService';
import { employeeService, Employee } from '../services/employeeService';
import InterviewSlotInput from '../components/InterviewSlotInput';
import { lookupService, LookupItem } from '../services/lookupService';

const EditRequest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState<ResourceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        expectedTimeline: '',
        level1PanelInterview: '',
        level1PanelInterviewName: '',
        level1PanelInterviewSlots: [] as string[],
        level2PanelInterview: '',
        level2PanelInterviewName: '',
        level2PanelInterviewSlots: [] as string[],
        budget: '',
        priority: '',
        status: '',
        comments: ''
    });
    const [lookups, setLookups] = useState({
        priorities: [] as LookupItem[],
        budgets: [] as LookupItem[],
        interviewSlots: [] as LookupItem[]
    });
    const [panelSearchResults, setPanelSearchResults] = useState<Employee[]>([]);
    const [showLevel1Suggestions, setShowLevel1Suggestions] = useState(false);
    const [showLevel2Suggestions, setShowLevel2Suggestions] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            if (id && token) {
                try {
                    const data = await editRequestService.getRequestDetails(id, token);
                    console.log('Form Data:', data);
                    if (data.success && data.data) {
                        setRequest(data.data);
                        const updateTracker = data.data.updateTracker[0];
                        setFormData({
                            expectedTimeline: updateTracker.ExpectedTimeline || '',
                            level1PanelInterview: updateTracker.Level1PanelID.toString() || '',
                            level1PanelInterviewName: `${updateTracker.Employee_UpdateTracker_Level1PanelIDToEmployee.FirstName} ${updateTracker.Employee_UpdateTracker_Level1PanelIDToEmployee.LastName}` || '',
                            level1PanelInterviewSlots: updateTracker.Level1PanelInterviewSlots ? updateTracker.Level1PanelInterviewSlots.split(', ') : [],
                            level2PanelInterview: updateTracker.Level2PanelID.toString() || '',
                            level2PanelInterviewName: `${updateTracker.Employee_UpdateTracker_Level2PanelIDToEmployee.FirstName} ${updateTracker.Employee_UpdateTracker_Level2PanelIDToEmployee.LastName}` || '',
                            level2PanelInterviewSlots: updateTracker.Level2PanelInterviewSlots ? updateTracker.Level2PanelInterviewSlots.split(', ') : [],
                            budget: updateTracker.BudgetID.toString() || '',
                            priority: updateTracker.PriorityID.toString() || '',
                            status: updateTracker.Status || '',
                            comments: updateTracker.Comments || ''
                        });
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

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [priorities, budgets, interviewSlots] = await Promise.all([
                    lookupService.getPriorities(token!),
                    lookupService.getBudgets(token!),
                    lookupService.getInterviewSlots(token!)
                ]);

                setLookups({
                    priorities: priorities.data,
                    budgets: budgets.data,
                    interviewSlots: interviewSlots.data
                });
            } catch (error) {
                console.error('Error fetching lookups:', error);
            }
        };

        fetchLookups();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePanelSearch = async (value: string) => {
        if (!value) {
            setPanelSearchResults([]);
            return;
        }

        try {
            const response = await employeeService.searchEmployees(value, token!);
            setPanelSearchResults(response.data);
        } catch (error) {
            console.error('Error searching employees:', error);
        }
    };

    const handleLevel1PanelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            level1PanelInterviewName: value,
            level1PanelInterview: '' // Clear ID when name is being typed
        }));
        setShowLevel1Suggestions(true);
        await handlePanelSearch(value);
    };

    const handleLevel2PanelChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            level2PanelInterviewName: value,
            level2PanelInterview: '' // Clear ID when name is being typed
        }));
        setShowLevel2Suggestions(true);
        await handlePanelSearch(value);
    };

    const handlePanelSelect = (employee: Employee, level: 'level1' | 'level2') => {
        setFormData(prev => ({
            ...prev,
            [`${level}PanelInterview`]: employee.EmployeeID.toString(),
            [`${level}PanelInterviewName`]: `${employee.FirstName} ${employee.LastName}`
        }));
        setShowLevel1Suggestions(false);
        setShowLevel2Suggestions(false);
        setPanelSearchResults([]);
    };

    const handleSlotsChange = (level: 'level1' | 'level2', slots: string[]) => {
        setFormData(prev => ({
            ...prev,
            [`${level}PanelInterviewSlots`]: slots
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        if (request && token) {
            try {
                await editRequestService.updateRequestDetails(request?.ResourceRequestID, token, {
                    ExpectedTimeline: formData.expectedTimeline,
                    Level1PanelInterview: formData.level1PanelInterview,
                    Level1PanelInterviewSlots: formData.level1PanelInterviewSlots.join(', '),
                    Level2PanelInterview: formData.level2PanelInterview,
                    Level2PanelInterviewSlots: formData.level2PanelInterviewSlots.join(', '),
                    Budget: formData.budget,
                    Priority: formData.priority,
                    Status: formData.status,
                    Feedback: formData.comments
                });
                toast.success('Request updated successfully', {
                    onClose: () => navigate('/resource-requests')
                });
            } catch (error) {
                console.error('Error updating resource request:', error);
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

    const jobDescription = request.JobDescription;
    const updateTracker = request.updateTracker[0];

    return (
        <div className="edit-request-container container">
            <ToastContainer />
            <h1 className="request-title">Edit Request</h1>
            <form className="form" onSubmit={handleSubmit}>
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
                                <div className="form-group">
                                    <label><strong>Job Type:</strong></label>
                                    <span className="value">{jobDescription.JobType.JobTypeName || 'Not provided'}</span>
                                </div>
                            </div>
                            <div className="form-col">
                                <div className="form-group">
                                    <label><strong>Location:</strong></label>
                                    <span className="value">{jobDescription.Location || 'Not provided'}</span>
                                </div>
                                <div className="form-group">
                                    <label><strong>Notice Period:</strong></label>
                                    <span className="value">{jobDescription.NoticePeriod.NoticePeriodName || 'Not provided'}</span>
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
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <div className="form-row">
                            <div className="form-col">
                                <div className="form-group">
                                    <label><strong>Budget:</strong></label>
                                    <select
                                        id="budget"
                                        name="budget"
                                        className="form-control"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Budget Range</option>
                                        {lookups.budgets.map(budget => (
                                            <option key={budget.BudgetID} value={budget.BudgetID}>
                                                {budget.BudgetName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><strong>Expected Timeline:</strong></label>
                                    <input
                                        type="date"
                                        id="expectedTimeline"
                                        name="expectedTimeline"
                                        className="form-control"
                                        value={formData.expectedTimeline}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label><strong>Status:</strong></label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="form-control"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="InProgress">In Progress</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><strong>Comments:</strong></label>
                                    <textarea
                                        id="comments"
                                        name="comments"
                                        className="form-control"
                                        value={formData.comments}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-col">
                                <div className="form-group">
                                    <label><strong>Level 1 Panel Interview:</strong></label>
                                    <div className="input-with-suggestions">
                                        <input
                                            type="text"
                                            id="level1PanelInterview"
                                            name="level1PanelInterviewName"
                                            className="form-control"
                                            value={formData.level1PanelInterviewName}
                                            onChange={handleLevel1PanelChange}
                                            onFocus={() => formData.level1PanelInterviewName && setShowLevel1Suggestions(true)}
                                            onBlur={() => setTimeout(() => setShowLevel1Suggestions(false), 200)}
                                            placeholder="Search panel member..."
                                            required
                                        />
                                        {showLevel1Suggestions && panelSearchResults.length > 0 && (
                                            <ul className="suggestions-list">
                                                {panelSearchResults.map((employee) => (
                                                    <li
                                                        key={employee.EmployeeID}
                                                        className="suggestion-item"
                                                        onClick={() => handlePanelSelect(employee, 'level1')}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        {employee.FirstName} {employee.LastName} ({employee.EmployeeID})
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <InterviewSlotInput
                                    id="level1PanelInterviewSlots"
                                    label="Interview Slots"
                                    value={formData.level1PanelInterviewSlots}
                                    slots={lookups.interviewSlots}
                                    onChange={(slots) => handleSlotsChange('level1', slots)}
                                />
                                <div className="form-group">
                                    <label><strong>Level 2 Panel Interview:</strong></label>
                                    <div className="input-with-suggestions">
                                        <input
                                            type="text"
                                            id="level2PanelInterview"
                                            name="level2PanelInterviewName"
                                            className="form-control"
                                            value={formData.level2PanelInterviewName}
                                            onChange={handleLevel2PanelChange}
                                            onFocus={() => formData.level2PanelInterviewName && setShowLevel2Suggestions(true)}
                                            onBlur={() => setTimeout(() => setShowLevel2Suggestions(false), 200)}
                                            placeholder="Search panel member..."
                                            required
                                        />
                                        {showLevel2Suggestions && panelSearchResults.length > 0 && (
                                            <ul className="suggestions-list">
                                                {panelSearchResults.map((employee) => (
                                                    <li
                                                        key={employee.EmployeeID}
                                                        className="suggestion-item"
                                                        onClick={() => handlePanelSelect(employee, 'level2')}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                        {employee.FirstName} {employee.LastName} ({employee.EmployeeID})
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <InterviewSlotInput
                                    id="level2PanelInterviewSlots"
                                    label="Interview Slots"
                                    value={formData.level2PanelInterviewSlots}
                                    slots={lookups.interviewSlots}
                                    onChange={(slots) => handleSlotsChange('level2', slots)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

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
    );
};

export default EditRequest;
