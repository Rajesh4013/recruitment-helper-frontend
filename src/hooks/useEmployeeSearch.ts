import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeService, Employee } from '../services/employeeService';

interface UseEmployeeSearchResult {
  searchResults: Employee[];
  isLoading: boolean;
  error: string | null;
  searchById: (id: string) => Promise<void>;
  searchByName: (name: string) => Promise<void>;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
}

export const useEmployeeSearch = (): UseEmployeeSearchResult => {
  const { token } = useAuth();
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const searchById = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await employeeService.getEmployeeById(id, token!);
      if (response.data.length > 0) {
        setSelectedEmployee(response.data[0]);
      }
      setSearchResults(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const searchByName = async (name: string) => {
    if (!name) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await employeeService.searchEmployees(name, token!);
      setSearchResults(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResults,
    isLoading,
    error,
    searchById,
    searchByName,
    selectedEmployee,
    setSelectedEmployee
  };
}; 