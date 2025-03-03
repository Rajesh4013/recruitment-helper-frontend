const VITE_API_URL = import.meta.env.VITE_API_URL;

// export const getUserDetails = async (token: string) => {
//     const response = await fetch(`${VITE_API_URL}/user-details`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });
//     if (!response.ok) {
//         throw new Error('Failed to fetch user details');
//     }
//     const data = await response.json();
//     return data;
// };

export const loginService = async (email: string, password: string) => {
    const response = await fetch(`${VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    const data = await response.json();
    return data;
};
