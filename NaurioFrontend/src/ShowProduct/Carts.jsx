import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Auths/AuthLogic";
import { useNavigate } from "react-router-dom";
import './ShowStyle/Carts.css';


const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const isLoggedIn = user && user.role !== "shop";

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        try {
          const res = await axios.get(`http://localhost:8080/api/cart/${user.id}`);
          setCart(res.data);
          setSelectedItems(res.data.map(item => item.id));
        } catch (err) {
          console.error("Error loading cart from DB:", err);
        }
      } else {
        const sessionCart = sessionStorage.getItem("guest_cart");
        const parsedCart = sessionCart ? JSON.parse(sessionCart) : [];
        setCart(parsedCart);
        setSelectedItems(parsedCart.map(item => item.id));
      }
    };

    loadCart();
  }, [isLoggedIn, user]);

  // Persist guest cart
  useEffect(() => {
    if (!isLoggedIn) {
      sessionStorage.setItem("guest_cart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  const handleQuantityChange = (id, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemove = async (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));

    if (isLoggedIn) {
      try {
        await axios.delete(`http://localhost:8080/api/cart/remove/${id}`);
      } catch (err) {
        console.error("Failed to remove item from DB cart:", err);
      }
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleCheckout = () => {
    const itemsToOrder = cart.filter(item => selectedItems.includes(item.id));

    if (itemsToOrder.length === 0) {
      alert("Please select at least one item to proceed to checkout.");
      return;
    }

    localStorage.setItem("checkout_items", JSON.stringify(itemsToOrder));
    navigate("/Checkout", { state: { items: itemsToOrder } });
  };

  const totalPrice = cart
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600">
          <img src="/empty-cart.svg" alt="Empty cart" className="w-40 mx-auto mb-4" />
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="cart-item flex gap-4 border p-4 rounded-md shadow items-center ml-5"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                  className="form-checkbox w-5 h-5 mt-1 accent-green-600"
                />

                <div className="w-[100px] h-[100px] flex items-center justify-center overflow-hidden border bg-gray-100">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    // className="w-[150px] h-[150px] object-contain"
                    style={{ width: "150px", height: "150px", objectFit: "contain" }}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{item.product.name}</h2>
                    <p className="text-sm text-gray-600">{item.product.description}</p>
                    <p className="text-md font-medium mt-1 text-pink-700">
                      Price: ${item.product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <label className="text-sm">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="w-16 border px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="text-center mt-6 text-lg font-semibold">
            Total (Selected): ${totalPrice.toFixed(2)}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-all mt-4 block ml-auto"
          >
            🛍️ Check-out
          </button>
        </>
      )}

      {/* Order success message */}
      {orderSuccess && (
        <div className="mt-6 text-green-700 font-bold text-xl text-center">
          🎉 Order placed successfully!
        </div>
      )}
    </div>
  );
};

export default Cart;
