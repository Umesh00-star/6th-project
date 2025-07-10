import axios from 'axios';
const API_BASE ="http://localhost:8080/api/auth";


// login requests

export const loginUser = async (email, password) =>
{
    try{

        const res  = await axios.post('http://localhost:8080/api/auth/login',{email, password});
    localStorage.setItem('token', res.data.token);
    return{ success: true, data: res.data};
    }
    catch (err) {
        return { success: false, message: err.response?.data?.message || 'login failed'};
    }
};


// register request

    export const registerUser = async (name, email, password) =>
{
    try{

    const res  = await axios.post('http://localhost:8080/api/auth/register',{fullName:name, email, password});
    localStorage.setItem('token', res.data.token);
    return{ success: true, data: res.data};
    }
    catch (err) {
        return { success: false, message: err.response?.data?.message || 'Signup failed'};
    }
};



// logout session

export const logout = ()=> {
    localStorage.removeItem('token');
};


// check if logged in 

export const isloggedIn = () => {
    return !! localStorage.getItem('token');
};