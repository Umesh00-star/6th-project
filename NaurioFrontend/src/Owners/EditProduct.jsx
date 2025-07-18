import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './OwnStyle/Edit.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/product/${id}`).then((res) => {
      setProduct({ ...res.data, image: null });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in product) {
      if (product[key] !== null) {
        formData.append(key, product[key]);
      }
    }

    try {
      await axios.put(`http://localhost:8080/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated!");
      navigate("/shop");
    } catch (err) {
      console.error("❌ Failed to update:", err);
      alert("Update failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form-container">
      <h2>Edit Product</h2>
      <input name="name" value={product.name} onChange={handleChange} placeholder="Product Name" required />
<textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" required />
<input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price ($)" required />
<input type="number" name="weight" value={product.weight} onChange={handleChange} placeholder="Weight (kg)" required />
<input name="category" value={product.category} onChange={handleChange} placeholder="Category" required />
<input type="file" name="image" onChange={handleChange} />

      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditProduct;
