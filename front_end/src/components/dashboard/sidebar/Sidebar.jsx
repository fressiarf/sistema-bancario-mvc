import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();
    
    const nombreRol = user?.rol?.nombre?.toLowerCase() || '';
    const esAdmin = nombreRol.includes('admin') || nombreRol === 'superadmin';
    const esSuperAdmin = nombreRol === 'superadmin';

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
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
                    <li className="nav-item active">
                        <Link to="/dashboard">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/register">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            Gestión de Usuarios
                        </Link>
                    </li>
                    
                    {esAdmin && (
                        <>
                            <li className="nav-item">
                                <Link 
                                    to="/dashboard" 
                                    onClick={(e) => {
                                        if (window.location.pathname === '/dashboard') {
                                            e.preventDefault();
                                            document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                    Gestión de Roles
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/logs">
                                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    Auditoría de Acceso
                                </Link>
                            </li>
                        </>
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
