import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Authentication/AuthLogic";
import InfoModal from "../Confirmmodel/InfoModel"; 
import './ProductStyle/Products.css';



const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // state for the models
     const [infoOpen, setInfoOpen] = useState(false);
    const [infoMsg, setInfoMsg] = useState("");
    const [infoType, setInfoType] = useState("success");

      function showmsg(message, type = "success") {
        setInfoMsg(message);
        setInfoType(type);
        setInfoOpen(true);
    }

    function handleAddToCart() {
        if (user && user.role !== "shop") {
            // 🟢 LOGGED IN - Save to backend
            fetch(`http://localhost:8080/api/cart/add?userId=${user.id}&productId=${product.id}&quantity=1`, {
                method: "POST"
            })
                .then(res => res.text())
                .then (msg => {
                showmsg("Item added to cart successfully", "success");
                })
                 .catch((err) => {
                    console.error(err);
                    showmsg("Failed to add item. Try again.", "error");
                });
                
        } else {
            // 🔴 GUEST - Save to sessionStorage
            const existingCart = JSON.parse(sessionStorage.getItem("guestCart")) || [];
            const existingItemIndex = existingCart.findIndex(item => item.id === product.id);

            if (existingItemIndex !== -1) {
                existingCart[existingItemIndex].quantity += 1;
            } else {
                existingCart.push({ ...product, quantity: 1 });
            }

            sessionStorage.setItem("guestCart", JSON.stringify(existingCart));
           showmsg("Please login to save your cart", "warning");
        }
    }

    
    return (
        <div className="product-card">
        <Link to={`/product/${product.id}`} className="product-link">
        <div className="image-wrapper">
            <img
                src={product.imageUrl}
                alt={product.name}
                // style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                loading="lazy"
                onError={(e) => (e.target.src = "/default-product.jpg")}
            />
            </div>
            <h3 className="product-name">{product.name}</h3>
            {/* <p>{product.description}</p> */}
            <p className="price">Price:<strong>Rs.{product.price}</strong></p>
            {/* <p className="text-sm text-gray-500">Shop: {product.shopName}</p> */}
         </Link>
            <div className="product-actions">
                <button onClick={handleAddToCart}>+Add</button>
                {/* <button onClick={handleBuyNow}>Buy Now</button> */}
           
             {/* ✅ InfoModal */}
            <InfoModal
                isOpen={infoOpen}
                message={infoMsg}
                type={infoType}
                onClose={() => setInfoOpen(false)}
            />
             </div>
     </div>
    );
};

export default ProductCard;