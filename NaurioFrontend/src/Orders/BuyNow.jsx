import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BuyNowPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const product = state?.product || null;

  const cartItems =
    state?.items ||
    (() => {
      try {
        const parsed = JSON.parse(localStorage.getItem("checkout_items"));
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

  const deliveryCharge = 100;
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    if (!product && cartItems.length > 0) {
      setQuantities(cartItems.map(() => 1));
    }
  }, [product, cartItems]);

  const handleQuantityChange = (index, value) => {
    const updated = [...quantities];
    updated[index] = Math.max(1, parseInt(value) || 1);
    setQuantities(updated);
  };

  const handlePlaceOrder = () => {
    if (product) {
      const totalCost = product.price * buyNowQuantity + deliveryCharge;
      navigate("/confirm-order", {
        state: {
          items: [{ ...product, quantity: buyNowQuantity }],
          totalCost,
        },
      });
    } else {
      const itemsWithQuantities = cartItems.map((item, i) => ({
        ...item,
        quantity: quantities[i] || 1,
        price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
      }));

      const subtotal = itemsWithQuantities.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const totalCost = subtotal + deliveryCharge;

      navigate("/confirm-order", {
        state: {
          items: itemsWithQuantities,
          totalCost,
        },
      });
    }
  };

  const renderProductImage = (url, name, size = 150) => (
    <img
      src={url}
      width={size}
      height={size}
      alt={name}
      onError={(e) => (e.target.src = "/default-product.jpg")}
      style={{ objectFit: "cover", borderRadius: "8px" }}
    />
  );

  if (product) {
    const totalCost = product.price * buyNowQuantity + deliveryCharge;
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Buy Now</h2>
        {renderProductImage(product.imageUrl, product.name)}
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: ${product.price?.toFixed(2)}</p>
        <label>
          Quantity:
          <input
            type="number"
            min={1}
            value={buyNowQuantity}
            onChange={(e) =>
              setBuyNowQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            style={{ width: "60px", marginLeft: "0.5rem" }}
          />
        </label>
        <p>Delivery: ${deliveryCharge.toFixed(2)}</p>
        <hr />
        <p>
          <strong>Total: ${totalCost.toFixed(2)}</strong>
        </p>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    );
  }

  if (cartItems.length > 0) {
    const subtotal = cartItems.reduce((sum, item, i) => {
      const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
      const quantity = quantities[i] || 1;
      return sum + price * quantity;
    }, 0);
    const totalCost = subtotal + deliveryCharge;

    return (
      <div style={{ padding: "2rem" }}>
        <h2>Cart Checkout</h2>
        {cartItems.map((item, i) => {
          const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;

          return (
            <div
              key={item.id || i}
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
                marginBottom: "1rem",
              }}
            >
              {renderProductImage(item.imageUrl, item.name, 100)}
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ${price.toFixed(2)}</p>
              <label>
                Quantity:
                <input
                  type="number"
                  min={1}
                  value={quantities[i] || 1}
                  onChange={(e) => handleQuantityChange(i, e.target.value)}
                  style={{ width: "60px", marginLeft: "0.5rem" }}
                />
              </label>
            </div>
          );
        })}
        <p>Delivery: ${deliveryCharge.toFixed(2)}</p>
        <hr />
        <p>
          <strong>Total: ${totalCost.toFixed(2)}</strong>
        </p>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <p>No product(s) selected.</p>
    </div>
  );
};

export default BuyNowPage;
