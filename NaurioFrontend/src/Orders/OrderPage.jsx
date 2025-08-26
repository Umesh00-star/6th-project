import React, { useEffect, useState } from "react";
import './OrdersUI/OrderPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("Placed");
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState({type: "", text: ""})

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    if (!token) {
      setError("You must be logged in to view orders.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      const ordersWithImages = await Promise.all(
        data.map(async (order) => {
          try {
            const imgRes = await fetch(
              `http://localhost:8080/api/product/${order.product.id}/images`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (!imgRes.ok) throw new Error("Image fetch failed");

            const blob = await imgRes.blob();
            const imageUrl = URL.createObjectURL(blob);

            return { ...order, productImageUrl: imageUrl };
          } catch {
            return { ...order, productImageUrl: "/placeholder.png" };
          }
        })
      );

      setOrders(ordersWithImages);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) => order.status === filterStatus
  );

  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((order) => order.orderId));
    }
  };

  const handleCancel = async () => {
    if (selectedOrderIds.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel ${selectedOrderIds.length} order(s)?`
    );
    if (!confirmed) return;

    try {
      setCancelling(true);

      const res = await fetch(`http://localhost:8080/api/orders/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedOrderIds),
      });

      if (!res.ok) {
        // const msg = await res.text();
        setMessage({ type: "error", text: "❌ Failed to cancel orders." });
         setTimeout(() => setMessage({ type: "", text: "" }), 4000);
        return;
      }

      await fetchOrders();
      setSelectedOrderIds([]);
      setMessage({ type: "success", text: "✅ Orders cancelled successfully." });
       setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Cancel error:", err);
     setMessage({ type: "error", text: "⚠️ Error occurred while cancelling orders." });
     setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } finally {
      setCancelling(false);
    }
  };

  const statusOptions = [
    { value: "Placed", label: "Placed" },
    { value: "Delivered", label: "Received" },
    { value: "Cancelled", label: "Cancelled / Returned" },
  ];

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-heading">
        {statusOptions.find((s) => s.value === filterStatus)?.label} Orders
      </h2>

      <div className="filter-buttons">
        {statusOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              setFilterStatus(value);
              setSelectedOrderIds([]);
            }}
            className={`filter-btn ${value.toLowerCase()} ${
              filterStatus === value ? "active" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filterStatus === "Placed" && filteredOrders.length > 0 && (
        <div className="select-all">
          <label>
            <input
              type="checkbox"
              checked={
                selectedOrderIds.length === filteredOrders.length &&
                filteredOrders.length > 0
              }
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <p>No Orders Has Been {filterStatus.toLowerCase()}.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.orderId} className="order-card">
            {filterStatus === "Placed" && (
              <input
                type="checkbox"
                checked={selectedOrderIds.includes(order.orderId)}
                onChange={() => handleCheckboxChange(order.orderId)}
                className="order-checkbox"
              />
            )}

            <img
              src={order.product.imageUrl}
              alt={order.product.name}
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
              className="order-image"
            />

            <div>
              <h3>{order.product.name}</h3>
              <p>Quantity: {order.quantity}</p>
              <p>Price: Rs. {order.price}</p>
              <p>Total: Rs. {order.totalPrice?.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <p>
                Order Date:{" "}
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ))
      )}

      {filterStatus === "Placed" && filteredOrders.length > 0 && (
        <>
        <button
          onClick={handleCancel}
          disabled={selectedOrderIds.length === 0 || cancelling}
          className={`cancel-btn ${
            selectedOrderIds.length && !cancelling ? "active" : ""
          }`}
        >
          {cancelling
            ? "Cancelling..."
            : `Cancel Selected ${
                selectedOrderIds.length > 1 ? "Orders" : "Order"
              }`}
        </button>
        
            {message.text && (
              <div className={`notification ${message.type}`}>
                {message.text}
              </div>
            )}
          </>

      )}
      
      
    </div>
  );
};

export default OrdersPage;
