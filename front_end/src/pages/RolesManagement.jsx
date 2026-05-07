
import React from 'react';
import Sidebar from '../components/dashboard/sidebar/Sidebar';
import Navbar from '../components/dashboard/navbar/Navbar';
import RolesTable from '../components/dashboard/roles/RolesTable';
import './Dashboard.css';

const RolesManagement = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <main className="dashboard-content">
                    <header className="content-header">
                        <h1>Gestión de Roles</h1>
                        <p>Configuración de capacidades y permisos estructurales del sistema.</p>
                    </header>
                    <RolesTable />
                </main>
            </div>
        </div>
    );
};

export default RolesManagement;
