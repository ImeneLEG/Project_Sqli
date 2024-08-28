// src/services/videoService.js

import apiClient from '../api/axios'; // Importing the custom Axios instance

// Fetch trending videos by region
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

// Get user's favorite videos
export const getUserFavoriteVideos = async (userId) => {
  try {
    const response = await apiClient.get(`/Favoris/user/${userId}/favorites`);
    console.log(response.data); // Log the response data
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('No favorite videos found for this user.');
      return []; // Return an empty array if the user has no favorite videos
    } else {
      console.error('Error fetching favorite videos:', error);
      throw error; // Re-throw other errors to be handled elsewhere
    }
  }
};



// Add video to favorites
export const addToFavorites = async (userId, videoId) => {
  try {
    const response = await apiClient.post(`/Favoris/user/${userId}/video/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding video to favorites:', error);
    throw error;
  }
};

// Remove video from favorites
export const removeFromFavorites = async (userId, videoId) => {
  try {
    const response = await apiClient.delete(`/Favoris/user/${userId}/video/${videoId}`);
    console.log(videoId);
    console.log(userId);
    return response.data;
  } catch (error) {
    console.error('Error removing video from favorites:', error);
    throw error;
  }
};

// Get the current logged-in user
export const getCurrentUser = async () => {
  
  try {
    const response = await apiClient.get(`/Auth/current-user`, {
      withCredentials: true, // Ensure credentials are sent with the request
    });
    console.log(response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:');
    throw error;
  }
};
