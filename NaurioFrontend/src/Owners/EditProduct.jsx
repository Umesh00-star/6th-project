
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    // fetch product details by id
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => setProductData(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/products/${id}`, productData);
      navigate("/");
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Product</h2>
      <input name="name" value={productData.name} onChange={handleChange} placeholder="Name" />
      <input name="price" value={productData.price} onChange={handleChange} placeholder="Price" />
      <input name="category" value={productData.category} onChange={handleChange} placeholder="Category" />
      <textarea name="description" value={productData.description} onChange={handleChange} placeholder="Description" />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProduct;
