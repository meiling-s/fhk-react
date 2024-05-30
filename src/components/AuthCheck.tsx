import React, { ReactNode } from 'react';
import useAuthCheck from '../contexts/TokenContainer';

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  useAuthCheck();
  return <>{children}</>;
};

export default AuthCheck;
