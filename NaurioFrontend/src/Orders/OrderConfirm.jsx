import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DELIVERY_CHARGE = 100;

const OrderItem = ({ item }) => {
  const [imgSrc, setImgSrc] = useState(
    item.product?.imageUrl || `/api/product/${item.product?.id}/image`
  );
  const quantity = item.quantity || 1;
  const price = typeof item.product?.price === "number" ? item.product.price : parseFloat(item.product?.price) || 0;
  const itemTotal = price * quantity;

  return (
    <div style={styles.card}>
      <img
        src={imgSrc}
        alt={item.product?.name || "Product"}
        width={180}
        style={styles.image}
        onError={() => setImgSrc("/default-product.jpg")}
        loading="lazy"
      />
      <div style={styles.details}>
        <h3>{item.product?.name}</h3>
        <p>Quantity: {quantity}</p>
        <p>Price per item: ${price.toFixed(2)}</p>
        <p><strong>Item Total: ${itemTotal.toFixed(2)}</strong></p>
      </div>
    </div>
  );
};

const ConfirmOrderPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state || !Array.isArray(state.items) || state.items.length === 0) {
      navigate("/");
    }
  }, [state, navigate]);

  const { items = [] } = state || {};

  // Calculate subtotal here by summing up price * quantity for all items
  const subtotal = items.reduce((sum, item) => {
    const price = typeof item.product?.price === "number"
      ? item.product.price
      : parseFloat(item.product?.price) || 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  const finalTotal = subtotal + DELIVERY_CHARGE;

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("⚠️ You must be logged in to place an order.");
      return;
    }

    setLoading(true);
    try {
      const response = await 
      // fetch("http://localhost:8080/api/orders", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userId: user.id,
      //     items: items.map(({ product, quantity }) => ({
      //       productId: product.id,
      //       quantity,
      //       price: product.price,
      //     })),
      //     totalPrice: finalTotal,
      //   }),
      // });
      fetch("http://localhost:8080/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: user.id,
    products: items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
      totalPrice: product.price * quantity,
    }))
  })
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

      {items.map((item) => (
        <OrderItem key={item.id || item.product?.id} item={item} />
      ))}

      <div style={styles.summary}>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Delivery Charges: ${DELIVERY_CHARGE.toFixed(2)}</p>
        <h3>Final Total: ${finalTotal.toFixed(2)}</h3>
      </div>

      <button style={styles.button} onClick={handleConfirm} disabled={loading}>
        {loading ? "Processing..." : "✅ Confirm Order"}
      </button>
    </div>
  );
};


const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
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
    maxHeight: "140px",
  },
  details: {
    textAlign: "left",
  },
  summary: {
    marginTop: "2rem",
    textAlign: "left",
    borderTop: "1px solid #ccc",
    paddingTop: "1rem",
    fontSize: "1.1rem",
    lineHeight: "1.8rem",
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
    marginTop: "1.5rem",
  },
};

export default ConfirmOrderPage;
