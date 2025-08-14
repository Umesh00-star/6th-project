import React, { useState } from "react";
import axios from "axios";
import { useShopAuth } from "../../Auths/ShopAuthLogic";
import './ProductStyle/Upload.css';

function ProductUpload() {
  const { shop } = useShopAuth();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProduct((prev) => ({ ...prev, image: files[0] }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!product.name || !product.description || !product.price || !product.weight || !product.category || !product.image) {
      setError("All fields are required.");
      return false;
    }

    if (parseFloat(product.price) <= 0 || parseFloat(product.weight) <= 0) {
      setError("Price and weight must be positive.");
      return false;
    }

    if (product.image && !product.image.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return false;
    }

    if (product.image && product.image.size > 10 * 1024 * 1024) {
      setError("Image size should not exceed 10MB.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Early validation check
    if (!validateForm()) return;

    if (!shop) {
      alert("Please log in to upload a product.");
      return;
    }

    if (shop.role !== "shop") {
      alert("Only shop users can upload products.");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", parseFloat(product.price));
    formData.append("weight", parseFloat(product.weight));
    formData.append("category", product.category);
    formData.append("image", product.image);
    formData.append("shopId", shop.id);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show success message
      setSuccessMessage("Product uploaded successfully!");
      setProduct({
        name: "",
        description: "",
        price: "",
        weight: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error("Upload failed.", error);
      setError("Failed to upload product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <input
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <input
          name="weight"
          type="number"
          placeholder="Weight"
          value={product.weight}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category (e.g., tech, kitchen)"
          value={product.category}
          onChange={handleChange}
          required
        />

        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}

export default ProductUpload;
