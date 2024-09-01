import React from 'react';
import { Navigate } from 'react-router-dom';

// Cette fonction vérifie si l'utilisateur est authentifié
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  
  //const token1 = localStorage.getItem('user');

  // Vous pouvez également vérifier si le token est expiré ici
  return token !== null;
  //return !!localStorage.getItem('user');
};

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;