import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('jogjoy_admin_session') === 'true';
  });
  
  // Store mock admin users to simulate real authentication in the session
  const [admins, setAdmins] = useState([
    { name: 'Super Admin', email: 'admin@jogandjoy.com', password: 'password123' }
  ]);

  const login = (email, password) => {
    // Check if the provided credentials match any registered admin
    const user = admins.find(a => a.email === email && a.password === password);
    if (user) {
      setIsAuthenticated(true);
      localStorage.setItem('jogjoy_admin_session', 'true');
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    // Ensure email isn't already registered
    if (admins.find(a => a.email === email)) {
      return false;
    }

    if (name && email && password) {
      // Add the new admin to the mock database for this session
      setAdmins([...admins, { name, email, password }]);
      setIsAuthenticated(true);
      localStorage.setItem('jogjoy_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('jogjoy_admin_session');
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
