import React from 'react';
import ReactDOM from 'react-dom/client';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ShopApp from './ShopApp';
import { AuthProvider } from './Authentication/AuthLogic';
import {ShopAuthProvider} from './Authentication/ShopAuthLogic';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


fetch('http://localhost:8080/api/product')
.then(res =>res.json())
.then(data => console.log(data))
.catch(err => console.error(err));


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
// // (<App />);
//  <BrowserRouter>
//     <AuthProvider>
//     <ShopAuthProvider>
//       <App />
//       </ShopAuthProvider>
//     </AuthProvider>
//   </BrowserRouter>

// );


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User App with User Auth */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <App />
            </AuthProvider>
          }
        />

        {/* Shop App with Shop Auth */}
        <Route
          path="/shop/*"
          element={
            <ShopAuthProvider>
              <ShopApp />
            </ShopAuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  // </React.StrictMode>
);

