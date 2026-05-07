
import React from 'react';
import './HomeServices.css';

const HomeServices = () => {
    const services = [
        {
            title: "Cuentas BN",
            desc: "Ahorros, Corrientes y Digitales para todas tus metas.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 10V21M19 10V21M9 10V21M15 10V21M12 2l9 8H3l9-8z"></path></svg>
        },
        {
            title: "Tarjetas",
            desc: "Crédito y Débito con beneficios exclusivos en comercios.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        },
        {
            title: "Préstamos",
            desc: "Financiamiento para vivienda, vehículo o personales.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        },
        {
            title: "Inversiones",
            desc: "Hacé crecer tu dinero con nuestros certificados y fondos.",
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        }
    ];

    return (
        <section className="home-services">
            <div className="services-container">
                <div className="services-header">
                    <h2>Nuestros Servicios</h2>
                    <p>Soluciones financieras diseñadas para cada etapa de tu vida.</p>
                </div>
                <div className="services-grid">
                    {services.map((s, i) => (
                        <div key={i} className="service-card">
                            <div className="service-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                            <button className="service-btn">Explorar</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeServices;
