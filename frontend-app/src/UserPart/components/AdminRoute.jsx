import React from 'react';
import { Navigate } from 'react-router-dom';

// Cette fonction vérifie si l'utilisateur est admin
const isAdmin = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const user = JSON.parse(atob(token.split('.')[1])); // Décoder le payload JWT
  return user && user.role === 'admin';
};

// Composant de protection des routes admin
const AdminRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/login" />;
};

export default AdminRoute;
