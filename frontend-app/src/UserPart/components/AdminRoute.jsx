import React from 'react';
import { Navigate } from 'react-router-dom';

// Exemple de fonction pour vérifier si l'utilisateur est administrateur
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role === 'admin'; // Suppose que le rôle de l'utilisateur est stocké sous forme d'objet
};

const AdminRoute = ({ children }) => {
  if (!isAdmin()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
