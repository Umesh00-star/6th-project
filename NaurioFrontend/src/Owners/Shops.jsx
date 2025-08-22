import React, { useEffect, useState } from "react";
import { useShopAuth } from "../Authentication/ShopAuthLogic";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductUpload from "../components/Products/ProductUpload";

const Shops = () => {
  const { shop } = useShopAuth();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (!shop || shop.role !== "shop") {
      navigate("/shop/login"); // Redirect non-shop users
    } else {
      fetchMyProducts();
    }
  }, [shop]);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/products/shop/${shop.id}`);
      // setMyProducts(res.data);
      console.log("Fetched products:", res.data);

      // Set based on correct shape of response
      const products = Array.isArray(res.data) ? res.data : res.data.products || [];
      setMyProducts(products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Shop</h2>

      <ProductUpload /> {/* Only shop users will see this */}

      <h3>My Products</h3>
      {/* {myProducts.length === 0 ? ( */}
       {!Array.isArray(myProducts) || myProducts.length === 0 ? (
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
