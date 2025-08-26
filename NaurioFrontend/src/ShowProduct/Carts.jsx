import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Authentication/AuthLogic";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/Confirmmodel/ConfirmModel" 
import InfoModal from "../components/Confirmmodel/InfoModel";
import "./ShowStyle/Carts.css";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
 
  const [showConfirm, setShowConfirm] = useState(false);
const [itemToRemove, setItemToRemove] = useState(null);

// fetched from info model
const [infoOpen, setInfoOpen] = useState(false);
const [infoMsg, setInfoMsg] = useState("");
const [infoType, setInfoType] = useState("success");


  const isLoggedIn = user && user.role !== "shop";

  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        try {
          const res = await axios.get(`http://localhost:8080/api/cart/${user.id}`);
          setCart(res.data);
          setSelectedItems(res.data.map((item) => item.id));
        } catch (err) {
          console.error("Error loading cart from DB:", err);
        }
      } else {
        const sessionCart = sessionStorage.getItem("guest_cart");
        const parsedCart = sessionCart ? JSON.parse(sessionCart) : [];
        setCart(parsedCart);
        setSelectedItems(parsedCart.map((item) => item.id));
      }
    };

    loadCart();
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!isLoggedIn) {
      sessionStorage.setItem("guest_cart", JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  const handleQuantityChange = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // const handleRemove = async (id) => {
  //   const confirmed = window.confirm("Are you sure you want to remove this item?");
  //   if (!confirmed) return;

  //   setCart((prev) => prev.filter((item) => item.id !== id));
  //   setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));


  const handleRemove = (id) => {
  setItemToRemove(id);
  setShowConfirm(true); // open modal
};

const confirmRemove = async () => {
  const id = itemToRemove;
  setCart((prev) => prev.filter((item) => item.id !== id));
  setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));



    if (isLoggedIn) {
      try {
        await axios.delete(`http://localhost:8080/api/cart/remove/${id}`);
      } catch (err) {
        console.error("Failed to remove item from DB cart:", err);
      }
    }

   setInfoMsg("Item removed from cart successfully.");
setInfoType("success");
setInfoOpen(true);
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    const itemsToOrder = cart.filter((item) => selectedItems.includes(item.id));

    if (itemsToOrder.length === 0) {
      alert("Please select at least one item to proceed to checkout.");
      return;
    }

    localStorage.setItem("checkout_items", JSON.stringify(itemsToOrder));
    navigate("/Checkout", { state: { items: itemsToOrder } });
  };

  const totalPrice = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-heading">Your Cart 🛒</h1>

      {/* {removeSuccess && (
        <div className="order-success-msg">{removeSuccess}</div>
      )} */}

      {cart.length === 0 ? (
        <div className="empty-cart">
          {/* <img src="/empty-cart.svg" alt="Empty cart" /> */}
          <p>You Don't Have Product In Your Cart.</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                  className="cart-checkbox"
                />

                <div className="cart-img-container">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                    className="cart-img"
                  />
                </div>

                <div className="cart-details">
                  <h2>{item.product.name}</h2>
                  <p>Price: Rs. {item.product.price.toFixed(2)}</p>
                  <div className="cart-qty-row">
                    <label>Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="qty-input"
                    />
                    <button onClick={() => handleRemove(item.id)} className="remove-btn">
                      ❌ Remove
                    </button>
                  </div>
                  <p className="sub-total">
                    Subtotal: Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <div className="total">Total (Selected): Rs. {totalPrice.toFixed(2)}</div>
            <button onClick={handleCheckout} className="checkout-btn">
              🛍️ Check-out
            </button>
          </div>
        </>
      )}
{/* 
      {orderSuccess && (
        <div className="order-success-msg">🎉 Order placed successfully!</div>
      )} */}
            <InfoModal
        isOpen={infoOpen}
        message={infoMsg}
        type={infoType}
        onClose={() => setInfoOpen(false)}
      />


            <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmRemove}
        message="Are you sure you want to remove this item from your cart?"
              />

 </div>
    
    
  );
  
};

export default Cart;
