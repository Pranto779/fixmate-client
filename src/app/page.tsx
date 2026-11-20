import React from 'react';
import Hero from './components/herosection';
import FeaturedServices from './components/Dynamic Featured Services';
import PopularCategories from './components/Popular Categories';
import HowitWorksBanner from './How-It-work/page';
import HowitWorks from './How-It-work/howitwork';

const Home = () => {
  return (
    <div>
    <Hero/>
    <FeaturedServices/>
    <HowitWorks/>
    <PopularCategories/>
    </div>
  );
};

export default Home;