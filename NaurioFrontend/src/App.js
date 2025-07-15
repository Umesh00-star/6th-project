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

// Shop owner components
import ProductUpload from './components/Products/ProductUpload';
import Shops from './Owners/Shops';
import EditProduct from './Owners/EditProduct';

// Shop home page for shop users (role based home page)
import ShopHome from './Owners/ShopHome'; 

// Auth hook to get user info
import { useAuth } from './Auths/AuthLogic';

function App() {
  const { user } = useAuth();

  return (
    <>
      <NavBar />
      <Routes>

        {/* Root route: Conditional rendering based on user role */}
        <Route
          path="/"
          element={
            user && user.role === "shop" ? (
               <ShopHome />          // Shop user sees shop dashboard
          ): (  
                  <>
                    {/* Non-shop user homepage content */}
                    <Hero />
                    <Categories />
                    <AgeFilter />
                    <NauriBot />
                    <ComingSoonSection />
                    <Footer />
                  </>
                )
              // : <Navigate to="/" /> // Redirect unauthenticated users to login
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

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
        <Route path="/product" element={<ProductUpload />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path='/cart' element={Cart}/>

        {/* Fallback route for unmatched paths (optional) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
