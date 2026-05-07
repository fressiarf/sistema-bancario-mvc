
import React from 'react';
import './HomeHero.css';

const HomeHero = () => {
    return (
        <section className="home-hero">
            <div className="hero-content">
                <div className="hero-text">
                    <span className="hero-tag">Nuevo: BN Digital</span>
                    <h1>Juntos somos <br /><span>progreso.</span></h1>
                    <p>Abrí tu cuenta BN Digital desde la app en minutos. Disfrutá de la solidez y confianza del Banco Nacional de Costa Rica.</p>
                    <div className="hero-btns">
                        <button className="btn-primary">Solicitar ahora</button>
                        <button className="btn-secondary">Más información</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="card-mockup">
                        <div className="card-chip"></div>
                        <div className="card-number">**** **** **** 4290</div>
                        <div className="card-holder">CLIENTE BN</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
