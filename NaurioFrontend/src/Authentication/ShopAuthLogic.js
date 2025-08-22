  import React, { createContext, useContext, useState, useEffect } from "react";
  import { isloggedIn, logout as clearSession, getShopProfile} from "./ShopAuth"; // Import logout to clear backend sessions if needed
  // import {useShopAuth} from "./ShopAuth";
  // Create a React Context for authentication
  const AuthContext = createContext();


  //  AuthProvider Component

  export const ShopAuthProvider = ({ children }) => {
    const [shop, setShop] = useState(null); // Stores logged-in shop data
      const [loading, setLoading] = useState(true); // ✅ Add loading state


    // 🔁 Run once on initial mount to load session from localStorage
  useEffect(() => {
    const storedShop = localStorage.getItem("shop");
    const storedToken= localStorage.getItem("shop_token");
    if (storedShop && storedToken) {
      try {
        const parsedShop = JSON.parse(storedShop);

        getShopProfile(parsedShop.id , storedToken)
          .then(res => {
          if (res.success) {
            setShop(res.data);
            localStorage.setItem("shop", JSON.stringify(res.data));
          } else
            //  {
            if (res.status === 401 || res.status === 403) {
              // Only logout on real auth errors
              logout();
              // setShop(null);
          //   } else {
          //     // Keep old shop data if it's a temporary error
          //     setShop(parsedShop);
          //   }
          }
          // setLoading(false);
        }).catch(() => {
          // Keep shop data if network error
          console.warn("Network error: keeping stored shop data")
          // setShop(parsedShop);
          // setLoading(false);
        })
         .finally(() => setLoading(false));

      } catch (err) {
        console.error("Invalid shop format", err);
        logout();
        setShop(null);
        setLoading(false);
      }
    } else {
      setShop(null);
      setLoading(false);
    }
  }, []);



    // ✅ Called after successful login
    const shoplogin = (shopData, token) => {

      // load true to prevent redirect for signin
      // setLoading(true);


      // Save user and token to localStorage
      localStorage.setItem("shop", JSON.stringify(shopData));
      localStorage.setItem("shop_token", token);

      // Update state so components re-render
      setShop(shopData);

        // Done setting auth state
    setLoading(false);
    
    };

    // 🚪 Called when user logs out
    const logout = () => {
      localStorage.removeItem("shop");
      localStorage.removeItem("shop_token");

      clearSession(); // Optional: backend session clearing
      setShop(null);
    };

    // 🔄 Called after updating user profile
    const updateShop = (updatedShop) => {
      localStorage.setItem("shop", JSON.stringify(updatedShop));
      setShop(updatedShop);
    };

    //  const updateUser = (newUser) => {
    //   setUser(newUser);
    //   localStorage.setItem("user", JSON.stringify(newUser)); // persist on update
    // };

  const deleteShop = async (shopId) => {
    try {
      const token = localStorage.getItem("shop_token");

      // Call backend to delete user
      const res = await fetch(`http://localhost:8080/api/shop/${shopId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (!res.ok) 
        // {
        throw new Error("Failed to delete shop");
      
       } catch (err) {
      throw err;
    }
  };

      // Clear local storage and state
  //     localStorage.removeItem("shop");
  //     localStorage.removeItem("shop_token");
  //     setShop(null);
  //   } catch (err) {
  //     throw err; // Let UI handle the error
  //   }
  // };


    return (
      // Provide auth-related data and functions to all children components
      <AuthContext.Provider value={{ shop, shoplogin, logout, updateShop, deleteShop, loading }}>
        {children}
      </AuthContext.Provider>
    );


  };


  //  useAuth Hook (access context easily)

  export const useShopAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
      throw new Error("useShopAuth must be used within an ShopAuthProvider");
    }

    return context;
  };
