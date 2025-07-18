import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import techImg from '../img/TechProducts.png';
import commercialImg from '../img/CommercialProducts.png';
import kitchenImg from '../img/kitchenproducts.png';
import printImg from '../img/PrinInDemand.png';
import './ShowStyle/Shopnow.css';
import { useNavigate } from 'react-router-dom';
import ProductCard from "../components/Products/ProductCard"; // ✅ Make sure this path is correct

const items = [
  { name: 'Tech Products', img: techImg, link: '/Tech' },
  { name: 'Commercial & Official', img: commercialImg, link: '/Commercial' },
  { name: 'Kitchen Products', img: kitchenImg, link: '/Kitchen' },
  { name: 'Print-On-Demand', img: printImg, link: '/Print' },
];

const Shopnow = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/product")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Expected array but got:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

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
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
            onClick={() => navigate(item.link)}
            style={{ cursor: 'pointer' }}
          >
            <div className="img-wrapper">
              <img src={item.img} alt={item.name} className="category-img" />
              <div className="img-overlay"></div>
            </div>
            <p className="category-name">{item.name}</p>
          </motion.div>
        ))}
      </div>

      <motion.h2
        className="products-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        🛒 All Products
      </motion.h2>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </section>
  );
};

export default Shopnow;
