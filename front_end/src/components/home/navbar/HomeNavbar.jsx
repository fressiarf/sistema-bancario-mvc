
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import './HomeNavbar.css';

const HomeNavbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    
    const nombreRol = user?.rol?.nombre?.toLowerCase() || '';
    const rolId = user?.rol_id;
    // Empleado, Admin o SuperAdmin (ID 5)
    const puedeVerDashboard = rolId === 5 || nombreRol.includes('admin') || nombreRol.includes('empleado');

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "Tendrás que volver a ingresar tus credenciales para acceder al portal.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#002B7F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            background: '#fff',
            color: '#333'
        }).then((result) => {
            if (result.isConfirmed) {
                logoutUser();
                navigate('/');
                Swal.fire({
                    title: '¡Sesión cerrada!',
                    text: 'Has salido del sistema de forma segura.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    confirmButtonColor: '#002B7F'
                });
            }
        });
    };

    return (
        <nav className="home-navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="logo-text">BN</span>
                    <span className="logo-divider">|</span>
                    <span className="logo-sub">Más cerca de usted</span>
                </div>
                
                <ul className="nav-links">
                    <li><Link to="/">Personas</Link></li>
                    <li><Link to="/">Empresas</Link></li>
                    <li><Link to="/">Pymes</Link></li>
                    <li><Link to="/">Instituciones</Link></li>
                    <li><Link to="/">BCR Valores</Link></li>
                </ul>

                <div className="nav-actions">
                    {user ? (
                        <>
                            <div className="user-info-group">
                                <div className="user-welcome">
                                    Hola, <span>{user.nombre_completo.split(' ')[0]}</span>
                                </div>
                                {puedeVerDashboard && (
                                    <Link to="/dashboard" className="btn-dashboard-mini">
                                        Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="btn-logout-home">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Salir
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="btn-login">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Banca en Línea
                        </Link>
                    )}
                </div>
            </div>
            <div className="navbar-sub-nav">
                <div className="navbar-container">
                    <ul className="sub-links">
                        <li><Link to="/">Cuentas</Link></li>
                        <li><Link to="/">Tarjetas</Link></li>
                        <li><Link to="/">Préstamos</Link></li>
                        <li><Link to="/">Inversiones</Link></li>
                        <li><Link to="/">Pensiones</Link></li>
                        <li><Link to="/">Seguros</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default HomeNavbar;
