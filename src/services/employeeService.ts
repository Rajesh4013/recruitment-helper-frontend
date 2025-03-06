const VITE_API_URL = import.meta.env.VITE_API_URL;

interface Employee {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  Designation: string;
  Email: string;
  Department: {
    DepartmentName: string;
  };
  Manager: {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    Designation: string;
  } | null;
}

interface EmployeeDetails {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  Designation: string;
  Department: {
    DepartmentID: number;
    DepartmentName: string;
  };
  Manager: {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    Designation: string;
  } | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface EmployeeResponse {
  success: boolean;
  data: EmployeeDetails;
  message: string;
}

export const employeeService = {
  searchEmployees: async (searchTerm: string, token: string): Promise<ApiResponse<Employee[]>> => {
    const response = await fetch(`${VITE_API_URL}/employees?search=${searchTerm}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    return response.json();
  },

  getEmployeeById: async (employeeId: string, token: string): Promise<ApiResponse<Employee[]>> => {
    const response = await fetch(`${VITE_API_URL}/employees?employeeId=${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }

    return response.json();
  },

  formatEmployeeName: (employee: Employee): string => {
    return `${employee.FirstName} ${employee.LastName}`;
  },

  getEmployeeDetails: async (employeeId: string, token: string): Promise<EmployeeResponse> => {
    const response = await fetch(`${VITE_API_URL}/employees/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee details');
    }

    return response.json();
  }, 

  async getEmployeeIds(token: string) {
    try {
      const response = await fetch(`${VITE_API_URL}/employees?searchBy=Manager&limit=40`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  async getDepartments(token: string) {
    try {
      const response = await fetch(`${VITE_API_URL}/departments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },
};

export type { Employee, EmployeeDetails }; 