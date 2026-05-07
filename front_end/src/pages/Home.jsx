import React from 'react';
import HomeNavbar from '../components/home/navbar/HomeNavbar';
import HomeHero from '../components/home/hero/HomeHero';
import HomeServices from '../components/home/services/HomeServices';
import HomeFooter from '../components/home/footer/HomeFooter';

const Home = () => {
    return (
        <div className="home-page">
            <HomeNavbar />
            <HomeHero />
            <HomeServices />
            <HomeFooter />
        </div>
    );
};

export default Home;
