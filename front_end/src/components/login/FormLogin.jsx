import React, { useState } from "react";
import { login } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./FormLogin.css";

const FormLogin = () => {
    const { loginUser } = useAuth();
    const [credentials, setCredentials] = useState({
        email: "",
        contrasenia: ""
    });
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(credentials);
            if (result) {
                loginUser(result.usuario);
                setMensaje("¡Bienvenido!");
                // Redirigir al home después de un breve delay
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (error) {
            setMensaje(error.message || "Credenciales incorrectas");
        }
    };

    return (
        <div className="login-container horizontal">
            <div className="login-left">
                <div className="bcr-logo-small">BN</div>
                <div className="welcome-text">
                    <h3>Acceso Administrativo</h3>
                    <p>Ingrese sus credenciales para gestionar la plataforma bancaria de forma segura.</p>
                </div>
            </div>
            <div className="login-right">
                <div className="login-content">
                    <div className="admin-badge">Seguridad Bancaria</div>
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@banco.com"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="contrasenia"
                                placeholder="••••••••"
                                value={credentials.contrasenia}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit">Ingresar al Portal</button>
                    </form>
                    {mensaje && <p className="message">{mensaje}</p>}
                </div>
            </div>
        </div>
    );
};

export default FormLogin;
