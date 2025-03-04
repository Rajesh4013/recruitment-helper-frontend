interface LookupItem {
  // Job Types
  JobTypeID?: number;
  JobTypeName?: string;

  // Notice Periods
  NoticePeriodID?: number;
  NoticePeriodName?: string;

  // Interview Slots
  InterviewSlotID?: number;
  InterviewSlotName?: string;

  // Education
  EducationID?: number;
  EducationName?: string;

  // Mode of Work
  ModeOfWorkID?: number;
  ModeOfWorkName?: string;

  // Priorities
  PriorityID?: number;
  PriorityName?: string;

  BudgetID?: number;
  BudgetName?: string;
}

interface LookupResponse {
  success: boolean;
  data: LookupItem[];
  message: string;
}

const API_URL = `${import.meta.env.VITE_API_URL}/lookups`;

export const lookupService = {

  getBudgets: async (token: string): Promise<LookupResponse> => {
    const response = await fetch(`${API_URL}/budget-ranges`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch budgets');
    }

    return response.json();
  },

  getJobTypes: async (token: string): Promise<LookupResponse> => {
    const response = await fetch(`${API_URL}/job-types`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job types');
    }

    return response.json();
  },

  getNoticePeriods: async (token: string): Promise<LookupResponse> => {
    const response = await fetch(`${API_URL}/notice-periods`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notice periods');
    }

    return response.json();
  },

  getInterviewSlots: async (token: string): Promise<LookupResponse> => {
    const response = await fetch(`${API_URL}/interview-slots`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch interview slots');
    }

    return response.json();
  },

  getEducation: async (token: string): Promise<LookupResponse> => {
    const response = await fetch(`${API_URL}/education`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch education types');
    }

    return response.json();
  },

  getModeOfWork: async (token: string): Promise<LookupResponse> => {
    const response = await fetch(`${API_URL}/modes-of-work`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch work modes');
    }

    return response.json();
  },

  getPriorities: async (token: string): Promise<LookupResponse> => {
    const response = await fetch(`${API_URL}/priorities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch priorities');
    }

    return response.json();
  },

  addOption: async (category: string, option: string, token: string) => {
    const response = await fetch(`${API_URL}/${category}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(option)
    });
    if (!response.ok) {
      throw new Error('Failed to add option');
    }
    return await response.json();
  },

  removeOption: async (category: string, id: number, token: string) => {
    const response = await fetch(`${API_URL}/${category}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to remove option');
    }
    return await response.json();
  },

  getLookups: async (token: string) => {
    const response = await fetch(`${API_URL}/lookups`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch lookups');
    }
    return await response.json();
  }
};

export type { LookupItem };