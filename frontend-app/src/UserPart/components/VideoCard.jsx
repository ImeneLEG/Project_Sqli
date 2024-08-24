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


// import { Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { CheckCircle, Delete } from '@mui/icons-material';

// const VideoCard = ({ video: { id: { videoId }, snippet }, sidebarOpen, onRemove }) => {
//   const videoWidth = sidebarOpen ? '320px' : '280px'; // Adjust the video width for a smaller, refined card

//   // Extract the default thumbnail URL and replace "default" with "hqdefault"
//     const highQualityThumbnail = videoId.thumbnail; // Accessing the thumbnail URL from the backend response
//     console.log(highQualityThumbnail); // Logs the URL of the thumbnail image


//   // Function to handle click on remove button
//   const handleRemoveClick = () => {
//     onRemove(videoId); // Call the onRemove function with the videoId
//   };

//   return (
//     <Card sx={{ 
//       width: { md: videoWidth, xs: '280px' }, 
//       borderRadius: '20px', // Increase border radius for a more rounded effect
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add subtle shadow for floating effect
//       position: 'relative',  
//       overflow: 'hidden', // Ensure content does not overflow rounded corners
//       transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover effects
//       '&:hover': {
//         transform: 'scale(1.03)', // Slightly enlarge the card on hover
//         boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)', // Enhance shadow on hover
//       }
//     }}>
//       {/* Delete icon positioned at the top left */}
//       <IconButton 
//         onClick={handleRemoveClick} 
//         sx={{ 
//           position: 'absolute', 
//           top: '10px', 
//           left: '10px', 
//           backgroundColor: 'rgba(255, 255, 255, 0.8)', 
//           '&:hover': {
//             backgroundColor: 'rgba(255, 255, 255, 1)',
//           },
//           zIndex: 1 // Ensure the button is on top
//         }}
//       >
//         <Delete />
//       </IconButton>

//       <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
//         <CardMedia
//           component="img"
//           image={highQualityThumbnail }
//           alt={snippet?.title}
//           sx={{
//             width: '100%', 
//             height: '160px',
//             objectFit: 'cover',
//             transition: 'transform 0.3s ease',
//             imageRendering: 'optimizeQuality', // Ensure the best quality rendering
//             '&:hover': {
//               transform: 'scale(1.05)',
//             }
//           }}
//         />
//       </Link>

//       <CardContent sx={{ 
//         backgroundColor: 'white', 
//         height: '80px', 
//         padding: '10px', 
//         textAlign: 'center' // Center align text for a more balanced look
//       }}>
//         <Link to={videoId ? `/video/${videoId}` : demoVideoUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
//           <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '14px' }}>
//             {snippet?.title.slice(0, 50) || demoVideoTitle.slice(0, 50)} {/* Truncate longer titles */}
//           </Typography>
//         </Link>
//         <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
//           <Typography variant="subtitle2" color="gray" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginTop: '5px' }}>
//             {snippet?.channelTitle || demoChannelTitle}
//             <CheckCircle sx={{ fontSize: '14px', marginLeft: '5px' }} />
//           </Typography>
//         </Link>
//       </CardContent>
//     </Card>
//   );
// };

// export default VideoCard;
