import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, IconButton } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from "react-router-dom";
import { CheckCircle, Favorite, FavoriteBorder } from "@mui/icons-material";

const VideoCard = ({ video, sidebarOpen, onAddToFavorites, onRemoveFromFavorites, onRemoveVideoFromHistory, isHistory }) => {
    const [isFavorite, setIsFavorite] = useState(video.isFavorite || false);

    // Update isFavorite when video.isFavorite prop changes
    useEffect(() => {
        setIsFavorite(video.isFavorite);
    }, [video.isFavorite]);

    // Handle favorite click action
    const handleFavoriteClick = () => {
        if (isFavorite) {
            onRemoveFromFavorites(video.videoId);
        } else {
            onAddToFavorites(video.videoId);
            setIsFavorite(true)
        }
        setIsFavorite(!isFavorite);
    };

    // Handle delete action from history
    const handleDeleteClick = () => {
        onRemoveVideoFromHistory(video.videoId);
    };

    // Check if thumbnail exists and replace 'default' with 'hqdefault'
    const thumbnailUrl = video.thumbnail ? video.thumbnail.replace("default", "hqdefault") : '';

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
                        image={thumbnailUrl}
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
                {isHistory && onRemoveVideoFromHistory && (
                    <IconButton
                        aria-label="Delete from history"
                        onClick={handleDeleteClick}
                        sx={{
                            position: "absolute",
                            bottom: "10px", // Adjusts the vertical positioning
                            right: "50px", // Adjust this value to make sure it's in front of the heart icon
                            color: "red",
                            zIndex: 10, // Ensures the delete icon is on top of other elements
                        }}
                    >
                        <DeleteOutlineIcon />
                    </IconButton>
                )}
                <IconButton
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    onClick={handleFavoriteClick}
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        right: isHistory ? "10px" : "50px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        color: isFavorite ? 'red' : 'gray', 
                    }}
                >
                    {isFavorite ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder sx={{ color: 'gray' }} />}
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default VideoCard;
