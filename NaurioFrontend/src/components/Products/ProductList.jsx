import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import InfoModal from "../Confirmmodel/InfoModel";



function ProductList () {
    const [products, setProducts] = useState([]);
    
  // state for the models
     const [infoOpen, setInfoOpen] = useState(false);
    const [infoMsg, setInfoMsg] = useState("");
    const [infoType, setInfoType] = useState("success");

       const showMessage = (msg, type = "success") => {
        console.log("showMessage called:", msg, type); // 🔍 test log
        setInfoMsg(msg);
        setInfoType(type);
        setInfoOpen(true);
       };



    useEffect (() => {
        axios.get("http://localhost:8080/api/products")
        .then(res => setProducts(res.data))
        .catch(err => console.error("Error fetching products:", err));
    }, []);


    return (
       <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id}
         product={product}
          showMessage={showMessage}
           />

      ))}
       {/* ✅ InfoModal */}
            <InfoModal
                isOpen={infoOpen}
                message={infoMsg}
                type={infoType}
                onClose={() => setInfoOpen(false)}
            />
    </div>
    );

}

export default ProductList;