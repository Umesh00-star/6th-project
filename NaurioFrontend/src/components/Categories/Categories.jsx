import React from 'react';
import { motion } from 'framer-motion';
import techImg from '../../img/TechProducts.png';
import commercialImg from '../../img/CommercialProducts.png';
import kitchenImg from '../../img/kitchenproducts.png';
import printImg from '../../img/PrinInDemand.png';
import './Categories.css';

const items = [
  { name: 'Tech Products', img: techImg },
  { name: 'Commercial & Official', img: commercialImg },
  { name: 'Kitchen Products', img: kitchenImg },
  { name: 'Print-On-Demand', img: printImg },
];

const Categories = () => {
  return (
    <section className="categories-section">
      <motion.h2
        className="categories-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        🛍️ Featured Collections
      </motion.h2>

      <div className="categories-container">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="category-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
          >
            <div className="img-wrapper">
              <img src={item.img} alt={item.name} className="category-img" />
              <div className="img-overlay"></div>
            </div>
            <p className="category-name">{item.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
