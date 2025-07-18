import React, { useEffect, useState } from "react";
import { useAuth } from "../Auths/AuthLogic";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './OwnStyle/Shophome.css';

const ShopHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products for shop user
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "shop") {
      fetchMyProduct();
    }
  }, [user]);

  const fetchMyProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/product/user/${user.id}`);
      setProduct(Array.isArray(res.data) ? res.data : []); // Prevent .map error
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/product/${productId}`);
      fetchMyProduct(); // Refresh list after deletion
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  if (!user) return <p>Loading...</p>;

  if (user.role !== "shop") {
    return <p style={{ color: "red" }}>🚫 Unauthorized: This page is only for shop users.</p>;
  }

  return (
  <div className="shop-home">
    <h2>🛍️ My Products</h2>

    {loading ? (
      <p>Loading products...</p>
    ) : product.length === 0 ? (
      <p>No products uploaded yet.</p>
    ) : (
      <div className="product-grid">
        {product.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-product.jpg";
              }}
            />
            <div className="product-info">
              <strong>{product.name}</strong>
              <p>${product.price.toFixed(2)}</p>
              <em>{product.category}</em>
            </div>
            <div className="product-buttons">
              <button onClick={() => handleEdit(product.id)}>✏️ Edit</button>
              <button onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default ShopHome;
