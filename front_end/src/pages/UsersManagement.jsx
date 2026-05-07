
import React from 'react';
import Sidebar from '../components/dashboard/sidebar/Sidebar';
import Navbar from '../components/dashboard/navbar/Navbar';
import UsersTable from '../components/dashboard/users/UsersTable';

const UsersManagement = () => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <main className="dashboard-content">
                    <header className="content-header">
                        <h1>Gestión de Usuarios</h1>
                        <p>Administración de perfiles y niveles de acceso según la jerarquía establecida.</p>
                    </header>
                    <UsersTable />
                </main>
            </div>
        </div>
    );
};

export default UsersManagement;
