import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { CheckCircle, Favorite, FavoriteBorder } from "@mui/icons-material";

const VideoCard = ({ video, sidebarOpen, onAddToFavorites, onRemoveFromFavorites }) => {
    const [isFavorite, setIsFavorite] = useState(video.isFavorite || false);

    useEffect(() => {
        setIsFavorite(video.isFavorite);
    }, [video.isFavorite]);

    const handleFavoriteClick = () => {
        if (isFavorite) {
            onRemoveFromFavorites(video.videoId);
        } else {
            onAddToFavorites(video.videoId);
        }
        setIsFavorite(!isFavorite);
    };

    return (
        <Card
            sx={{
                width: { md: sidebarOpen ? "400px" : "360px", xs: "100%" },
                borderRadius: "15px",
                position: "relative",
                marginBottom: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                '&:hover': {
                    transform: "scale(1.03)",
                },
            }}
        >
            {video.videoId && (
                <Link to={`/video/${video.videoId}`} style={{ textDecoration: "none" }}>
                    <CardMedia
                        component="img"
                        image={video.thumbnail.replace("default", "hqdefault")}
                        alt={video.title}
                        sx={{ width: "100%", height: "190px", transition: "width 0.3s ease, height 0.3s ease" }}
                    />
                </Link>
            )}
            <CardContent
                sx={{
                    backgroundColor: "#f9f9f9",
                    height: "80px",
                    position: "relative",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                {video.title && (
                    <Link to={`/video/${video.videoId}`} style={{ textDecoration: "none", color: "black" }}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {video.title}
                        </Typography>
                    </Link>
                )}
                {video.channelTitle && (
                    <Typography variant="subtitle2" color="#5F5F57" display="flex" alignItems="center">
                        {video.channelTitle}
                        <CheckCircle sx={{ fontSize: "15px", marginLeft: "5px" }} />
                    </Typography>
                )}
                <IconButton
                    onClick={handleFavoriteClick}
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        color: isFavorite ? 'red' : 'gray',
                    }}
                >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default VideoCard;



