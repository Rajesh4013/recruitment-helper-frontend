const API_URL = import.meta.env.VITE_API_URL;

export interface RequestFormDetails {
  modeOfWork: string;
  requestTitle: string;
  education: string;
  experience: number;
  requiredSkills: string;
  preferredSkills: string;
  responsibilities: string;
  certifications: string;
  additionalReasons: string;
  level1PanelInterview: string;
  level1PanelInterviewName: string;
  level1PanelInterviewSlots: string;
  level2PanelInterview: string;
  level2PanelInterviewName: string;
  level2PanelInterviewSlots: string;
  openPositions: number;
  requestedBy: string;
  requestedByName: string;
  department: string;
  role: string;
  jobType: string;
  expectedTimeline: string;
  budget: string;
  priority: string;
  location: string;
  noticePeriod: string;
}

export const editRequestFormService = {
  async getRequestFormDetails(id: string, token: string) {
    try {
        const response = await fetch(`${API_URL}/resource-request/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error fetching request form details:', error);
      throw error;
    }
  },

  async updateRequestFormDetails(id: string, token: string, data: RequestFormDetails) {
    try {
      const response = await fetch(`${API_URL}/resource-request/${id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error updating request form details:', error);
      throw error;
    }
  }
};
