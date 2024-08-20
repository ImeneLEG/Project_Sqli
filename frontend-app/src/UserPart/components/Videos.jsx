import { Box, Stack } from '@mui/material';
import { VideoCard} from './index';
import React from 'react';


const Videos = ({ videos, sidebarOpen ,direction}) => {
    // Handle the case when videos array is null or empty
    if (!videos || videos.length === 0) {
      return null; // or you can render a loading message or an empty state component
    }
  return (
    <Stack
      direction={direction ||"row"}
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      sx={{
        ".MuiBox-root": {
          // Apply styles to the Box component (videos container) based on breakpoints
          marginLeft: {
            xs: '0', // No marginLeft for xs devices
            md: sidebarOpen ? '20px' : '10px', // Apply marginLeft for md and larger devices when the sidebar is open/closed
          },
          marginTop: {
            xs: '10px', // No marginTop for xs devices
            md: '10px', // Apply marginTop for md and larger devices 
          },
        },
      }}
    >
      {videos.map((item, idx) => (
        <Box key={idx}>
          {item.id.videoId &&  <VideoCard video={item} sidebarOpen={sidebarOpen} />}

        </Box>
      ))}
    </Stack>
  );
};

export default Videos;
