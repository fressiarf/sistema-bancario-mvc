import React from "react";
import Sidebar from "../components/dashboard/sidebar/Sidebar";
import Navbar from "../components/dashboard/navbar/Navbar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    
    // Datos mock para las tarjetas de resumen
    const stats = [
        { 
            title: "Usuarios Activos", 
            value: "1,254", 
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, 
            change: "+12%" 
        },
        { 
            title: "Patrimonio Administrado", 
            value: "₡45.2M", 
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, 
            change: "+5.4%" 
        },
        { 
            title: "Operaciones Diarias", 
            value: "342", 
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, 
            change: "+18%" 
        },
        { 
            title: "Integridad del Sistema", 
            value: "Óptima", 
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>, 
            change: "100%" 
        },
    ];

    // Verificar si es administrador o superadmin (ID 5)
    const nombreRol = user?.rol?.nombre?.toLowerCase() || '';
    const rolId = user?.rol_id;
    const esAdmin = rolId === 5 || nombreRol.includes('admin') || nombreRol === 'superadministrador';
    const esSuperAdmin = rolId === 5 || nombreRol === 'superadministrador';

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <main className="dashboard-content">
                    <header className="content-header">
                        <h1>Consola de Control</h1>
                        <p>Visión general del estado operativo y financiero del sistema.</p>
                    </header>

                    <section className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-icon-container">{stat.icon}</div>
                                <div className="stat-info">
                                    <h3>{stat.title}</h3>
                                    <p className="stat-value">{stat.value}</p>
                                    <span className="stat-change">{stat.change} respecto al periodo anterior</span>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="dashboard-sections">
                        <div className="recent-activity">
                            <div className="section-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <h2>Registro de Actividad</h2>
                            </div>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <span className="activity-time">Hace 5 min</span>
                                    <p>Nuevo cliente registrado: <strong>Ana María Rojas</strong></p>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-time">Hace 15 min</span>
                                    <p>Transferencia aprobada por <strong>₡500,000</strong></p>
                                </div>
                                <div className="activity-item">
                                    <span className="activity-time">Hace 1 hora</span>
                                    <p>Intento de acceso fallido: <strong>IP 192.168.1.45</strong></p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
