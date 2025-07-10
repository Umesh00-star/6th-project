import React, {useState} from "react";
import { loginUser, registerUser } from "../Auths/Auth";
import {useNavigate} from 'react-router-dom';
import '../img/logo.png'
 import './style.css';

 
//  import TruckAnimation from "../Truck/TruckAnimation";

const Login = () => {
       const [isLogin, setIsLogin] = useState(true);
      const [form, setForm] = useState({ name:'', email:'', password:''});
      const [error, setError] = useState('');
      const navigate = useNavigate();

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value});
   };

const [showPassword, setShowPassword] = useState(' ');

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');


      if (isLogin) {
         const res = await loginUser(form.email, form.password);
         if (res.success) {
            navigate('/'); // adjust login route post
             }
             else {
               setError(res.message);
             }
      }
      else {
         const res = await registerUser(form.name, form.email, form.password);
         if (res.success) {
            setIsLogin(true);
         }
         else {
            setError(res.message);
            }
      }

   };

   return (

      <div className ="auth-wrapper">
       

<div className="form-side">
    <form className = "form-side" onSubmit= {handleSubmit}>
    <h2>{isLogin ?'Login':'Sign up'} </h2>
    {!isLogin && (
        <input
        type="text"
        name= "name"
        placeholder="Name"
        className="input"
        value={form.name}
        onChange={handleChange}
        />
    )}


     <input
     type="email"
     name="email"
     placeholder="Email"
     className="input"
     value={form.email}
     onChange={handleChange}
     />

    {/* <input
        type="password"
        name="password"
        placeholder="Password"
        className="input"
        value={form.password}
        onChange={handleChange}
    /> */}

        <div className="password-wrapper">
            <input
          type={showPassword ? 'text': 'password'}
          name="password"
          placeholder="Password"
        className="input"
        value={form.password}
        onChange={handleChange}
          />
          <span
          className="toogle-password"
          onClick={() => setShowPassword(!showPassword)}
          style={{cursor:'pointer', marginLeft:'8px'}}
          >
            {showPassword?' Hide' : 'Show'}
          </span>
        </div>


    <button className="btn"> {isLogin ? 'Login': 'Register'} </button> 
    {error && <p style={{color:'red', marginTop:'10px'}}>{error}</p>}


        <p className="toogle-text">
            {isLogin ? (
                <>
                    Don't have an account? {'   ' }
                    <span className="toogle-link" onClick={() => setIsLogin(false)}>Sign up</span>
                </>
            ) : (
                <>
                Already have an account?{''}
                <span className="toggle-link" onClick={() => setIsLogin(true)}>Login</span>
                </>
            )}
        </p>
         </form>
      
</div>

             {/* <TruckAnimation/> */}

</div>
   );

    };

    export default Login;