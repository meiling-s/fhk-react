import React, { createContext, useContext, useEffect, useState } from 'react';
import { localStorgeKeyName } from '../constants/constant';

const RoleContext = createContext({
  role: localStorage.getItem(localStorgeKeyName.role) || '',
  setRole: (role: string) => {},
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState(localStorage.getItem(localStorgeKeyName.role) || '');

  useEffect(() => {
    const handleStorageChange = () => {
      const storedRole = localStorage.getItem(localStorgeKeyName.role);
      setRole(storedRole || 'collector');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
