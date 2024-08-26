import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, Menu, MenuItem } from "@mui/material";
import { SideBar, Videos } from "./index";
import { getTrendingVideos, getRegions, addToFavorites, removeFromFavorites, getCurrentUser, getUserFavoriteVideos } from "../../services/videoService";
import MenuIcon from "@mui/icons-material/Menu";

const Feed = () => {
    const [selectedCategory, setSelectedCategory] = useState("New");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [videos, setVideos] = useState([]);
    const [regions, setRegions] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionName, setSelectedRegionName] = useState(""); 
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch regions on component mount
        getRegions()
            .then((data) => setRegions(data))
            .catch(console.error);

        // Fetch current user ID on component mount
        getCurrentUser()
            .then((data) => setUserId(data.userId))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedCategory === "Favorites" && userId) {
            getUserFavoriteVideos(userId)
                .then((data) => {
                    if (data && Array.isArray(data)) {
                        const favoriteVideos = data.map(video => ({
                            ...video,
                            isFavorite: true,
                        }));
                        setVideos(favoriteVideos);
                    } else if (data.length === 0) {
                        console.log("No favorite videos found.");
                        setVideos([]); // Set an empty array if there are no favorites
                    } else {
                        console.error("Unexpected data format:", data);
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        console.log("User has no favorite videos.");
                        setVideos([]); // No favorites, so set an empty array
                    } else {
                        console.error("Error fetching favorite videos:", error);
                    }
                });
        } else if (selectedRegion) {
            getTrendingVideos(selectedRegion)
                .then((data) => {
                    if (data && Array.isArray(data)) {
                        setVideos(data);
                    } else {
                        console.error("Unexpected data format:", data);
                    }
                })
                .catch(console.error);
        }
    }, [selectedCategory, selectedRegion, userId]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

    const handleRegionSelect = (regionCode) => {
        setSelectedRegion(regionCode);
        const selectedRegionObject = regions.find(region => region.item1 === regionCode);
        if (selectedRegionObject) {
            setSelectedRegionName(selectedRegionObject.item2);
        }
        setSelectedCategory("New");
        setAnchorEl(null);
    };

    const handleAddToFavorites = async (videoId) => {
        if (!userId) return;
        try {
            await addToFavorites(userId, videoId);
        } catch (error) {
            console.error("Error adding video to favorites:", error);
        }
    };

    const handleRemoveFromFavorites = async (videoId) => {
        if (!userId) return;
        try {
            await removeFromFavorites(userId, videoId);
            setVideos((prevVideos) => prevVideos.filter(video => video.videoId !== videoId));
        } catch (error) {
            console.error("Error removing video from favorites:", error);
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
                        {selectedCategory === "Favorites" ? (
                            'Your Favorite Videos'
                        ) : (
                            <>
                                Trending <span style={{ color: "red" }}>{regions.find(region => region.item1 === selectedRegion)?.item2}</span> Videos
                            </>
                        )}
                    </Typography>

                    {selectedCategory !== "Favorites" && (
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
                    />
                ) : (
                    <Typography variant="h5" color="white">
                        {selectedCategory === "Favorites" ? "You have no favorite videos." : "No videos available."}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
};

export default Feed;
