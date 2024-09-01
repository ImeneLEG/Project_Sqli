import axios from 'axios';

const API_BASE_URL = 'https://localhost:7275/api';

// Fonction pour récupérer le current user
// export const getCurrentUser = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}Auth/current-user`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération de l\'utilisateur courant', error);
//   }
// };

// Get Current User
export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await axios.get(`${API_URL}Auth/current-user`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Token may be invalid or expired.');
            // Handle logout or token refresh logic here
        }
        throw error;
    }
};

// Fonction pour récupérer tous les utilisateurs
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Auth/users`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs', error);
  }
};

// Fonction pour enregistrer un nouvel utilisateur
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur', error);
  }
};

// Fonction pour mettre à jour un utilisateur
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/Auth/update/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Auth/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur', error);
  }
};


// Nouvelle fonction pour récupérer les statistiques mensuelles des utilisateurs
export const fetchMonthlyUserStats = async (year) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/${year}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques mensuelles des utilisateurs', error);
    }
}

// Fonction pour récupérer le nombre total de vidéos enregistrées par jour
export const fetchVideoStatistics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/count-per-day`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques vidéo', error);
  }
};

// Fonction pour récupérer les top X vidéos d'un pays donné
export const fetchTopVideosByCountry = async (topX, countryCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/most-viewed-by-country`, {
      params: { topX, countryCode }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos par pays', error);
  }
};
