import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Swal from 'sweetalert2';
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();
    
    const nombreRol = user?.rol?.nombre?.toLowerCase() || '';
    const rolId = user?.rol_id;
    
    const esSuperAdmin = rolId === 5 || nombreRol === 'superadministrador';
    const esAdmin = esSuperAdmin || nombreRol.includes('admin');

    const handleLogout = () => {
        Swal.fire({
            title: '¿Finalizar sesión?',
            text: "Se cerrará el acceso a las herramientas administrativas.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#002B7F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                logoutUser();
                navigate("/");
                Swal.fire({
                    title: '¡Hasta pronto!',
                    text: 'Sesión cerrada correctamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const getPortalName = () => {
        if (esSuperAdmin) return 'Portal SuperAdmin';
        if (esAdmin) return 'Portal Admin';
        return 'Portal Empleado';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="bcr-logo-small">BN</div>
                <span>{getPortalName()}</span>
            </div>
            
            <nav className="sidebar-nav">
                <ul>
                    <li className="nav-header">Principal</li>
                    <li className="nav-item">
                        <Link to="/">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Página Principal
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link to="/dashboard">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            Consola Dashboard
                        </Link>
                    </li>

                    <li className="nav-header">Administración</li>
                    <li className="nav-item">
                        <Link to="/register">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            Registrar Nuevo
                        </Link>
                    </li>
                    
                    <li className="nav-item">
                        <Link to="/users">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                            Lista de Usuarios
                        </Link>
                    </li>
                    
                    {esSuperAdmin && (
                        <li className="nav-item">
                            <Link to="/roles">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                Gestión de Roles
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
