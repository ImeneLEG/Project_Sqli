import axios from 'axios';

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

export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}login`, userData);
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

export const logout = async (userData) => {
  try {
      const response = await axios.post(`${API_URL}logout`, userData);
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


export const  apiClient = axios.create({
  baseURL: 'https://localhost:7275/api', // Assure-toi que le baseURL est correct
  withCredentials: true, // Inclure toujours les cookies
});



