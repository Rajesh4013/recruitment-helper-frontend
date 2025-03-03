const VITE_API_URL = import.meta.env.VITE_API_URL;

export const fetchResourceRequests = async (userId: number, token: string) => {
    const response = await fetch(`${VITE_API_URL}/resource-requests/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch resource requests');
    }
    const data = await response.json();
    return data;
};

export const fetchResourceRequest = async (id: string, token: string) => {
    const response = await fetch(`${VITE_API_URL}/resource-requests/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch resource request');
    }
    const data = await response.json();
    return data;
};

export const updateResourceRequest = async (id: string, token: string, requestData: any) => {
    const response = await fetch(`${VITE_API_URL}/resource-requests/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    });
    if (!response.ok) {
        throw new Error('Failed to update resource request');
    }
    const data = await response.json();
    return data;
};

export const deleteResourceRequest = async (id: string, token: string) => {
    const response = await fetch(`${VITE_API_URL}/resource-requests/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete resource request');
    }
    const data = await response.json();
    return data;
};
