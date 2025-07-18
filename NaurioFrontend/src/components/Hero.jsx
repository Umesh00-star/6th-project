import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';
import { Link } from 'react-router-dom';

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
        <Link to ="/shop-now" className="hero-button">Shop Now</Link>
      </motion.div>
    </section>
  );
}

export default Hero;
