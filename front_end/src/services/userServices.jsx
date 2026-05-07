

export async function postUsuarios(usuario){

       try {

        const respuesta = await fetch("http://localhost:3000/api/usuarios",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(usuario),
            credentials: "include"
        })

        const datosUsuarios= await respuesta.json();

        return datosUsuarios;
        
    } catch (error) {
        
        console.error("Error al obtener los usuarios", error);
    }
}
export async function getUsuarios() {
    try {
        const respuesta = await fetch("http://localhost:3000/api/usuarios", {
            method: "GET",
            credentials: "include"
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
    }
}

export async function putUsuarios(id, usuario) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario),
            credentials: "include"
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error al actualizar el usuario", error);
    }
}
