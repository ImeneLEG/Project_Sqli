import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { demoChannelTitle,demoVideoTitle, demoVideoUrl,demoProfilePicture} from '../utils/constants';
import { CheckCircle } from '@mui/icons-material';

const VideoCard = ({ video: { id: { videoId }, snippet }, sidebarOpen ,channelDetail}) => {
  const videoWidth = sidebarOpen ? '400px' : '360px'; // Adjust the video width when the sidebar is open

  return (
    <Card sx={{ width: { md: videoWidth, xs: '360px' }, borderRadius: '15px' }}>
      {/* Adjust the video width based on the sidebarOpen prop */}
      <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
      
<CardMedia
  image={snippet?.thumbnails?.high?.url}
  alt={snippet?.title}
  sx={{
    width: videoWidth,
    height: '190px',
    transition: 'width 0.3s ease, height 0.3s ease', // Add a transition for smoother resizing
  }}
/>
      </Link>
      <CardContent sx={{ backgroundColor: 'white', height: '80px' }}>
        <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
          <Typography variant="subtitle1" fontWeight="bold">
            {snippet?.title.slice(0, 80) || demoVideoTitle.slice(0, 60)}
          </Typography>
        </Link>
        <Link>

          <Typography variant="subtitle2" color="#5F5F57">
            {snippet?.channelTitle || demoChannelTitle}
            <CheckCircle sx={{ fontSize: '15px', marginLeft: '5px', marginBottom: '-3px' }} />
          </Typography>
        </Link>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
