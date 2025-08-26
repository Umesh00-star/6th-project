import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../Authentication/AuthLogic";
import axios from "axios";
import './ProductStyle/ProductDetails.css';

function ProductDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const[product, setProduct] = useState (null);
    const [selectedImage, setSelectedImage] = useState("");
    const { user } = useAuth();


    useEffect(() => {
        axios.get (`http://localhost:8080/api/product/${id}`)
        .then (res => { setProduct(res.data);
        setSelectedImage(res.data.imageUrl);
    });
    }, [id]);
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
            // alert(" Please login to Add Product added to guest cart");
            alert("Please! Login First");
        }
    }

    const handleBuyNow = () => {
        navigate("/buy-now", { state: { product } });
    };

    if (!product) return <p> Loading...</p>;

    return (
        <div className="product-detail">
         <div className="product-image">
             <div className="main-image">
             <img
            src={selectedImage}
            alt={product.name}
            onError={(e) => (e.target.src = "/default-product.jpg")}
          />
        </div>
            
                
                {/* for thumnails */}

                <div className="thumbnail-list">
                    {[product.imageUrl, ...(product.extraImages || [])].map ( 
                        (img, idx) => (
                            <img 
                            key={idx}
                            src={img}
                          alt={`thumbnail-${idx}`}
                        className={`thumbnail ${selectedImage === img ? "selected" : ""}`}
                                onClick={()=> setSelectedImage(img)}
                                />
                        ))}
                </div>
                </div>
            

                  {/* in Right Column */}

             <div className="product-info">
            <h2>{product.name}</h2>
            <p className="description">{product.description}</p>

             {/* Price Sections */}

        <div className="price-section">
          <span className="price">Rs. {product.price}</span>
          {product.oldPrice && (
            <span className="old-price">Rs. {product.oldPrice}</span>
          )}
          {product.discount && (
            <span className="discount">-{product.discount}%</span>
          )}
        </div>

        {/* Delivery & Returns */}

        <div className="info-box">
          <p>
            <strong>Delivery:</strong> Cash on Delivery available
          </p>
          <p>
            <strong>Return:</strong> 14 Days Free Returns
          </p>
          <p>
            <strong>Warranty:</strong> Not Available
          </p>
        </div>

        {/* Buttons */}

        <div className="action-buttons">
          <button className="buy-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
          <button className="cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;