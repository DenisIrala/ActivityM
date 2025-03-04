import { FC, useEffect, useState } from 'react';
import api from "../axiosConfig.ts";
import { clearAuth, isValidToken } from '../authUtils';
import { useNavigate } from 'react-router-dom';

const Home: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify token with backend
        const { data } = await api.get('/me');
        setUser(data);
        
      } catch (error) {
        handleLogout();
      }
    };

    if (!isValidToken(token)) {
      clearAuth();
      navigate('/', { replace: true });
    } else {
      checkAuth();
    }
  }, [navigate, token]);

  if (!user) return <div>Loading...</div>;

  const handleLogout = () => {
    clearAuth();
    navigate('/', { replace: true });
  };

  return <h1>Home Page</h1>;
};

export default Home;
