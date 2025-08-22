import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Hero from './components/Hero';
import Categories from './components/Categories/Categories';
import AgeFilter from './components/AgeFilter/AgeFilter';
import ComingSoonBanner from './components/ComingSoonBanner';
import NauriBot from './components/NauriBot/NauriBot';
import ComingSoonSection from './components/ComingSoonSection';
import Footer from './components/Footer/Footer';
import AboutUs from './components/AboutUs/AboutUs';

import NavBar from './components/NavBar/NavBar';
import Login from './login/Login';
import Settings from './components/Profiles/Settings';
import UpdateProfile from './components/Profiles/UpdateProfile';

// Product display pages
import TechProduct from './ShowProduct/TechProduct';
import KitchenProduct from './ShowProduct/KitchenProduct';
import CommercialProduct from './ShowProduct/CommercialProduct';
import PrintDemand from './ShowProduct/PrintDemand';
import Cart from './ShowProduct/Carts';
import ProductDetail from './components/Products/ProductDetail';

// Shop owner components
import ProductUpload from './components/Products/ProductUpload';
import Shops from './Owners/Shops';
import EditProduct from './Owners/EditProduct';

// Shop home page for shop users (role based home page)
import ShopHome from './Owners/ShopHome'; 

// Auth hook to get user info
import { useAuth } from './Authentication/AuthLogic';
import { useShopAuth } from './Authentication/ShopAuthLogic';

// orders related
import BuyNowPage from './Orders/BuyNow';
import OrderConfirmation from './Orders/OrderConfirm';
import OrdersPage from './Orders/OrderPage';
import Shopnow from './ShowProduct/Shopnow';
import Contact from './components/Contactus/Contact';
import Bot from './components/NauriBot/Bot';
import CheckoutPage from './ShowProduct/CheckOut';
// import Logins from './Shops/Logins';
// import Admin from './Admin/Login/Login';


function App() {
  const { user } = useAuth();
// const {shop} = useShopAuth();
  return (
    <>
      <NavBar />
      <Routes>

        {/* Root route: Conditional rendering based on user role */}
        <Route
          path="/"
          element={
          //   user && user.role === "user" ? (
          //      <ShopHome />          // Shop user sees shop dashboard
          // ): (  
                  <>
                    {/* Non-shop user homepage content */}
                    <Hero />
                    <Categories />
                    <AgeFilter />
                    <NauriBot />
                    <ComingSoonSection />
                    <Footer />
                  </>
                // )
              // : <Navigate to="/" /> // Redirect unauthenticated users to login
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        {/* <Route Path="/shop/login" element={<Logins />} /> */}
        {/* <Route Path="/admin" element={<Admin/>}/> */}

        {/* Profile routes */}
        <Route path="/Settings" element={<Settings />} />
        <Route path="/UpdateProfile" element={<UpdateProfile />} />

        {/* Product categories */}
        <Route path="/Categories" element={<Categories />} />
        <Route path="/AgeFilter" element={<AgeFilter />} />
        <Route path="/Tech" element={<TechProduct />} />
        <Route path="/commercial" element={<CommercialProduct />} />
        <Route path="/Kitchen" element={<KitchenProduct />} />
        <Route path="/print" element={<PrintDemand />} />

        {/* Shop owner routes */}
        {/* <Route path="/product" element={<ProductUpload />} />
        {/* <Route path="/shops" element={<Shops />} /> 
        {/* <Route path="/edit-product/:id" element={<EditProduct />} /> */} 
        <Route path='/cart' element={<Cart/>}/>
        <Route path="/shop" element={<Shops />} />

        {/* Fallback route for unmatched paths (optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />

         {/* Orders related */}
          <Route path="/buy-now" element={<BuyNowPage />} />
          <Route path="/Checkout" element={<CheckoutPage />} />
        {/* <Route path="/confirm-order" element={<OrderConfirmation />} /> */}
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/shop-now" element={<Shopnow/>}></Route>
           <Route path="/contact" element={<Contact/>}></Route>
           <Route path="/Bot" element={<Bot/>}></Route>
           <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );


}
export default App;



