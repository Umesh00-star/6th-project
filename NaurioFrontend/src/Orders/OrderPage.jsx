import React, { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus]= useState("Placed");
  const filteredOrders = orders.filter((order) => order.status === filterStatus);
  


  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

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

      if (res.status === 401) {
        setError("Session expired. Please log in again.");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch orders.");

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

            return { ...order, productImageUrl: ImageUrl };
          } catch {
            return { ...order, productImageUrl: "/placeholder.png" };
          }
        })
      );

      setOrders(ordersWithImages);
    } 
    catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds((prevIds) =>
      prevIds.includes(orderId)
        ? prevIds.filter((id) => id !== orderId)
        : [...prevIds, orderId]
    );
  };

  const handleCancel = async () => {
    if (selectedOrderIds.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel ${selectedOrderIds.length} order(s)?`
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      for (const orderId of selectedOrderIds) {
        const res = await fetch(
          `http://localhost:8080/api/orders/${orderId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const msg = await res.text();
          alert(`❌ Failed to cancel order ID ${orderId}: ${msg}`);
        }
      }

      setOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o.id)));
      setSelectedOrderIds([]);
      alert("✅ Selected order(s) cancelled.");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("⚠️ Error occurred while cancelling orders.");
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;


    // FIlter Logics

    const filteredOrdered = orders.filter((order) => order.status=== filterStatus);

    // filter buttons

    const statusOptions = [
      {value : "Placed", label: "Placed"},
      {value : "Completed", label: "Received "},
      {value : "Cancelled", label: "Cancelled/Return"},
    ];

    const visibleButtons = statusOptions.filter((s) => s.value !==filterStatus);

    if(loading ) return <p>Loading Orders...</p>;
     if (error) return <p style={{ color: "red" }}>{error}</p>;


  return (


  
  

 <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        {statusOptions.find((s) => s.value === filterStatus)?.label} Orders
      </h2>

      {/* Filter Buttons */}
      <div style={{ marginBottom: "1rem" }}>
        {visibleButtons.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p>No {filterStatus.toLowerCase()} orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.id}
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: "1.5rem",
              paddingBottom: "1rem",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {filterStatus === "Placed" && (
              <input
                type="checkbox"
                checked={selectedOrderIds.includes(order.id)}
                onChange={() => handleCheckboxChange(order.id)}
                style={{ marginRight: "1rem", marginTop: "0.5rem" }}
              />
            )}

            <img
              src={order.product.imageUrl}
              alt={order.product.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: "1rem",
                border: "1px solid #ccc",
              }}
            />

            <div>
              <h3 style={{ margin: 0 }}>{order.product.name}</h3>
              <p>Price:{order.price}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Total Price: ${order.totalPrice?.toFixed(2)}</p>
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

      {filterStatus === "Placed" && (
        <button
          onClick={handleCancel}
          disabled={selectedOrderIds.length === 0}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: selectedOrderIds.length ? "#dc3545" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: selectedOrderIds.length ? "pointer" : "not-allowed",
          }}
        >
          Cancel Selected {selectedOrderIds.length > 1 ? "Orders" : "Order"}
        </button>
      )}
    </div>
  );


};

export default OrdersPage;
