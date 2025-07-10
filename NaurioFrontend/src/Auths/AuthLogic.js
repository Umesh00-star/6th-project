import React, {createContext, useContext, useState, useEffect, Children} from "react";
import {isloggedIn, logout as clearSession} from'./Auth';


const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
    const [user, setUser] =  useState(null);

useEffect(() => { 
    if(isloggedIn()) {
        //  fetch user info or decode this code
        const storedUser = JSON.parse(localStorage.getItem('user')) || {name:'User'};
        setUser(storedUser);
    }
},[]);

const login = (userData )=> {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
};

const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    clearSession();
};

return (
    <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
);
};

export const useAuth = () => {
const Context = useContext(AuthContext);
if(!Context) {
     throw new Error ('auth mustbe with in auth provider');
}
    return Context;

} ;

