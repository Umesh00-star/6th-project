import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const[product, setProduct] = useState (null);

    useEffect(() => {
        axios.get (`https://localhost:8080/api/product/${id}`)
        .then (res => setProduct(res.data));
    }, [id]);

    const handleBuyNow = () => {
        const isLoggedIn = localStorage.getItem("token"); 
        if (!isLoggedIn) return navigate("/login");
        navigate("/delivery",{state:{product}});
    };

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItems("cart",JSON.stringify(cart));
        alert("added to cart");
    };

    if (!product) return <p> Loading...</p>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleBuyNow}>Buy Now</button>
        </div>
    );
}

export default ProductDetail;