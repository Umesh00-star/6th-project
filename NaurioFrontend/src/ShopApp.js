import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import ShopNavBar from "./components/NavBar/ShopNavBar";
import Settings from "./components/Profiles/Settings";
import UpdateProfile from "./components/Profiles/UpdateProfile";
import ProductUpload from "./components/Products/ProductUpload";
import Shops from "./Owners/Shops";
import EditProduct from "./Owners/EditProduct";
import ShopHome from "./Owners/ShopHome";
import { useShopAuth } from "./Auths/ShopAuthLogic";
import ShopLogins from "./Shops/ShopLogins";
import Contact from "./components/Contactus/Contact";
import Bot from "./components/NauriBot/Bot";

// ✅ ProtectedRoute component
function ProtectedShopRoute({ children }) {
  const { shop, loading } = useShopAuth();

  if (loading) {
    return <div>Loading...</div>; // ⏳ Wait for auth check to finish
  }

  if (!shop || shop.role !== "shop") {
    return <Navigate to="/shop/login" replace />;
  }

  return children;
}

function ShopApp() {
  const { shop } = useShopAuth();
  const isShop = shop && shop.role === "shop";

  return (
    <>
      {/* Show navbar only for authenticated shop users */}
      {isShop && <ShopNavBar />}

      <Routes>
        {/* Public route: Login */}
        <Route
          path="login"
          element={isShop ? <Navigate to="/shop" replace /> : <ShopLogins />}
        />

        {/* Protected routes */}
        <Route
          path=""
          element={
            <ProtectedShopRoute>
              <ShopHome />
            </ProtectedShopRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedShopRoute>
              <Settings />
            </ProtectedShopRoute>
          }
        />
        <Route
          path="update-profile"
          element={
            <ProtectedShopRoute>
              <UpdateProfile />
            </ProtectedShopRoute>
          }
        />
        <Route
          path="upload"
          element={
            <ProtectedShopRoute>
              <ProductUpload />
            </ProtectedShopRoute>
          }
        />
        <Route
          path="manage"
          element={
            <ProtectedShopRoute>
              <Shops />
            </ProtectedShopRoute>
          }
        />
        <Route
          path="edit-product/:id"
          element={
            <ProtectedShopRoute>
              <EditProduct />
            </ProtectedShopRoute>
          }
        />
        <Route
          path="contact"
          element={
            <ProtectedShopRoute>
              <Contact />
            </ProtectedShopRoute>
          }
        />
        <Route
          path="bot"
          element={
            <ProtectedShopRoute>
              <Bot />
            </ProtectedShopRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </>
  );
}

export default ShopApp;
