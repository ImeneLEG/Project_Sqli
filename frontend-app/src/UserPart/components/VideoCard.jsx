import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material";

    const VideoCard = ({ video, sidebarOpen }) => {
    const videoWidth = sidebarOpen ? "400px" : "360px";
    const highQualityThumbnail = video.thumbnail.replace("default", "hqdefault");


    return (
        <Card sx={{ width: { md: videoWidth, xs: "360px" }, borderRadius: "15px" }}>
            {video.videoId && (
                <Link to={`/video/${video.videoId}`}>
                    <CardMedia
                        image={highQualityThumbnail}
                        alt={video.title}
                        sx={{ width: videoWidth, height: "190px", transition: "width 0.3s ease, height 0.3s ease" }}
                    />
                </Link>
            )}
            <CardContent sx={{ backgroundColor: "white", height: "80px" }}>
                {video.title && (
                    <Link to={`/video/${video.videoId}`}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {video.title}
                        </Typography>
                    </Link>
                )}
                {video.channelTitle && (
                    <Typography variant="subtitle2" color="#5F5F57">
                        {video.channelTitle}
                        <CheckCircle sx={{ fontSize: "15px", marginLeft: "5px", marginBottom: "-3px" }} />
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default VideoCard;
