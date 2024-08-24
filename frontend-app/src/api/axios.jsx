import axios from 'axios';


const apiClient = axios.create({
    baseURL: 'https://localhost:7275/api', // Adjust this URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
