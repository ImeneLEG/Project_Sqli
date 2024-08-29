import axios from 'axios';
import apiClient from "../api/axios";

// Configure Axios pour inclure les cookies avec chaque requête
axios.defaults.withCredentials = true;

const API_URL = 'https://localhost:7275/api/Auth/';

export const signUp = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}register`, userData);
        return {
            status: response.status,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status,
            message: error.response?.data || error.message
        };
    }
};


export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`${API_URL}current-user`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};


export const login = async (userData) => {
    try {
        // Activer les cookies pour cette requête en particulier
        const response = await axios.post(`${API_URL}login`, userData, { withCredentials: true });
        return {
            status: response.status,
            data: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status,
            message: error.response?.data || error.message
        };
    }
};
