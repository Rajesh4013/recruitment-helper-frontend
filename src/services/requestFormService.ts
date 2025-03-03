const VITE_API_URL = import.meta.env.VITE_API_URL;

export const insertRequestFormData = async (data: any) => {
    const response = await fetch(`${VITE_API_URL}/job-description`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    return responseData;
};