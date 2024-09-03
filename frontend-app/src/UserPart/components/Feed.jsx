import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { SideBar, Videos } from "./index";
import { getTrendingVideos, getRegions, addToFavorites, removeFromFavorites, getUserFavoriteVideos, watchVideo } from "../../services/videoService";
import HistoriqueService from "../../services/historyService";
import { getCurrentUser } from "../../services/authService";
import MenuIcon from "@mui/icons-material/Menu";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'; // Import for a more stylish icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import AdminDashboard from '../../AdminPart/AdminDashboard'; // Import the AdminDashboard component


const Feed = () => {
    const [selectedCategory, setSelectedCategory] = useState("Home");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [videos, setVideos] = useState([]);
    const [regions, setRegions] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionName, setSelectedRegionName] = useState("");
    const [userId, setUserId] = useState(null);
    const [historyActionLoading, setHistoryActionLoading] = useState(false);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogActionType, setDialogActionType] = useState("");
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleConfirmDialogOpen = (actionType, videoId = null) => {
        setDialogActionType(actionType);
        setSelectedVideoId(videoId);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
        setDialogActionType("");
        setSelectedVideoId(null);
    };

    const handleConfirmAction = () => {
        if (dialogActionType === "removeHistory") {
            handleRemoveVideoFromHistory(selectedVideoId);
        } else if (dialogActionType === "removeFavorite") {
            handleRemoveFromFavorites(selectedVideoId);
        } else if (dialogActionType === "clearHistory") {
            handleClearHistory();
        }
        handleConfirmDialogClose();
    };

    // Clear history logic
    const handleRemoveVideoFromHistory = async (videoId) => {
        if (!userId) return;
        try {
            await HistoriqueService.removeVideoFromHistory(userId, videoId);
            setVideos((prevVideos) => prevVideos.filter(video => video.videoId !== videoId));
        } catch (error) {
            console.error("Error removing video from history:", error);
        }
    };

    const handleClearHistory = async () => {
        if (!userId) return;
        try {
            await HistoriqueService.clearHistory(userId);
            setVideos([]);
        } catch (error) {
            console.error("Error clearing history:", error);
        }
    };

    // Logic of history and favorites
    useEffect(() => {
        console.log("Fetching regions...");
        getRegions()
            .then((data) => {
                setRegions(data);
                console.log("Regions fetched successfully:", data);

                // Retrieve default region from localStorage
                const defaultRegion = localStorage.getItem('defaultRegion');
                console.log('Default region retrieved:', defaultRegion);

                // If a default region is stored, select it
                if (defaultRegion) {
                    setSelectedRegion(defaultRegion);
                }
            })
            .catch((error) => {
                console.error("Error fetching regions:", error);
            });

        console.log("Fetching current user...");
        getCurrentUser()
            .then((data) => {
                setUserId(data.userId);
                console.log("Current user fetched successfully:", data);

                if (data.country) {  // Correct the variable here
                    setSelectedRegion(data.country);
                    console.log('User region:', data.country);  // And here
                } // Apply the logged-in user's region
            })
            .catch((error) => {
                console.error("Error fetching current user:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Selected category:", selectedCategory);
        console.log("Selected region:", selectedRegion);
        console.log("User ID:", userId);

        // Clear videos state when switching categories
        setVideos([]);

        if (selectedCategory === "Favorites" && userId) {
            getUserFavoriteVideos(userId)
                .then((data) => {
                    setVideos(data.map(video => ({ ...video, isFavorite: true })));
                })
                .catch((error) => {
                    console.error(`Error fetching favorite videos for user ${userId}:`, error);
                });
        } else if (selectedCategory === "History" && userId) {
            console.log("Fetching watch history...");
            HistoriqueService.getHistoryByUser(userId)
                .then((data) => {
                    const formattedData = data.map(item => ({
                        videoId: item.video.videoId,
                        title: item.video.title,
                        thumbnail: item.video.thumbnail,
                        channelTitle: item.video.channelTitle,
                    }));
                    setVideos(formattedData);
                    console.log("Watch history fetched and formatted successfully:", formattedData);
                })
                .catch((error) => {
                    console.error(`Error fetching history for user ${userId}:`, error);
                });
        } else if (selectedCategory === "Home" && selectedRegion) {
            console.log("Fetching trending videos...");
            getTrendingVideos(selectedRegion)
                .then((data) => {
                    setVideos(data);
                    console.log("Trending videos fetched successfully:", data);
                })
                .catch((error) => {
                    console.error(`Error fetching trending videos for region ${selectedRegion}:`, error);
                });
        }
    }, [selectedCategory, selectedRegion, userId]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        console.log("Sidebar toggled:", !sidebarOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        console.log("Menu opened:", event.currentTarget);
    };

    const handleRegionSelect = (regionCode) => {
        console.log("Region selected:", regionCode);
        setSelectedRegion(regionCode);
        const selectedRegionObject = regions.find(region => region.item1 === regionCode);
        if (selectedRegionObject) {
            setSelectedRegionName(selectedRegionObject.item2);
            console.log("Selected region name:", selectedRegionObject.item2);
        }
        setSelectedCategory("Home");
        setAnchorEl(null);
    };

    const handleAddToFavorites = async (videoId) => {
        if (!userId) return;
        try {
            console.log("Adding video to favorites:", videoId);
            await addToFavorites(userId, videoId);
            // Update videos state to reflect the new favorite
            setVideos((prevVideos) =>
                prevVideos.map(video =>
                    video.videoId === videoId
                    ? { ...video, isFavorite: true } 
                    : video
                )
            );
            console.log("Video added to favorites successfully:", videoId);
        } catch (error) {
            console.error("Error adding video to favorites:", error);
        }
    };

    const handleRemoveFromFavorites = async (videoId) => {
        if (!userId) return;
        try {
            console.log("Removing video from favorites:", videoId);
            await removeFromFavorites(userId, videoId);
            // Update videos state to reflect the removed favorite
            setVideos((prevVideos) =>
                prevVideos.map(video =>
                    video.videoId === videoId
                    ? { ...video, isFavorite: false } 
                    : video
                )
                .filter(video => video.videoId !== videoId) 
            );
            console.log("Video removed from favorites successfully:", videoId);
        } catch (error) {
            console.error("Error removing video from favorites:", error);
        }
    };

    const handleWatchVideo = async (videoId) => {
        if (!userId) return;
        try {
            console.log("Watching video:", videoId);
            await watchVideo(userId, videoId);
            console.log("Video added to history successfully:", videoId);
        } catch (error) {
            console.error("Error watching video:", error);
        }
    };

    // Navigate to Admin Dashboard
    const handleAdminDashboardClick = () => {
        navigate('/admin-dashboard'); // Change this to your desired route
    };

    return (
        <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
            <Box sx={{ position: "fixed", left: 16, top: 10, zIndex: 999 }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: "black",
                        border: "none",
                        padding: "8px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <MenuIcon style={{ color: "white", fontSize: "24px" }} />
                </button>
            </Box>
            {sidebarOpen && (
                <Box
                    sx={{
                        height: { sx: "auto", md: "92vh" },
                        borderRight: "1px solid #3d3d3d",
                        px: { sx: 0, md: 2 },
                    }}
                >
                    <SideBar
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                    <Typography
                        variant="body2"
                        sx={{ mt: 1.5, color: "#fff", display: { xs: "none", md: "block" } }}
                    >
                        Copyright © TrendyTube 2024
                    </Typography>
                </Box>
            )}

            <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: "2" }}>
                {selectedCategory === "Admin Dashboard" ? (
                    <AdminDashboard /> // Display Admin Dashboard
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
                                {selectedCategory === "Favorites"
                                    ? 'Your Favorite Videos'
                                    : selectedCategory === "History"
                                        ? 'Your Watch History'
                                        : <>
                                            Trending <span style={{ color: "red" }}>{regions.find(region => region.item1 === selectedRegion)?.item2}</span> Videos
                                        </>}
                            </Typography>
                            {selectedCategory === "History" && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleConfirmDialogOpen("clearHistory")}
                                >
                                    Clear History
                                </Button>
                            )}
                            <Button
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={handleMenuOpen}
                            >
                                Select Region
                            </Button>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                {regions.map((region) => (
                                    <MenuItem
                                        key={region.item1}
                                        onClick={() => handleRegionSelect(region.item1)}
                                    >
                                        {region.item2}
                                    </MenuItem>
                                ))}
                            </Menu>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAdminDashboardClick} // Click handler for Admin Dashboard
                            >
                                Admin Dashboard
                            </Button>
                        </Stack>

                        {videos.length > 0 ? (
                            <Videos
                                videos={videos}
                                sidebarOpen={sidebarOpen}
                                onAddToFavorites={handleAddToFavorites}
                                onRemoveFromFavorites={(videoId) => handleConfirmDialogOpen("removeFavorite", videoId)}
                                onWatchVideo={handleWatchVideo}
                                onRemoveVideoFromHistory={(videoId) => handleConfirmDialogOpen("removeHistory", videoId)}
                                isHistory={selectedCategory === "History"}
                            />
                        ) : (
                            <Typography variant="h5" color="white">
                                {selectedCategory === "Favorites"
                                    ? "You have no favorite videos."
                                    : selectedCategory === "History"
                                        ? "You have no watch history."
                                        : "No videos available."}
                            </Typography>
                        )}
                    </>
                )}
            </Box>

            <Dialog
                open={confirmDialogOpen}
                onClose={handleConfirmDialogClose}
            >
                <DialogTitle>
                    {dialogActionType === "clearHistory"
                        ? "Clear History"
                        : dialogActionType === "removeFavorite"
                            ? "Remove from Favorites"
                            : "Remove from History"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogActionType === "clearHistory"
                            ? "Are you sure you want to clear all your watch history?"
                            : dialogActionType === "removeFavorite"
                                ? "Are you sure you want to remove this video from your favorites?"
                                : "Are you sure you want to remove this video from your history?"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose}>Cancel</Button>
                    <Button onClick={handleConfirmAction} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default Feed;
