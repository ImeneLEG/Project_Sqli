import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import VideoCard from "./VideoCard";

const Videos = ({ videos, sidebarOpen, direction, onAddToFavorites, onRemoveFromFavorites }) => {
    console.log("Videos received:", videos); // Ajout de ce log
    if (!videos || videos.length === 0) {
        return (
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Typography variant="h6" color="textSecondary">
                    No videos available
                </Typography>
            </Box>
        );
    }

    return (
        <Stack
            direction={direction || "row"}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            sx={{
                ".MuiBox-root": {
                    marginLeft: {
                        xs: "0",
                        md: sidebarOpen ? "20px" : "10px",
                    },
                    marginTop: {
                        xs: "10px",
                        md: "10px",
                    },
                },
            }}
        >
            {videos.map((item, idx) => (
                <Box key={idx}>
                    {item.videoId && (
                        <VideoCard
                            video={item}
                            sidebarOpen={sidebarOpen}
                            onAddToFavorites={onAddToFavorites}
                            onRemoveFromFavorites={onRemoveFromFavorites}
                        />
                    )}
                </Box>
            ))}
        </Stack>
    );
};

export default Videos;
