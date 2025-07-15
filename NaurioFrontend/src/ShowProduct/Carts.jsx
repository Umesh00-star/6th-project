import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Auths/AuthLogic";

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const isLoggedIn = user && user.role !== "shop";

  // Load cart from localStorage or DB
  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`/api/cart/${user.id}`)
        .then(res => setCart(res.data))
        .catch(err => console.error("DB cart fetch failed", err));
    } else {
      const sessionCart = sessionStorage.getItem("guest_cart");
      setCart(sessionCart ? JSON.parse(sessionCart) : []);
    }
  }, [isLoggedIn, user]);

  // Save guest cart to sessionStorage on change
  useEffect(() => {
    if (!isLoggedIn) {
      sessionStorage.setItem("guest_cart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  // Quantity change
  const handleQuantityChange = (id, quantity) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Remove item
  const handleRemove = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    if (isLoggedIn) {
      axios.delete(`/api/cart/${user.id}/remove/${id}`).catch(console.error);
    }
  };

  // Place order
  const handlePlaceOrder = () => {
    if (isLoggedIn) {
      axios.post(`/api/order`, { userId: user.id, cart })
        .then(() => {
          setCart([]);
          setOrderSuccess(true);
          axios.delete(`/api/cart/${user.id}/clear`).catch(console.error); // optional clear
        })
        .catch(err => console.error("Order failed", err));
    } else {
      // Guest cart, just show success and clear sessionStorage
      sessionStorage.removeItem("guest_cart");
      setCart([]);
      setOrderSuccess(true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="border p-4 rounded-md shadow">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p>Price: ${item.price}</p>
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="ml-2 w-16 border px-1"
                />
              </label>
              <button
                onClick={() => handleRemove(item.id)}
                className="ml-4 text-red-600"
              >
                ❌ Remove
              </button>
            </div>
          ))}
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          >
            ✅ Place Order
          </button>
        </div>
      )}
      {orderSuccess && <h2 className="mt-6 text-green-700 font-bold text-xl">Order placed successfully!</h2>}
    </div>
  );
};

export default Cart;
