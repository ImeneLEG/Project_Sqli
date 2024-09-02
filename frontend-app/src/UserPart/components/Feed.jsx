import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, Menu, MenuItem,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { SideBar, Videos } from "./index";
import { getTrendingVideos, getRegions, addToFavorites, removeFromFavorites, getUserFavoriteVideos, watchVideo } from "../../services/videoService";
import HistoriqueService from "../../services/historyService";
import { getCurrentUser } from "../../services/authService";
import MenuIcon from "@mui/icons-material/Menu";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'; // Import for a more stylish icon


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


//clear history logic
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



//logic of history and favories and  imene and hajar
    useEffect(() => {
        console.log("Fetching regions...");
        getRegions()
            .then((data) => {
                setRegions(data);
                console.log("Regions fetched successfully:", data);

                // Récupérer la région par défaut depuis le localStorage
                const defaultRegion = localStorage.getItem('defaultRegion');
                console.log('Région par défaut récupérée:', defaultRegion);

                // Si une région par défaut est stockée, la sélectionner
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
                    console.log('Région de l\'utilisateur:', data.country);  // And here
                } // Appliquer la région de l'utilisateur connecté
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
            console.log("Fetching favorite videos...");
            getUserFavoriteVideos(userId)
                .then((data) => {
                    // Ensure each video has isFavorite set to true
                    const favoriteVideos = data.map(video => ({
                        ...video,
                        isFavorite: true
                    }));
                    setVideos(favoriteVideos);
                    console.log("Favorite videos fetched successfully:", favoriteVideos);
                })
                .catch((error) => {
                    console.error(`Error fetching favorite videos for user ${userId}:`, error);});
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
            setVideos((prevVideos) => prevVideos.filter(video => video.videoId !== videoId));
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
                        Copyright-2024
                    </Typography>
                </Box>
            )}
            <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: "2" }}>
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
                    {selectedCategory === "History" && videos.length > 0 && (
                        <Button variant="contained" color="error" onClick={() => handleConfirmDialogOpen("clearHistory")}>
                            Clear History
                        </Button>
                    )}

                    {selectedCategory !== "Favorites" && selectedCategory !== "History" && (
                        <Box>
                            <Button
                                aria-controls="region-menu"
                                aria-haspopup="true"
                                onClick={handleMenuOpen}
                                variant="contained"
                                color="error"
                                sx={{ mr: 1 }}
                            >
                                Select Region
                            </Button>
                            <Menu
                                id="region-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                {regions.length > 0 ? (
                                    regions.map((region) => (
                                        <MenuItem
                                            key={region.item1}
                                            onClick={() => handleRegionSelect(region.item1)}
                                            style={{ color: "black" }}
                                        >
                                            {region.item2}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No regions available</MenuItem>
                                )}
                            </Menu>
                        </Box>
                    )}
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
            </Box>

            <Dialog
                open={confirmDialogOpen}
                onClose={handleConfirmDialogClose}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-description"
                PaperProps={{
                    style: {
                        backgroundColor: '#333',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                    },
                }}
            >
                <DialogTitle id="confirmation-dialog-title" sx={{ fontSize: '2.0rem', fontWeight: 'bold' }}>
                    <RemoveCircleIcon sx={{ color: '#f44336', mr: 1, fontSize: '2.3rem' , marginBottom: '-2px'}} />
                    Confirm Action
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirmation-dialog-description"
                                       sx={{ color: 'white' }} // Set the text color to white
                    >
                        Are you sure you want to
                        {dialogActionType === "removeHistory"
                            ? " remove this video from your history"
                            : dialogActionType === "removeFavorite"
                                ? " remove this video from your favorites"
                                : " clear all your history"
                        }?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleConfirmDialogClose}
                        sx={{ backgroundColor: 'white', color: 'red', borderColor: 'white', '&:hover': { backgroundColor: 'transparent',borderColor: 'red' } }}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default Feed;