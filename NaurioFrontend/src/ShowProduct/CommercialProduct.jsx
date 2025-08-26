import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/Products/ProductCard";
import "./ShowStyle/Commercials.css";

const CommercialProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
   const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/product/category/commercial")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Expected array but got:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  if (!Array.isArray(products)) {
    return <div className="loading">Loading...</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Animation variants for popping effect
  const productVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <section className="commercial-section">
         {/* Back Button */}
      <div className="back-button-wrapper">
        <button className="back-button" onClick={() => navigate("/categories")}>
          ⬅ 
        </button>
      </div>
      <h2 className="commercial-title">Commercial & Official Products</h2>

      <motion.div
        className="products-grid"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {currentProducts.length > 0 ? (
          currentProducts.map((p) => (
            <motion.div
              key={p.id}
              variants={productVariants}
              whileHover={{ scale: 1.05 }}
              className="product-motion-wrapper"
            >
              <ProductCard product={p} />
            </motion.div>
          ))
        ) : (
          <p className="no-products-msg">No products found.</p>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`page-btn ${currentPage === idx + 1 ? "active" : ""}`}
              onClick={() => paginate(idx + 1)}
              aria-label={`Go to page ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </nav>
      )}
    </section>
  );
};

export default CommercialProduct;
