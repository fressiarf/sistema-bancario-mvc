const { Rol } = require('./database');

async function checkRoles() {
    try {
        const roles = await Rol.findAll();
        console.log('--- ROLES EN LA BASE DE DATOS ---');
        roles.forEach(r => {
            console.log(`ID: ${r.id} | Nombre: ${r.nombre}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkRoles();
