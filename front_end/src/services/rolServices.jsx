
const API_URL = "http://localhost:3000/api/roles";

export async function getRoles() {
    try {
        const respuesta = await fetch(API_URL, {
            method: "GET",
            credentials: "include"
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener roles:", error);
    }
}

export async function postRol(rol) {
    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(rol),
            credentials: "include"
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error al crear rol:", error);
    }
}

export async function putRol(id, rol) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(rol),
            credentials: "include"
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error al actualizar rol:", error);
    }
}

export async function deleteRol(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error al eliminar rol:", error);
    }
}
