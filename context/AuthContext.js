import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  const login = (token) => {
    setAccessToken(token);
  };
  const logout = () => {
    setAccessToken(null);
  };
   
 

  return (
    <AuthContext.Provider value={{ accessToken,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
