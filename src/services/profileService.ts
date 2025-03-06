const API_URL = import.meta.env.VITE_API_URL;

interface Profile {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
  Designation: string;
  Department: string;
  Manager: {
    ManagerName: string;
    ManagerID: number;
  };
  ProfilePicture: string | null;
  MobileNumber: string;
  Address: string;
  YearsOfExperience: number;
  JoiningDate: string;
}

interface ProfileResponse {
  success: boolean;
  data: Profile;
  message: string;
}

export const profileService = {
  getProfile: async (token: string, employeeId: string): Promise<ProfileResponse> => {
    const response = await fetch(`${API_URL}/employees/profile/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }
};

export type { Profile, ProfileResponse };
