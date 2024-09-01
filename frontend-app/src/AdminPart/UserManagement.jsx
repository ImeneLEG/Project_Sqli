import React, { useEffect, useState } from 'react';
import { fetchAllUsers, registerUser, updateUser, deleteUser } from '../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    // Récupérer tous les utilisateurs
    fetchAllUsers().then(users => setUsers(users));
  }, []);

  const handleRegister = () => {
    registerUser(newUser).then(user => setUsers([...users, user]));
  };

  const handleUpdate = (userId) => {
    const updatedUser = { ...newUser, id: userId }; // Mettre à jour avec les données de l'utilisateur modifié
    updateUser(userId, updatedUser).then(() => {
      setUsers(users.map(user => (user.id === userId ? updatedUser : user)));
    });
  };

  const handleDelete = (userId) => {
    deleteUser(userId).then(() => {
      setUsers(users.filter(user => user.id !== userId));
    });
  };

  return (
    <div className="user-management">
      <h2>Gestion des utilisateurs</h2>
      {/* Formulaire d'enregistrement des utilisateurs */}
      <div>
        <input type="text" placeholder="Nom d'utilisateur" onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
        <input type="email" placeholder="Email" onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input type="password" placeholder="Mot de passe" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <button onClick={handleRegister}>Enregistrer</button>
      </div>
      {/* Liste des utilisateurs */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleUpdate(user.id)}>Modifier</button>
            <button onClick={() => handleDelete(user.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
