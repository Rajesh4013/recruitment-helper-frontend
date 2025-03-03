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
    const response = await fetch(`http://localhost:3001/api/employees?search=${searchTerm}`, {
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
    const response = await fetch(`http://localhost:3001/api/employees?employeeId=${employeeId}`, {
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
    const response = await fetch(`http://localhost:3001/api/employees/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee details');
    }

    return response.json();
  }
};

export type { Employee, EmployeeDetails }; 