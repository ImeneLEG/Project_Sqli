import axios from "axios";

const API_URL = "https://localhost:7275/api/historique";

const HistoriqueService = {
    // Récupérer l'historique pour un utilisateur spécifique
    getHistoryByUser: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching history:", error);
            throw error;
        }
    },

    // Supprimer une vidéo spécifique de l'historique de l'utilisateur
    removeVideoFromHistory: async (userId, videoId) => {
        try {
            await axios.delete(`${API_URL}/user/${userId}/video/${videoId}`);
        } catch (error) {
            console.error("Error removing video from history:", error);
            throw error;
        }
    },

    // Effacer l'historique complet d'un utilisateur
    clearHistory: async (userId) => {
        try {
            await axios.delete(`${API_URL}/clear/${userId}`);
        } catch (error) {
            console.error("Error clearing history:", error);
            throw error;
        }
    },
};

export default HistoriqueService;
