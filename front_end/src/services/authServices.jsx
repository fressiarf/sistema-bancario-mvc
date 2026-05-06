const API_URL = "http://localhost:3000/api/auth/login";

export async function login(credentials) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include' // IMPORTANTE para recibir la cookie del servidor
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en el login');
        }

        return data;
    } catch (error) {
        console.error("Error en el servicio de autenticación:", error);
        throw error;
    }
}
