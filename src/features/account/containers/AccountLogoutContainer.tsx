import useAuth from '@hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const AccountLogoutContainer = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const executeLogout = async () => {
    if (isAuthenticated) {
      await logout();
    }
    navigate('/');
  };

  useEffect(() => {
    executeLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
