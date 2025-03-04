import { JSX, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidToken } from './authUtils';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !isValidToken(token)) {
      navigate('/', { replace: true });
    }
  }, [navigate, token]);

  if (!token || !isValidToken(token)) {
    return null; // or loading spinner
  }

  return children;
};

export default ProtectedRoute;