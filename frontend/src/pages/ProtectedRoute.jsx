import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ requiredRole, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/helpdesk/auth-status",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Add a loader for better UX
  }

  if (!isAuthenticated) {
    return <Navigate to="/helpdesk/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/helpdesk/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
