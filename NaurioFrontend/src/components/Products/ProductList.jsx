import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function ProductList () {
    const [products, setProducts] = useState([]);


    useEffect (() => {
        axios.get("http://localhost:8080/api.products")
        .then(res => setProducts(res.data))
        .catch(err => console.error("Error fetching products:", err));
    }, []);


    return (
       <div className="product-list">
      {products.map(prod => (
        <ProductCard key={prod.id} product={prod} />
      ))}
    </div>
    );

}

export default ProductList;