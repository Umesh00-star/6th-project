import React, { useEffect, useState } from "react";
import ProductCard from "../components/Products/ProductCard";

const PrintDemand = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/product/category/print-demand')
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Expected array but got:", data);
                }
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    if (!Array.isArray(products)) {
        return <div>Loading...</div>;
    }

    return (
        <div className="category-page">
            <h2>Print on Demand Products</h2>
            <div className="products-grid">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
};

export default PrintDemand;
