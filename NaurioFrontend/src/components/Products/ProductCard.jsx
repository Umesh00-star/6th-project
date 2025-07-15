import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product}) => (
    <div className="producct-card">
 <img src={product.imageUrl} alt={product.name} width={200}/>
 <h3>{product.name}</h3>
    <p>{product.description}</p>
    <p><strong>${product.price}</strong></p>

<Link to={`/product/${product.id}`}>View</Link>
</div>
);

export default ProductCard;