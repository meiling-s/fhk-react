import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { localStorgeKeyName } from '../constants/constant';

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem(localStorgeKeyName.keycloakToken);
      if (!token) {
        navigate('/');
      }
    };

    checkToken(); // Initial check when component mounts

    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, [navigate]);
};

export default useAuthCheck;
