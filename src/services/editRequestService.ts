const VITE_API_URL = import.meta.env.VITE_API_URL;

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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const editRequestService = {
  getRequestDetails: async (requestId: string, token: string): Promise<ApiResponse<ResourceRequest>> => {
    try {
      const response = await fetch(`${VITE_API_URL}/resource-request/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch resource request details:', errorText);
        throw new Error('Failed to fetch resource request details');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching resource request details:', error);
      throw error;
    }
  },

  updateRequestDetails: async (requestId: string, token: string, updatedRequest: Partial<ResourceRequest>): Promise<ApiResponse<ResourceRequest>> => {
    try {
      const response = await fetch(`${VITE_API_URL}/resource-request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update resource request details:', errorText);
        throw new Error('Failed to update resource request details');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating resource request details:', error);
      throw error;
    }
  }
};

export type { ResourceRequest };
