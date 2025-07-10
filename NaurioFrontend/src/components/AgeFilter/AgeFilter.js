import React from 'react';
import { motion } from 'framer-motion';
import './AgeFilter.css';

function AgeFilter() {
  const ranges = ['0–5', '6–15', '16–30', '31–45', '46–50', '61–75'];

  return (
    <section className="age-section">
      <motion.h2
        className="age-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        🎯 Shop by Age
      </motion.h2>

      <div className="age-button-group">
        {ranges.map((range, i) => (
          <motion.button
            key={i}
            className="age-button"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {range} Years
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export default AgeFilter;
