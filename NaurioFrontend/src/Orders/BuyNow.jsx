import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BuyNowPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  const [quantity, setQuantity] = useState(1);
  const deliveryCharge = 100;

  if (!product) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Product information is missing. Please go back and try again.</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      await axios.post("http://localhost:8080/api/orders/place", {
        productId: product.id,
        quantity,
        userId: product.user?.id, // Ensure you pass userId properly
      });

      const totalCost = (parseFloat(product.price) || 0) * quantity + deliveryCharge;

      navigate("/order-confirmation", {
        state: {
          items: [{ product, quantity }],
          totalCost,
        },
      });
    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong placing your order.");
    }
  };

  const totalCost = (parseFloat(product.price) || 0) * quantity + deliveryCharge;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Buy Now</h2>
      <img
        src={product.imageUrl}
        alt={product.name}
        width={150}
        height={150}
        style={{ objectFit: "cover", borderRadius: "8px" }}
        onError={(e) => (e.target.src = "/default-product.jpg")}
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Price: Rs. {parseFloat(product.price).toFixed(2)}</p>
      <label>
        Quantity:
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          style={{ width: "60px", marginLeft: "0.5rem" }}
        />
      </label>
      <p>Delivery: Rs. {deliveryCharge.toFixed(2)}</p>
      <hr />
      <p><strong>Total: Rs. {totalCost.toFixed(2)}</strong></p>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default BuyNowPage;
