import React, { useState } from "react";
import { postUsuarios } from "../../../services/userServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./FormRegister.css";

const FormRegister = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    
    const esAdmin = ['Administrador', 'administrador', 'admin'].includes(user?.rol?.nombre);

    const [formData, setFormData] = useState({
        identificacion: "",
        nombre_completo: "",
        email: "",
        telefono: "",
        direccion: "",
        puesto: "",
        contrasenia: "",
        rol_id: 2
    });

    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (e) => {
        setFormData({
            ...formData,
            rol_id: parseInt(e.target.value),
            puesto: "",
            direccion: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData };
            if (dataToSend.rol_id === 2) delete dataToSend.puesto;
            if (dataToSend.rol_id === 3) delete dataToSend.direccion;

            const result = await postUsuarios(dataToSend);
            if (result) {
                setMensaje(`¡${dataToSend.rol_id === 3 ? 'Empleado' : 'Cliente'} registrado con éxito!`);
                setFormData({
                    identificacion: "",
                    nombre_completo: "",
                    email: "",
                    telefono: "",
                    direccion: "",
                    puesto: "",
                    contrasenia: "",
                    rol_id: 2
                });
                setStep(1);
            }
        } catch (error) {
            setMensaje("Error al registrar: " + (error.message || "Verifique los datos"));
        }
    };

    return (
        <div className="register-container horizontal">
            <div className="register-left">
                <div className="bcr-logo-mock">BN</div>
                <div className="welcome-text">
                    <h3>Portal de Gestión</h3>
                    <p>Habilitación de nuevos perfiles en la plataforma bancaria central.</p>
                </div>
            </div>
            <div className="register-right">
                <div className="register-content">
                    <div className="admin-header">
                        <div className="admin-badge">
                            Paso {step} de 2
                        </div>
                        <button className="back-btn" onClick={() => navigate("/dashboard")}>
                            Volver
                        </button>
                    </div>
                    
                    <h2>{formData.rol_id === 3 ? "Registro de Empleado" : "Registro de Cliente"}</h2>
                    
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="step-container animate-field">
                                {esAdmin && (
                                    <div className="form-group role-selector">
                                        <label>Tipo de Usuario</label>
                                        <select name="rol_id" value={formData.rol_id} onChange={handleRoleChange}>
                                            <option value="2">Cliente</option>
                                            <option value="3">Empleado</option>
                                        </select>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Identificación</label>
                                    <input
                                        type="text"
                                        name="identificacion"
                                        placeholder="N° de Cédula o DNI"
                                        value={formData.identificacion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="nombre_completo"
                                        placeholder="Nombre y Apellidos"
                                        value={formData.nombre_completo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="button-group">
                                    <button type="button" className="register-submit-btn" onClick={() => setStep(2)}>
                                        Siguiente Paso
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-container animate-field">
                                <div className="form-group">
                                    <label>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="usuario@bcr.com"
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
                                            placeholder="+506 0000-0000"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contraseña Temporal</label>
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

                                {formData.rol_id === 3 ? (
                                    <div className="form-group">
                                        <label>Puesto / Cargo</label>
                                        <input
                                            type="text"
                                            name="puesto"
                                            placeholder="Ej: Ejecutivo de Cuentas"
                                            value={formData.puesto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Dirección de Residencia</label>
                                        <textarea
                                            name="direccion"
                                            placeholder="Provincia, Cantón, Distrito..."
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            rows="2"
                                        ></textarea>
                                    </div>
                                )}

                                <div className="button-group">
                                    <button type="button" className="secondary-btn" onClick={() => setStep(1)}>
                                        Anterior
                                    </button>
                                    <button type="submit" className="register-submit-btn">
                                        Confirmar Registro
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                    {mensaje && <p className={`message ${mensaje.includes('Error') ? 'error' : 'success'}`}>{mensaje}</p>}
                </div>
            </div>
        </div>
    );
};

export default FormRegister;
