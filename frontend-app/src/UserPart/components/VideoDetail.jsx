import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Typography, Button, IconButton,Chip } from '@mui/material';
import { CheckCircle, ExpandMore, ExpandLess } from '@mui/icons-material';
import { getVideoById, watchVideo } from "../../services/videoService";
import { getCurrentUser } from "../../services/authService";

const VideoDetail = () => {
    const [videoDetail, setVideoDetail] = useState(null);
    const { videoId } = useParams();
    const [userId, setUserId] = useState(null);
    const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
    const [isTagsExpanded, setTagsExpanded] = useState(false);

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

    const toggleDescription = () => {
        setDescriptionExpanded((prev) => !prev);
    };

    const toggleTags = () => {
        setTagsExpanded((prev) => !prev);
    };

    if (!videoDetail) return <p>Loading...</p>;

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

    const tagsToShowInitially = 5;

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

                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', color: 'white' }}>
                    {videoDetail.title}
                </Typography>

                {/* Description with Icon positioned separately */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',backgroundColor:"#282828", color: 'white', marginBottom: '10px' }}>
                    <Typography variant="body1" sx={{ maxHeight: isDescriptionExpanded ? 'none' : '50px', overflow: 'hidden', textAlign: 'left' }}>
                        {videoDetail.description}
                    </Typography>
                    <IconButton onClick={toggleDescription} sx={{ color: 'white' }}>
                        {isDescriptionExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>


                {/* Tags Section with "Read More" */}
                <Box sx={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' ,justifyContent: 'center'}}>
                    {(isTagsExpanded ? videoDetail.tags : videoDetail.tags.slice(0, tagsToShowInitially)).map((tag, index) => (
                        <Chip key={index} label={tag} sx={{ backgroundColor: '#282828', color: 'white' }} />
                    ))}
                    {videoDetail.tags.length > tagsToShowInitially && (
                        <IconButton onClick={toggleTags} sx={{ color: 'white' }}>
                            {isTagsExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    )}
                </Box>



                <Typography variant="body1" sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '20px', color: 'white',fontSize:'25px',fontWeight:'bold'}}>
                    {videoDetail.channelTitle}
                    <CheckCircle sx={{ fontSize: '20px', color: '#ff6f61' }} />
                </Typography>

                {/* Additional Boxes for Published Date, Duration, Views, Likes, Comments */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    {/* Date, Duration, Views, Likes, Comments */}
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
