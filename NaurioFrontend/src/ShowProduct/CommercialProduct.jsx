import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/Products/ProductCard";
// import { response } from "express";

const CommercialProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect (() => {
        // axios.get("http://localhost:8080/api/products/category/commercial")
        // .then(res => setProducts(res.data))
        // .catch(err => console.error(err));
        fetch("http://localhost:8080/api/product/category/commercial")
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                setProducts(data);
            }
            else {
                console.error('expected array but got data', data);
            }

        })
        .catch((error) => {
            console.error('error fetching product', error);
        });
    }, []);

     if (!Array.isArray(products)) {
    return <div>Loading...</div>;
     }
    return (

        <div className="category-page">
            <h2>Commercial & Official Products</h2>
        <div className="products-grid">
            {products.map((p) => (
            <ProductCard key={p.id} product={p}/>
        ))}
        </div>
        </div>
    );
};

export default CommercialProduct;