

import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const host = process.env.REACT_APP_API_HOST;

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const authToken = localStorage.getItem('authtoken')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${host}/api/v1/users/get_user_info`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });


        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (<div className='mt-10'>

    {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
  </div>

  )
};

export default PrivateRoutes;
