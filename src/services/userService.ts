

const API_URL = import.meta.env.VITE_API_URL;


export const addUser= async (token: string, userData: any) =>{
    try {
      const response = await fetch(`${API_URL}/employees/add-a-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add user:', errorText);
        throw new Error('Failed to add user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
};

