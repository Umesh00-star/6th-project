import React from 'react';
import AboutUs from './AboutUs/AboutUs';
import ComingSoonBanner from './ComingSoonBanner';
import './ComingSoonSection.css';

function ComingSoonSection() {
  return (
    <section className="comingsoon-section">
      <AboutUs />
      <ComingSoonBanner />
    </section>
  );
}

export default ComingSoonSection;
