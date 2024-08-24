import { Box, Stack } from "@mui/material";
import React from "react";
import VideoCard from "./VideoCard";

const Videos = ({ videos, sidebarOpen, direction }) => {
    if (!videos || videos.length === 0) {
        return <p>No videos available</p>;
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
                    {item.videoId && <VideoCard video={item} sidebarOpen={sidebarOpen} />}
                </Box>
            ))}
        </Stack>
    );
};

export default Videos;
