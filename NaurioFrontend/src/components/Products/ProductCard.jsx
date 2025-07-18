import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auths/AuthLogic";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    function handleAddToCart() {
        if (user && user.role !== "shop") {
            // 🟢 LOGGED IN - Save to backend
            fetch(`http://localhost:8080/api/cart/add?userId=${user.id}&productId=${product.id}&quantity=1`, {
                method: "POST"
            })
                .then(res => res.text())
                .then(msg => alert(msg))
                .catch(console.error);
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
            alert("Product added to guest cart");
        }
    }

    const handleBuyNow = () => {
        navigate("/buy-now", { state: { product } });
    };

    return (
        <div className="product-card">
            <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                onError={(e) => (e.target.src = "/default-product.jpg")}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>

            <div className="product-actions">
                <button onClick={handleAddToCart}>Add to Cart</button>
                <button onClick={handleBuyNow}>Buy Now</button>
            </div>

            <Link to={`/product/${product.id}`}>View</Link>
        </div>
    );
};

export default ProductCard;
