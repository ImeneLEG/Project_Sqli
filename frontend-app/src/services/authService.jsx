import axios from 'axios';
import apiClient from "../api/axios";
const API_URL = 'https://localhost:7275/api/Auth/';
// Sign-Up
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

// Get Current User
export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await axios.get(`${API_URL}current-user`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Token may be invalid or expired.');
            // Handle logout or token refresh logic here
        }
        throw error;
    }
};

// Login
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}login`, userData);
        localStorage.setItem('token', response.data.Token); // Store the token
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

// Logout
export const logout = async () => {
    try {
        localStorage.removeItem('token'); // Remove token on logout
        const response = await axios.post(`${API_URL}logout`);
        return {
            status: response.status,
        };
    } catch (error) {
        return {
            status: error.response?.status,
            message: error.response?.data || error.message
        };
    }
};
