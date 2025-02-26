import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token,userDetails) => {
    console.log('token',token); 
    console.log('userDetails',userDetails);
    Cookies.set("token", token, { expires: 7 });
    setToken(token);
    setIsLoggedIn(true);
    setUser(userDetails);
  };

  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setIsLoggedIn(false);
    user(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout,user }}>
      {children}
    </AuthContext.Provider>
  );
};