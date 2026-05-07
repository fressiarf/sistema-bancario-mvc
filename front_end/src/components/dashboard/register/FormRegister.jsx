import React, { useState, useEffect } from "react";
import { postUsuarios } from "../../../services/userServices";
import { getRoles } from "../../../services/rolServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./FormRegister.css";

const FormRegister = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [roles, setRoles] = useState([]);
    
    const nombreRolUser = user?.rol?.nombre?.toLowerCase() || '';
    const rolIdUser = user?.rol_id;
    const esAdmin = nombreRolUser.includes('admin') || nombreRolUser === 'superadministrador' || rolIdUser === 5;
    const esSuperAdmin = nombreRolUser === 'superadministrador' || rolIdUser === 5;

    // Filtrar roles según jerarquía
    const filteredRoles = roles.filter(rol => {
        const nombreR = rol.nombre.toLowerCase();
        if (esSuperAdmin) return true; // SuperAdmin ve todo
        if (esAdmin) return !nombreR.includes('admin') && !nombreR.includes('super'); // Admin no ve ni Admin ni SuperAdmin
        return false; // Otros no deberían ver el selector (protegido por esAdmin en el render)
    });

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

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getRoles();
                if (Array.isArray(data)) {
                    setRoles(data);
                    // Si el rol por defecto (2) no existe en la lista, poner el primero disponible
                    if (!data.find(r => r.id === 2) && data.length > 0) {
                        setFormData(prev => ({ ...prev, rol_id: data[0].id }));
                    }
                }
            } catch (error) {
                console.error("Error al cargar roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (e) => {
        const selectedRolId = parseInt(e.target.value);
        const selectedRol = roles.find(r => r.id === selectedRolId);
        
        setFormData({
            ...formData,
            rol_id: selectedRolId,
            puesto: "",
            direccion: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = { ...formData };
            
            // Lógica basada en el nombre del rol en lugar de IDs fijos si es posible
            const selectedRol = roles.find(r => r.id === formData.rol_id);
            const nombreRol = selectedRol?.nombre.toLowerCase();

            if (nombreRol === 'cliente') delete dataToSend.puesto;
            else if (nombreRol === 'empleado' || nombreRol === 'admin' || nombreRol === 'administrador') delete dataToSend.direccion;

            const result = await postUsuarios(dataToSend);
            if (result) {
                setMensaje(`¡Usuario con rol "${selectedRol?.nombre}" registrado con éxito!`);
                setFormData({
                    identificacion: "",
                    nombre_completo: "",
                    email: "",
                    telefono: "",
                    direccion: "",
                    puesto: "",
                    contrasenia: "",
                    rol_id: roles.find(r => r.nombre.toLowerCase() === 'cliente')?.id || roles[0]?.id || 2
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
                    <h3>Portal de {esSuperAdmin ? 'Super Control' : 'Gestión'}</h3>
                    <p>{esSuperAdmin ? 'Administración total de la infraestructura bancaria.' : 'Habilitación de nuevos perfiles en la plataforma bancaria central.'}</p>
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
                    
                    <h2>Registro de {roles.find(r => r.id === formData.rol_id)?.nombre || "Usuario"}</h2>
                    
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="step-container animate-field">
                                {esAdmin && (
                                    <div className="form-group role-selector">
                                        <label>Tipo de Usuario (Rol)</label>
                                        <select name="rol_id" value={formData.rol_id} onChange={handleRoleChange}>
                                            {filteredRoles.map(rol => (
                                                <option key={rol.id} value={rol.id}>
                                                    {rol.nombre}
                                                </option>
                                            ))}
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
                                        placeholder="usuario@bncr.fi.cr"
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

                                {roles.find(r => r.id === formData.rol_id)?.nombre.toLowerCase() !== 'cliente' ? (
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
