import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UsersManagement from "../pages/UsersManagement";
import RolesManagement from "../pages/RolesManagement";

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users-management" element={<UsersManagement />} />
                <Route path="/roles-management" element={<RolesManagement />} />
            </Routes>
        </Router>
    );
};

export default Routing;