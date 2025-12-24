import React, { createContext, useContext } from 'react';
import authHook from '../features/auth/hook/useAuth';

// Create the AuthContext
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const auth = authHook();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    };
  }
  return context;
};

export default AuthContext; 