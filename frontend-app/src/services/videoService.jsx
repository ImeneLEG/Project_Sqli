import apiClient from '../api/axios';
import axios from 'axios';


export const getTrendingVideos = async (regionCode) => {
    try {
        const response = await apiClient.get(`/videos/trending/${regionCode}`);
        console.log("API Response Data:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching trending videos:', error);
        throw error;
    }
};


// Fetch video by ID
export const getVideoById = async (videoId) => {
    try {
        const response = await apiClient.get(`/videos/${videoId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching video by ID:', error);
        throw error;
    }
};

// Fetch video count per day
export const getVideoCountPerDay = async () => {
    try {
        const response = await apiClient.get('/videos/count-per-day');
        return response.data;
    } catch (error) {
        console.error('Error fetching video count per day:', error);
        throw error;
    }
};

// Fetch most viewed videos by country
export const getMostViewedVideosByCountry = async () => {
    try {
        const response = await apiClient.get('/videos/most-viewed-by-country');
        return response.data;
    } catch (error) {
        console.error('Error fetching most viewed videos by country:', error);
        throw error;
    }
};

// Fetch all available regions
export const getRegions = async () => {
    try {
        const response = await apiClient.get('/videos/regions');
        console.log(response.data); // Check the response format
        return response.data;
    } catch (error) {
        console.error('Error fetching regions:', error);
        throw error;
    }
};



// Watch video and add to history
export const watchVideo = async (userId, videoId) => {
    try {
        const response = await apiClient.get(`/videos/watch/${videoId}`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error('Error watching video:', error);
        throw error;
    }
};
