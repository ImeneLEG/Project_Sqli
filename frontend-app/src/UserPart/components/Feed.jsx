import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, Menu, MenuItem } from "@mui/material";
import { SideBar, Videos } from "./index";
import { getTrendingVideos, getRegions, addToFavorites, removeFromFavorites, getUserFavoriteVideos, watchVideo } from "../../services/videoService";
import HistoriqueService from "../../services/historyService";
import { getCurrentUser } from "../../services/authService";
import MenuIcon from "@mui/icons-material/Menu";

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
            })
            .catch((error) => {
                console.error("Error fetching regions:", error);
            });

        console.log("Fetching current user...");
        getCurrentUser()
            .then((data) => {
                setUserId(data.userId);
                console.log("Current user fetched successfully:", data);
            })
            .catch((error) => {
                console.error("Error fetching current user:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Selected category:", selectedCategory);
        console.log("Selected region:", selectedRegion);
        console.log("User ID:", userId); // Ajout de ce log

        if (selectedCategory === "Favorites" && userId) {
            console.log("Fetching favorite videos...");
            getUserFavoriteVideos(userId)
                .then((data) => {
                    setVideos(data);
                    console.log("Favorite videos fetched successfully:", data);
                })
                .catch((error) => {
                    console.error(`Error fetching favorite videos for user ${userId}:`, error);
                });
        } else if (selectedCategory === "History" && userId) {
            console.log("Fetching watch history...");
            HistoriqueService.getHistoryByUser(userId)
                .then((data) => {
                    // Map the data to match the structure expected by VideoCard
                    const formattedData = data.map(item => ({
                        videoId: item.video.videoId,
                        title: item.video.title,
                       thumbnail: item.video.thumbnail,
                        channelTitle: item.video.channelTitle,
                        // Add other necessary fields from the video object
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
                    {selectedCategory === "History" && (
                        <Button variant="contained" color="error" onClick={handleClearHistory}>
                            Clear All History
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
                        onRemoveFromFavorites={handleRemoveFromFavorites}
                        onWatchVideo={handleWatchVideo}
                        onRemoveVideoFromHistory={handleRemoveVideoFromHistory} // Pass this handler to Videos
                        onClearHistory={handleClearHistory} // Pass this handler to Videos
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
        </Stack>
    );
};

export default Feed;
