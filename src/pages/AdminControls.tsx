import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { lookupService, LookupItem } from '../services/lookupService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import './AdminControls.css'; // Import the CSS file
import { X } from 'lucide-react';

const AdminControls: React.FC = () => {
    const { token, user } = useAuth();
    const [lookups, setLookups] = useState({
        jobTypes: [] as LookupItem[],
        noticePeriods: [] as LookupItem[],
        interviewSlots: [] as LookupItem[],
        education: [] as LookupItem[],
        modeOfWork: [] as LookupItem[],
        priorities: [] as LookupItem[],
        budgets: [] as LookupItem[]
    });
    const [newOption, setNewOption] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('jobTypes');
    const [refresh, setRefresh] = useState(false);

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
    }, [token, refresh]);

    const handleAddOption = async () => {
        if (!newOption) return;
        try {
            let endpoint = '';
            let body = {};

            switch (selectedCategory) {
                case 'interviewSlots':
                    endpoint = 'interview-slot';
                    body = { InterviewSlotName: newOption };
                    break;
                case 'noticePeriods':
                    endpoint = 'notice-period';
                    body = { NoticePeriodName: newOption };
                    break;
                case 'education':
                    endpoint = 'education';
                    body = { EducationName: newOption };
                    break;
                case 'modeOfWork':
                    endpoint = 'modes-of-work';
                    body = { ModeOfWorkName: newOption };
                    break;
                case 'priorities':
                    endpoint = 'priority';
                    body = { PriorityName: newOption };
                    break;
                case 'budgets':
                    endpoint = 'budget-range';
                    body = { BudgetName: newOption };
                    break;
                case 'jobTypes':
                    endpoint = 'job-type';
                    body = { JobTypeName: newOption };
                    break;
                default:
                    toast.error('Invalid category selected');
                    return;
            }

            await lookupService.addOption(endpoint, body, token!);
            toast.success('Option added successfully');
            setNewOption('');
            setRefresh(prev => !prev); // Trigger refresh

        } catch (error) {
            toast.error('Failed to add option');
        }
    };

    const handleRemoveOption = async (category: string, id: number) => {
        console.log('Removing option:', category, id);
        try {
            let endpoint = '';

            switch (category) {
                case 'interviewSlots':
                    endpoint = 'interview-slot';
                    break;
                case 'noticePeriods':
                    endpoint = 'notice-period';
                    break;
                case 'education':
                    endpoint = 'education';
                    break;
                case 'modeOfWork':
                    endpoint = 'modes-of-work';
                    break;
                case 'priorities':
                    endpoint = 'priority';
                    break;
                case 'budgets':
                    endpoint = 'budget-range';
                    break;
                case 'jobTypes':
                    endpoint = 'job-type';
                    break;
                default:
                    toast.error('Invalid category selected');
                    return;
            }

            await lookupService.removeOption(endpoint, id, token!);
            toast.success('Option removed successfully');
            setRefresh(prev => !prev); // Trigger refresh
        } catch (error) {
            toast.error('Failed to remove option');
        }
    };

    const getOptionName = (item: LookupItem) => {
        switch (selectedCategory) {
            case 'jobTypes':
                return item.JobTypeName;
            case 'noticePeriods':
                return item.NoticePeriodName;
            case 'interviewSlots':
                return item.InterviewSlotName;
            case 'education':
                return item.EducationName;
            case 'modeOfWork':
                return item.ModeOfWorkName;
            case 'priorities':
                return item.PriorityName;
            case 'budgets':
                return item.BudgetName;
            default:
                return '';
        }
    };

    const getOptionId = (item: LookupItem) => {
        switch (selectedCategory) {
            case 'jobTypes':
                return item.JobTypeID;
            case 'noticePeriods':
                return item.NoticePeriodID;
            case 'interviewSlots':
                return item.InterviewSlotID;
            case 'education':
                return item.EducationID;
            case 'modeOfWork':
                return item.ModeOfWorkID;
            case 'priorities':
                return item.PriorityID;
            case 'budgets':
                return item.BudgetID;
            default:
                return item.id;
        }
    };

    if (user?.Role !== 'Recruiter' && user?.Role !== 'Admin') {
        return null;
    }

    return (
        <>
            <nav className="breadcrumb">
                <Link to="/dashboard" className="breadcrumb-item">Dashboard</Link>
                <span className="breadcrumb-item active">Admin Controls</span>
            </nav>
            <div className="admin-controls-container">
                <ToastContainer />
                <h1>Admin Controls</h1>
                <div className="form-group">
                    <label htmlFor="category">Select Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-control"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="jobTypes">Job Types</option>
                        <option value="noticePeriods">Notice Periods</option>
                        <option value="interviewSlots">Interview Slots</option>
                        <option value="education">Education</option>
                        <option value="modeOfWork">Mode Of Work</option>
                        <option value="priorities">Priorities</option>
                        <option value="budgets">Budgets</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="newOption">New Option</label>
                    <input
                        type="text"
                        id="newOption"
                        name="newOption"
                        className="form-control"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleAddOption}>
                    Add Option
                </button>
                <div className="options-list">
                    <h2>Existing Options</h2>
                    <ul>
                        {lookups[selectedCategory].map((item) => (
                            <li key={getOptionId(item)} className="option-item">
                                <span className="option-name">{getOptionName(item)}</span>
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOption(selectedCategory, getOptionId(item)!)}>
                                    <X size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AdminControls;
