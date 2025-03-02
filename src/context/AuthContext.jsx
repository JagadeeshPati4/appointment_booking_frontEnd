import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {getUser} from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);


  // Fetch user details from backend using the token
  const fetchUserData = async (token) => {
    try {
      const response = await  getUser(token);
      console.log('response 0f user',response);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      logout();
    }
  };

  useEffect(() => {
    const token = Cookies.get('userToken');
    console.log('token-----------',token);
    if (token) {
      setToken(token);
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  const login = (token,userFetchDetails) => {
    const userDetails ={...userFetchDetails,'_id':userFetchDetails.id}
    console.log('token',token); 
    console.log('userDetails',userDetails);
    Cookies.set("userToken", token, { expires: 7 });
    setToken(token);
    setIsLoggedIn(true);
    setUser(userDetails);
  };

  const logout = () => {
    Cookies.remove('userToken');
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout,user }}>
      {children}
    </AuthContext.Provider>
  );
};