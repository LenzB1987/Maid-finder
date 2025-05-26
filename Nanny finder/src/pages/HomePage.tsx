import React from 'react';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedNannies from '../components/home/FeaturedNannies';
import Testimonials from '../components/home/Testimonials';

const HomePage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <FeaturedNannies />
      <Testimonials />
    </main>
  );
};

export default HomePage;