import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmOrderPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state || !Array.isArray(state.items) || state.items.length === 0) {
      navigate("/");
    }
  }, [state, navigate]);

  const { items = [], totalCost = 0 } = state || {};
  const product = items[0] || {};
  const quantity = product.quantity || 1;

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("⚠️ You must be logged in to place an order.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/orders/my-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity,
          totalPrice: totalCost,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unknown error");
      }

      alert("✅ Order placed successfully! Will deliver within 7 days.");
      navigate("/orders");
    } catch (error) {
      alert(`❌ Failed to place order: ${error.message}`);
      console.error("Order placement error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Confirm Your Order</h2>

      <div style={styles.card}>
        <img
          src={product.imageUrl || `/api/products/${product.id}/image`}
          alt={product.name || "Product"}
          width={180}
          style={styles.image}
          onError={(e) => (e.target.src = "/default-product.jpg")}
          loading="lazy"
        />
        <div style={styles.details}>
          <h3>{product.name}</h3>
          <p>Quantity: {quantity}</p>
          <p>Total Price: <strong>${totalCost.toFixed(2)}</strong></p>
        </div>
      </div>

      <button
        style={styles.button}
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Processing..." : "✅ Confirm Order"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "2rem",
    backgroundColor: "#f9f9f9",
  },
  image: {
    borderRadius: "6px",
    objectFit: "cover",
  },
  details: {
    textAlign: "left",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

export default ConfirmOrderPage;
