import React, { useEffect, useState } from "react";
import { useAuth } from "../Auths/AuthLogic";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductUpload from "../components/Products/ProductUpload";

const Shops = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "shop") {
      navigate("/login"); // Redirect non-shop users
    } else {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/products/user/${user.id}`);
      setMyProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Shop</h2>

      <ProductUpload /> {/* Only shop users will see this */}

      <h3>My Products</h3>
      {myProducts.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul>
          {myProducts.map((product) => (
            <li key={product.id}>
              {product.name} - {product.price} - {product.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Shops;
