import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "../pages/Register";
import Login from "../pages/Login";

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default Routing;