import React from 'react';
import ReactDOM from 'react-dom/client';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './Auths/AuthLogic';
import { BrowserRouter } from 'react-router-dom';

fetch('http://localhost:8080/api/product')
.then(res =>res.json())
.then(data => console.log(data))
.catch(err => console.error(err));


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
// (<App />);
 <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

