import React from 'react';
import Hero from './components/herosection';
import FeaturedServices from './components/Dynamic Featured Services';
import PopularCategories from './components/Popular Categories';
import HowitWorksBanner from './How-It-work/page';






const Home = () => {
  return (
    <div>
    <Hero/>
    <FeaturedServices/>
    <HowitWorksBanner/>
    <PopularCategories/>
    </div>
  );
};

export default Home;