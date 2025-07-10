import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-section">
      <motion.div
        className="hero-overlay"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>All Your Essential Needs</h1>
        <p>Shop across tech, home, health & more</p>
        <button className="hero-button">Shop Now</button>
      </motion.div>
    </section>
  );
}

export default Hero;
