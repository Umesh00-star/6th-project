import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./ShowStyle/Shopnow.css";
import ProductCard from "../components/Products/ProductCard";


const Shopnow = () => {
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:8080/api/product")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setDisplayProducts(data);
        } else {
          console.error("Expected array but got:", data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Sort products
  useEffect(() => {
    let sorted = [...products];

    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setDisplayProducts(sorted);
    setCurrentPage(1);
  }, [sortOption, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(displayProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Animation variants for product card popping
  const productVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <section className="shopnow-section">
      <h2 className="shopnow-title">Shop Now</h2>

      <div className="sort-wrapper">
        <label htmlFor="sort-select" className="sort-label">Sort by:</label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-select"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="products-grid-wrapper">
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
                <ProductCard
                 product={p} />
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
              >
                {idx + 1}
              </button>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
};

export default Shopnow;
