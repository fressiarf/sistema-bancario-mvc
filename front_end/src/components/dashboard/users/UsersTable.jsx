
import React, { useState, useEffect } from 'react';
import { getUsuarios, putUsuarios } from '../../../services/userServices';
import { getRoles } from '../../../services/rolServices';
import { useAuth } from '../../../context/AuthContext';
import './UsersTable.css';

const UsersTable = () => {
    const { user: currentUser } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const nombreRolUser = currentUser?.rol?.nombre?.toLowerCase() || '';
    const rolIdUser = currentUser?.rol_id;
    const esSuperAdmin = rolIdUser === 5 || nombreRolUser === 'superadministrador';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersData = await getUsuarios();
            if (Array.isArray(usersData)) {
                setUsuarios(usersData);
            } else {
                setError(usersData?.message || 'Error al cargar usuarios');
            }

            if (esSuperAdmin) {
                const rolesData = await getRoles();
                if (Array.isArray(rolesData)) {
                    setRoles(rolesData);
                }
            }
            setCargando(false);
        } catch (err) {
            setError('Error de conexión');
            setCargando(false);
        }
    };

    const handleRoleChange = async (userId, newRolId) => {
        if (!esSuperAdmin) return;
        
        try {
            const result = await putUsuarios(userId, { rol_id: newRolId });
            if (result) {
                setMensaje('Rol actualizado correctamente');
                fetchData(); // Recargar lista
                setTimeout(() => setMensaje(''), 3000);
            }
        } catch (err) {
            setError('Error al actualizar el rol');
        }
    };

    if (cargando) return <div className="loading">Cargando gestión de usuarios...</div>;

    return (
        <div className="users-container" id="users-section">
            <div className="section-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h2>Gestión de Usuarios y Jerarquías</h2>
            </div>

            {error && <div className="error-msg">{error}</div>}
            {mensaje && <div className="success-msg">{mensaje}</div>}

            <div className="table-responsive">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            <th>Rol Actual</th>
                            <th>Estado</th>
                            {esSuperAdmin && <th>Cambiar Rol</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>
                                <td>{u.identificacion}</td>
                                <td className="user-name-cell">
                                    <strong>{u.nombre_completo}</strong>
                                    {u.id === currentUser?.id && <span className="self-tag">(Tú)</span>}
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`rol-tag ${u.rol?.nombre.toLowerCase()}`}>
                                        {u.rol?.nombre}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-tag ${u.estado}`}>
                                        {u.estado}
                                    </span>
                                </td>
                                {esSuperAdmin && (
                                    <td>
                                        <select 
                                            className="role-select-mini"
                                            value={u.rol_id}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            disabled={u.id === currentUser?.id} // No se puede cambiar el rol a sí mismo
                                        >
                                            {roles.map(r => (
                                                <option key={r.id} value={r.id}>{r.nombre}</option>
                                            ))}
                                        </select>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;
