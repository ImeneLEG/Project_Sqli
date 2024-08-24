import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Button, Menu, MenuItem } from "@mui/material";
import { SideBar, Videos } from "./index";
import { getTrendingVideos, getRegions } from "../../services/videoService";
import MenuIcon from "@mui/icons-material/Menu";

const Feed = () => {
    const [selectedCategory, setSelectedCategory] = useState("New");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [videos, setVideos] = useState([]);
    const [regions, setRegions] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState("");

    useEffect(() => {
        getRegions()
            .then((data) => setRegions(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedRegion) {
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
    }, [selectedRegion]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

    const handleRegionSelect = (regionCode) => {
        setSelectedRegion(regionCode);
        setAnchorEl(null);
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
                        Trending <span style={{ color: "red" }}>{selectedRegion}</span> Videos
                    </Typography>
                    <Box>
                        <Button
                            aria-controls="region-menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            variant="contained"
                            color="error"
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
                </Stack>
                <Videos videos={videos} sidebarOpen={sidebarOpen} />
            </Box>
        </Stack>
    );
};

export default Feed;
