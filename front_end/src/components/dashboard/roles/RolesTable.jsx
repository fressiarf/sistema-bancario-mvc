
import React, { useState, useEffect } from 'react';
import { getRoles, postRol, deleteRol } from '../../../services/rolServices';
import './RolesTable.css';

const RolesTable = () => {
    const [roles, setRoles] = useState([]);
    const [nuevoRol, setNuevoRol] = useState({ nombre: '', descripcion: '' });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        try {
            const data = await getRoles();
            if (Array.isArray(data)) {
                setRoles(data);
                setError('');
            } else {
                setError(data?.message || 'No se pudieron cargar los roles');
            }
            setCargando(false);
        } catch (err) {
            setError('Error en la conexión con el servidor');
            setCargando(false);
        }
    };

    const handleCrearRol = async (e) => {
        e.preventDefault();
        if (!nuevoRol.nombre.trim()) return;

        try {
            const data = await postRol(nuevoRol);
            if (data && data.id) {
                setNuevoRol({ nombre: '', descripcion: '' });
                cargarRoles();
            } else {
                setError(data.message || 'Error al crear rol');
            }
        } catch (err) {
            setError('Error en la conexión');
        }
    };

    if (cargando) return <p>Cargando roles...</p>;

    return (
        <div className="roles-container" id="roles-section">
            <div className="section-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h2>Gestión de Roles</h2>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleCrearRol} className="rol-form">
                <div className="form-group-rol">
                    <input 
                        type="text" 
                        placeholder="Nombre del nuevo rol..." 
                        value={nuevoRol.nombre}
                        onChange={(e) => setNuevoRol({ ...nuevoRol, nombre: e.target.value })}
                        className="rol-input"
                    />
                    <input 
                        type="text" 
                        placeholder="Descripción del rol..." 
                        value={nuevoRol.descripcion}
                        onChange={(e) => setNuevoRol({ ...nuevoRol, descripcion: e.target.value })}
                        className="rol-input"
                    />
                    <button type="submit" className="rol-btn-add">Crear Rol</button>
                </div>
            </form>

            <div className="table-responsive">
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Rol</th>
                            <th>Descripción</th>
                            <th>Fecha Creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((rol) => (
                            <tr key={rol.id}>
                                <td>#{rol.id}</td>
                                <td>
                                    <span className={`rol-tag ${rol.nombre.toLowerCase()}`}>
                                        {rol.nombre}
                                    </span>
                                </td>
                                <td>{rol.descripcion || 'Sin descripción'}</td>
                                <td>{new Date(rol.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RolesTable;
