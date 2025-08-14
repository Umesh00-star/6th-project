import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './ShowStyle/Carts.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutItems, setCheckoutItems] = useState([]);

  const DELIVERY_CHARGES = 100; // Fixed delivery charge for now

  useEffect(() => {
    const localItems = localStorage.getItem("checkout_items");
    const itemsFromState = location.state?.items || [];
    if (itemsFromState.length > 0) {
      setCheckoutItems(itemsFromState);
      localStorage.setItem("checkout_items", JSON.stringify(itemsFromState));
    } else if (localItems) {
      setCheckoutItems(JSON.parse(localItems));
    }
  }, [location.state]);

  const handleQuantityChange = (id, quantity) => {
    setCheckoutItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) return;

    try {
      await Promise.all(
        checkoutItems.map(item =>
          axios.post("http://localhost:8080/api/orders/place", {
            productId: item.product.id,
            quantity: item.quantity,
            userId: item.user?.id,
          })
        )
      );

      localStorage.removeItem("checkout_items");
      navigate("/order-confirmation", { state: { items: checkoutItems } });
    } catch (err) {
      console.error("Order placement failed", err);
      alert("Something went wrong placing your order. Please try again.");
    }
  };

  const productSubtotal = checkoutItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const totalWithDelivery = productSubtotal + DELIVERY_CHARGES;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧾 Checkout</h1>

      {checkoutItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <img src="/empty-cart.svg" alt="No items" className="w-40 mx-auto mb-4" />
          <p>No items to checkout.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {checkoutItems.map((item) => (
              <div
                key={item.id}
                className="cart-item flex gap-4 border p-4 rounded-md shadow items-center ml-5"
              >
                <div className="w-[100px] h-[100px] flex items-center justify-center overflow-hidden border bg-gray-100">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{ width: "150px", height: "150px", objectFit: "contain" }}
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-gray-600">{item.product.description}</p>
                  <p className="text-md font-medium mt-1 text-pink-700">
                    Price: ${item.product.price.toFixed(2)}
                  </p>

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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown Summary */}
          <div className="text-right mt-6 space-y-2 mr-5">
            <p className="text-md">
              Subtotal: <span className="font-medium">${productSubtotal.toFixed(2)}</span>
            </p>
            <p className="text-md">
              Delivery Charges: <span className="font-medium">${DELIVERY_CHARGES.toFixed(2)}</span>
            </p>
            <p className="text-lg font-bold">
              Total: <span className="text-blue-700">${totalWithDelivery.toFixed(2)}</span>
            </p>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all mt-4 block ml-auto"
          >
            ✅ Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
