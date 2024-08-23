import axios from 'axios';

const API_URL = 'https://localhost:7275/api/Auth/';

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const signUp = async (userData)=>{
    try {
        const response = await axios.post(`${API_URL}register`, userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
}