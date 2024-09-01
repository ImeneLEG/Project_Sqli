import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/adminService';
import UserManagement from './UserManagement';
import VideoStatistics from './VideoStatistics';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Récupérer les détails de l'utilisateur courant
    getCurrentUser().then(user => setCurrentUser(user));
  }, []);

  if (!currentUser) return <p>Chargement...</p>;

  return (
    <div className="admin-dashboard">
      <h1>Bienvenue, {currentUser.name}</h1>
      <UserManagement />
      <VideoStatistics />
    </div>
  );
};

export default AdminDashboard;
