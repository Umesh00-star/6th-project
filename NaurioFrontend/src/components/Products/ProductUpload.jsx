import { useState } from "react";
import axios from "axios";
import { response } from "express";

function ProductUpload() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProduct({ ...product, image: files[0] });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // You can check role condition here if needed
    const role = localStorage.getItem("role", response.data.role.shop()); // Assuming you store user role in localStorage
     const userId = localStorage.getItem("userId", response.data.id);

    if (role !== "shop") {
      alert("Only shop users can upload products.");
      return;
    }

    
  if (!userId) {
    alert("User ID not found. Please log in again.");
    return;
  }
  
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post("http://localhost:8080/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product uploaded!");
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input name="name" placeholder="Product Name" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
      <input name="weight" type="number" placeholder="Weight" onChange={handleChange} required />
      <input name="category" placeholder="Category (e.g., tech, kitchen)" onChange={handleChange} required />
      <input name="image" type="file" accept="image/*" onChange={handleChange} required />
      <button type="submit">Upload Product</button>
    </form>
  );
}

export default ProductUpload;
