import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Auths/AuthLogic";


function ProductUpload() {
  const {user} = useAuth();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
    image: null,
  });

   const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProduct((prev)=>({ ...prev, image: files[0] }));
    } else {
      setProduct((prev)=>({ ...prev, [name]: value }));
    }
  };

  // const handleChange = (e) => {
  //   setImage(e.target.files[0]);
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get role and userId directly from localStorage without 'response' (which is undefined here)
    // const role = localStorage.getItem("role");
    // const userId = localStorage.getItem("userId");

    
  if (!user) {
    alert("Please log in to upload a product.");
    return;
  }

  if (user.role !== "shop") {
    alert("Only shop users can upload products.");
    return;
  }

    // Prepare form data for multipart upload
    const formData = new FormData();
    // Append each product field
    // Object.entries(product).forEach(([key, value]) => {
    //   formData.append(key, value);
    // });

    // Optionally, append userId if your backend expects it
    // formData.append("userId", userId);

    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price",product.price);
    formData.append("weight",product.weight);
    formData.append("category",product.category);
    formData.append("image", product.image);
    formData.append("userId", user.id); // send userId to backend to link product


    try {
      // const response = await axios.post("http://localhost:8080/api/product", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      setLoading(true);

     const res= await axios.post("http://localhost:8080/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product uploaded successfully!");
      // Reset form after success (optional)
      setProduct({
        name: "",
        description: "",
        price: "",
        weight: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error("Upload failed.",error);
      alert("Failed to upload product. Please try again");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
      {/* <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
       </button> */}
       <button type="submit">Upload Product</button>
    </form>
  );
}

export default ProductUpload;
