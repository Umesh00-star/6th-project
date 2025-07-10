import React from 'react';
import {Route, Routes } from 'react-router-dom';

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

function App() {
  return (
    <>
      <NavBar />
        <Routes>
          <Route 
          path="/"
           element={
                <>

              <Hero />
              <Categories />
              <AgeFilter />
              <NauriBot />
              <ComingSoonSection  />
              <Footer />
      </>
              }
             />
       
     
          <Route path="/login" element={<Login />} />  {/* ✅ Route for Login */}
        </Routes>
    </>
  
  );

}

export default App;
