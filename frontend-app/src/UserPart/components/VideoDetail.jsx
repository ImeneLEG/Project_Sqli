import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { getVideoById, watchVideo } from "../../services/videoService";
import { getCurrentUser } from "../../services/authService";

const VideoDetail = () => {
    const [videoDetail, setVideoDetail] = useState(null);
    const { videoId } = useParams();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch the current user ID
        getCurrentUser()
            .then((data) => setUserId(data.userId))
            .catch(console.error);
    }, []);

    useEffect(() => {
        getVideoById(videoId)
            .then((data) => {
                setVideoDetail(data);
                console.log(`Video ${videoId} details fetched successfully.`);
            })
            .catch((error) => {
                console.error(`Error fetching video ${videoId} details:`, error);
            });
    }, [videoId]);

    const handleVideoPlay = () => {
        console.log(`Video ${videoId} is being watched.`);
        if (userId) {
            watchVideo(userId, videoId)
                .then(() => {
                    console.log(`Video ${videoId} added to history for user ${userId}.`);
                })
                .catch((error) => {
                    console.error(`Error adding video ${videoId} to history:`, error);
                });
        }
    };


    if (!videoDetail) return <p>Loading...</p>;

    // Function to get the most recent value from a dictionary
    const getMostRecentValue = (data) => {
        if (data) {
            const sortedKeys = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
            const mostRecentKey = sortedKeys[0];
            return data[mostRecentKey];
        }
        return 0;
    };

    const views = getMostRecentValue(videoDetail.views);
    const likes = getMostRecentValue(videoDetail.likes);
    const comments = getMostRecentValue(videoDetail.comments);

    return (
        <Box sx={{ backgroundColor: '#000', color: '#000', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '70%', borderRadius: '10px', marginBottom: '20px' }}>
                <Box sx={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '10px', marginBottom: '20px' }}>
                    <ReactPlayer
                        url={videoDetail.url}
                        className="react-player"
                        controls
                        width="100%"
                        height="100%"
                        onPlay={handleVideoPlay}
                        style={{ position: 'absolute', top: '0', left: '0', borderRadius: '10px' }}
                    />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', color: 'white' }}>
                    {videoDetail.title}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '20px', color: 'white' }}>
                    {videoDetail.channelTitle}
                    <CheckCircle sx={{ fontSize: '16px', color: '#ff6f61' }} />
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Box sx={{ textAlign: 'center', borderRadius: '10px', padding: '5px', backgroundColor: '#f1f5f9', color: '#000', width: '30%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {new Date(videoDetail.publishedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Published at</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', borderRadius: '10px', padding: '8px', backgroundColor: '#f1f5f9', color: '#000', width: '30%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {Math.floor(videoDetail.duration / 3600) > 0 && `${Math.floor(videoDetail.duration / 3600)}h `}{Math.floor((videoDetail.duration % 3600) / 60)}m {videoDetail.duration % 60}s
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Duration</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Box sx={{ textAlign: 'center', borderRadius: '10px', padding: '10px', backgroundColor: '#f1f5f9', color: '#000', width: '30%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {views.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Views</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', borderRadius: '10px', padding: '10px', backgroundColor: '#f1f5f9', color: '#000', width: '30%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {likes.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Likes</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', borderRadius: '10px', padding: '10px', backgroundColor: '#f1f5f9', color: '#000', width: '30%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {comments.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Comments</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default VideoDetail;
