import React, { useState } from "react";
import { postUsuarios } from "../../services/userServices";
import "./FormRegister.css";

const FormRegister = () => {
    const [formData, setFormData] = useState({
        nombre_completo: "",
        email: "",
        telefono: "",
        contrasenia: "",
        rol_id: 1 // Por defecto cliente
    });

    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await postUsuarios(formData);
            if (result) {
                setMensaje("Usuario registrado con éxito");
                setFormData({
                    nombre_completo: "",
                    email: "",
                    telefono: "",
                    contrasenia: "",
                    rol_id: 1
                });
            }
        } catch (error) {
            setMensaje("Error al registrar el usuario");
            console.error(error);
        }
    };

    return (
        <div className="register-container horizontal">
            <div className="register-left">
                <div className="bcr-logo-mock">BC</div>
                <div className="welcome-text">
                    <h3>Portal Administrativo</h3>
                    <p>Gestión interna para el registro y habilitación de nuevos clientes en la plataforma bancaria.</p>
                </div>
            </div>
            <div className="register-right">
                <div className="register-content">
                    <div className="admin-badge">Sesión de Administrador</div>
                    <h2>Registro de Cliente</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                name="nombre_completo"
                                placeholder="Ingrese nombre completo"
                                value={formData.nombre_completo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Corporativo</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    placeholder="8888-8888"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    name="contrasenia"
                                    placeholder="••••••••"
                                    value={formData.contrasenia}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit">Registrar</button>
                    </form>
                    {mensaje && <p className="message">{mensaje}</p>}
                </div>
            </div>
        </div>
    );
};

export default FormRegister;
