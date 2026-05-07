import { useAuth } from "../../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user } = useAuth();
    
    // Obtener inicial del nombre
    const inicial = user?.nombre_completo ? user.nombre_completo.charAt(0).toUpperCase() : "A";

    return (
        <header className="dashboard-navbar">
            <div className="search-box">
                <input type="text" placeholder="Buscar cliente, cuenta o transacción..." />
            </div>
            
            <div className="navbar-actions">
                <div className="notifications">
                    <span className="badge">3</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>
                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user?.nombre_completo || "Usuario"}</span>
                        <span className="user-role">{user?.rol?.nombre || "Acceso"}</span>
                    </div>
                    <div className="user-avatar">
                        {inicial}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
