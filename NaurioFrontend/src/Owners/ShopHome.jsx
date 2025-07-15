import React, { useEffect, useState } from "react";
import { useAuth } from "../Auths/AuthLogic";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShopHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "shop") {
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

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${productId}`);
      fetchMyProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  if (!user) return <p>Loading...</p>;

  if (user.role !== "shop") {
    return <p>Unauthorized: This page is only for shop users.</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Products</h2>
      {myProducts.length === 0 ? (
        <p>No products uploaded yet.</p>
      ) : (
        <ul>
          {myProducts.map((product) => (
            <li key={product.id} style={{ marginBottom: "1rem" }}>
              <strong>{product.name}</strong> - ${product.price} - {product.category}
              <br />
              <button onClick={() => handleEdit(product.id)}>Edit</button>
              <button onClick={() => handleDelete(product.id)} style={{ marginLeft: "1rem" }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShopHome;
