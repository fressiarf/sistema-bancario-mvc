import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UsersManagement from "../pages/UsersManagement";
import RolesManagement from "../pages/RolesManagement";
import Home from "../pages/Home";

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/roles" element={<RolesManagement />} />
            </Routes>
        </Router>
    );
};

export default Routing;