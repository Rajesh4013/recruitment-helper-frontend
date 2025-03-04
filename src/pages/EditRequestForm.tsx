import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkillsInput from '../components/SkillsInput';
import { employeeService, EmployeeDetails, Employee } from '../services/employeeService';
import { lookupService, LookupItem } from '../services/lookupService';
import InterviewSlotInput from '../components/InterviewSlotInput';
import { insertRequestFormData } from '../services/requestFormService';
import { editRequestService } from '../services/editRequestService';
import { editRequestFormService } from '../services/editRequestFormService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [lookups, setLookups] = useState({
    jobTypes: [] as LookupItem[],
    noticePeriods: [] as LookupItem[],
    interviewSlots: [] as LookupItem[],
    education: [] as LookupItem[],
    modeOfWork: [] as LookupItem[],
    priorities: [] as LookupItem[],
    budgets: [] as LookupItem[]
  });

  const [formData, setFormData] = useState({
    modeOfWork: '',
    requestTitle: '',
    education: '',
    experience: 0,
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    responsibilities: '',
    certifications: '',
    additionalReasons: '',
    level1PanelInterview: '',
    level1PanelInterviewName: '',
    level1PanelInterviewSlots: [] as string[],
    level2PanelInterview: '',
    level2PanelInterviewName: '',
    level2PanelInterviewSlots: [] as string[],
    openPositions: 1,
    requestedBy: employeeDetails?.EmployeeID,
    requestedByName: `${employeeDetails?.FirstName} ${employeeDetails?.LastName}`,
    department: employeeDetails?.Department.DepartmentName || '',
    role: '',
    jobType: '',
    expectedTimeline: '',
    budget: '',
    priority: '',
    location: '',
    noticePeriod: ''
  });

  const [showLevel1Suggestions, setShowLevel1Suggestions] = useState(false);
  const [showLevel2Suggestions, setShowLevel2Suggestions] = useState(false);
  const [panelSearchResults, setPanelSearchResults] = useState<Employee[]>([]);

  const parseSlots = (slots: string) => {
    try {
      const parsedSlots = JSON.parse(slots);
      if (Array.isArray(parsedSlots)) {
        return parsedSlots.map((slot: { id: number; name: string }) => slot.id);
      } else {
        console.error('Slots are not in the expected format:', slots);
        return [];
      }
    } catch (error) {
      console.error('Error parsing slots:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (user?.EmployeeID && token) {
        try {
          const response = await employeeService.getEmployeeDetails(user.EmployeeID, token);
          setEmployeeDetails(response.data);

          setFormData(prev => ({
            ...prev,
            requestedBy: response.data.EmployeeID,
            requestedByName: `${response.data.FirstName} ${response.data.LastName}`,
            department: response.data.Department.DepartmentName
          }));
        } catch (error) {
          console.error('Error fetching employee details:', error);
        }
      }
    };

    fetchEmployeeDetails();
  }, [user?.EmployeeID, token]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [
          jobTypes,
          noticePeriods,
          interviewSlots,
          education,
          modeOfWork,
          priorities,
          budgets
        ] = await Promise.all([
          lookupService.getJobTypes(token!),
          lookupService.getNoticePeriods(token!),
          lookupService.getInterviewSlots(token!),
          lookupService.getEducation(token!),
          lookupService.getModeOfWork(token!),
          lookupService.getPriorities(token!),
          lookupService.getBudgets(token!)
        ]);

        setLookups({
          jobTypes: jobTypes.data,
          noticePeriods: noticePeriods.data,
          interviewSlots: interviewSlots.data,
          education: education.data,
          modeOfWork: modeOfWork.data,
          priorities: priorities.data,
          budgets: budgets.data
        });
      } catch (error) {
        console.error('Error fetching lookups:', error);
      }
    };

    fetchLookups();
  }, [token]);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (id && token) {
        try {
          const response = await editRequestService.getRequestDetails(id, token);
          console.log('Response:', response);
          if (response.success) {
            const requestData = response.data;
            const updateTracker = requestData.updateTracker[0];
            console.log('requestData:', requestData?.JobDescription);
            console.log('updateTracker:', updateTracker);
            setFormData({
              modeOfWork: requestData?.JobDescription.ModeOfWorkID || '',
              requestTitle: requestData.RequestTitle || '',
              education: requestData.JobDescription.EducationID || '',
              experience: requestData.JobDescription.Experience || 0,
              requiredSkills: requestData.JobDescription.RequiredTechnicalSkills?.split(', ') || [],
              preferredSkills: requestData.JobDescription.PreferredTechnicalSkills?.split(', ') || [],
              responsibilities: requestData.JobDescription.Responsibility || '',
              certifications: requestData.JobDescription.Certifications || '',
              additionalReasons: requestData.JobDescription.AdditionalReasons || '',
              level1PanelInterview: updateTracker.Level1PanelID?.toString() || '',
              level1PanelInterviewName: `${updateTracker.Employee_UpdateTracker_Level1PanelIDToEmployee.FirstName} ${updateTracker.Employee_UpdateTracker_Level1PanelIDToEmployee.LastName}` || '',
              level1PanelInterviewSlots: parseSlots(updateTracker.Level1PanelInterviewSlots) || [],
              level2PanelInterview: updateTracker.Level2PanelID?.toString() || '',
              level2PanelInterviewName: `${updateTracker.Employee_UpdateTracker_Level2PanelIDToEmployee.FirstName} ${updateTracker.Employee_UpdateTracker_Level2PanelIDToEmployee.LastName}` || '',
              level2PanelInterviewSlots: parseSlots(updateTracker.Level2PanelInterviewSlots) || [],
              openPositions: requestData.JobDescription.OpenPositions || 1,
              requestedBy: requestData.Employee.EmployeeID || '',
              requestedByName: `${requestData.Employee.FirstName} ${requestData.Employee.LastName}` || '',
              department: requestData.Employee.Department.DepartmentName || '',
              role: requestData.JobDescription.Role || '',
              jobType: requestData.JobDescription.JobTypeID?.toString() || '',
              expectedTimeline: updateTracker.ExpectedTimeline || '',
              budget: updateTracker.BudgetID.toString() || '',
              priority: updateTracker.PriorityID.toString() || '',
              location: requestData.JobDescription.Location || '',
              noticePeriod: requestData.JobDescription.NoticePeriodID?.toString() || ''
            });
            console.log('formData:', formData);
          } else {
            toast.error('Failed to fetch request details');
          }
        } catch (error) {
          console.error('Error fetching request details:', error);
          toast.error('Error fetching request details');
        }
      }
    };

    if (id) {
      fetchRequestDetails();
    }
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMaxRequiredSkills = (experience: string): number => {
    const exp = Number(experience);
    if (exp <= 1) return 4;
    if (exp <= 3) return 6;
    if (exp <= 5) return 8;
    return 10;
  };

  const handleSkillsChange = (fieldName: 'requiredSkills' | 'preferredSkills', skills: string[]) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: skills
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      openPositions: Number(formData.openPositions),
      budget: Number(formData.budget),
      modeOfWork: formData.modeOfWork.toString(),
      jobType: formData.jobType.toString(),
      noticePeriod: formData.noticePeriod.toString(),
      education: formData.education.toString(),
      level1PanelInterview: formData.level1PanelInterview.toString(),
      level2PanelInterview: formData.level2PanelInterview.toString(),
      priority: formData.priority.toString(),
      experience: Number(formData.experience),
      requiredSkills: formData.requiredSkills.join(', '),
      preferredSkills: formData.preferredSkills.join(', '),
      level1PanelInterviewSlots: formData.level1PanelInterviewSlots.join(', '),
      level2PanelInterviewSlots: formData.level2PanelInterviewSlots.join(', ')
    };
    console.log('Form submitted:', formattedData);
    if (id && token) {
      console.log('token:', token);
      const response = await editRequestFormService.updateRequestFormDetails(id, token, formattedData);
      if (response.success) {
        toast.success('Request updated successfully', {
          onClose: () => navigate('/resource-requests')
        });
      } else {
        toast.error('Failed to update request');
      }
    } else {
      toast.error('Request ID or token is missing');
    }
  };

  const handleCancel = () => {
    navigate('/resource-requests');
  };

  const isLocationRequired = formData.modeOfWork === '1';

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

  return (
    <div className="request-form-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="card">
          <input
            type="text"
            name="requestTitle"
            placeholder="Request Title"
            id="requestTitle"
            value={formData.requestTitle}
            className="request-title"
            onChange={handleChange}
            required
          />
          <div className="form-section">
            <div className="form-row three-cols">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="requestedBy">Requested By (ID)</label>
                  <input
                    type="text"
                    id="requestedBy"
                    name="requestedBy"
                    className="form-control"
                    value={formData.requestedBy}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="requestedByName">Name</label>
                  <input
                    type="text"
                    id="requestedByName"
                    name="requestedByName"
                    className="form-control"
                    value={formData.requestedByName}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row three-cols">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    className="form-control"
                    placeholder="e.g., Designer, Developer, etc."
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="openPositions">Open Positions</label>
                  <input
                    type="number"
                    id="openPositions"
                    name="openPositions"
                    className="form-control"
                    value={formData.openPositions}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="jobType">Job Type</label>
                  <select
                    id="jobType"
                    name="jobType"
                    className="form-control"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Job Type</option>
                    {lookups.jobTypes.map(type => (
                      <option key={type.JobTypeID} value={type.JobTypeID}>
                        {type.JobTypeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="modeOfWork">Mode Of Work</label>
                  <select
                    id="modeOfWork"
                    name="modeOfWork"
                    className="form-control"
                    value={formData.modeOfWork}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Mode of Work</option>
                    {lookups.modeOfWork.map(mode => (
                      <option key={mode.ModeOfWorkID} value={mode.ModeOfWorkID}>
                        {mode.ModeOfWorkName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {isLocationRequired && (
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="form-control"
                      placeholder="e.g., San Francisco, CA, etc."
                      value={formData.location}
                      onChange={handleChange}
                      required={isLocationRequired}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-control"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Priority</option>
                    {lookups.priorities.map(priority => (
                      <option key={priority.PriorityID} value={priority.PriorityID}>
                        {priority.PriorityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="noticePeriod">Notice Period</label>
                  <select
                    id="noticePeriod"
                    name="noticePeriod"
                    className="form-control"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Notice Period</option>
                    {lookups.noticePeriods.map(period => (
                      <option key={period.NoticePeriodID} value={period.NoticePeriodID}>
                        {period.NoticePeriodName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    className="form-control"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="education">Education</label>
                  <select
                    id="education"
                    name="education"
                    className="form-control"
                    value={formData.education}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Education</option>
                    {lookups.education.map(edu => (
                      <option key={edu.EducationID} value={edu.EducationID}>
                        {edu.EducationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <SkillsInput
                  id="requiredSkills"
                  label="Required Skills"
                  value={formData.requiredSkills}
                  onChange={(skills) => handleSkillsChange('requiredSkills', skills)}
                  maxSkills={getMaxRequiredSkills(formData.experience?.toString() || '0')}
                  disabledSkills={formData.preferredSkills}
                />
              </div>
              <div className="form-col">
                <SkillsInput
                  id="preferredSkills"
                  label="Preferred Skills"
                  value={formData.preferredSkills}
                  onChange={(skills) => handleSkillsChange('preferredSkills', skills)}
                  disabledSkills={formData.requiredSkills}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="responsibilities">Responsibilities</label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    className="form-control"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="certifications">Certifications</label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    className="form-control"
                    value={formData.certifications}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="expectedTimeline">Expected Timeline</label>
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
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
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
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-row two-cols">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="level1PanelInterview">Level 1 Panel Interview</label>
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
              </div>
              <div className="form-col">
                <InterviewSlotInput
                  id="level1PanelInterviewSlots"
                  label="Interview Slots"
                  value={formData.level1PanelInterviewSlots}
                  slots={lookups.interviewSlots}
                  onChange={(slots) => handleSlotsChange('level1', slots)}
                />
              </div>
            </div>
            <div className="form-row two-cols">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="level2PanelInterview">Level 2 Panel Interview</label>
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
              </div>
              <div className="form-col">
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

          <div className="form-section">
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="additionalReasons">Additional Reasons For Hiring</label>
                  <textarea
                    id="additionalReasons"
                    name="additionalReasons"
                    className="form-control"
                    value={formData.additionalReasons}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRequestForm;