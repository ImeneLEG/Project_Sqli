import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Typography, Box, Stack } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { fetchFromAPI } from '../utils/fetchFromApi';
import { Videos } from './index';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
const VideoDetail = () => {
  const { id } = useParams();
  const [VideoDetail, setVideoDetail] = useState(null);

  // const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
 
  const handleLikeClick = () => {
    // setLikeCount((prevCount) => prevCount + 1);
    setIsLiked(true);
  };

const [videos, setvideos] = useState(null)
  useEffect(() => {
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => setVideoDetail(data.items[0])) // "data.items[0]" instead of "data.item[0]"
      .catch((error) => console.error('Error fetching video details:', error));

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
    .then((data)=>setvideos(data.items))
  }, [id]);

  if (!VideoDetail) {
    // Render a loading state or return null if the data is not available yet
    return <div>Loading...</div>; // You can customize the loading state as needed
  }

  const {
    snippet: { title, channelId, channelTitle },
    statistics: { viewCount, likeCount },
  } = VideoDetail;

  return (
    <Box minHeight='95vh' >
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <Box flex={1} zIndex={0} position="relative">
          <Box sx={{ width: '100%', position: 'sticky', top: '76px' }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className='react-player' controls />
            <Typography color='#fff' variant='h5' fontWeight='bold' p={2}>
              {title}
            </Typography>
            <Stack direction='row' justifyContent='space-between' sx={{ color: '#fff' }}  px={2}>
              <Link to={`/channels/${channelId}`}>
                <Typography variant={{ sm: 'subtitle1', md: 'h6' }} color='#fff'>
                  {channelTitle}
                  <CheckCircle sx={{ fontSize: '12px', color: 'gray', ml: '5px' }} />
                </Typography>
              </Link>
            
            <Stack direction="row" gap="20px" alignItems="center">
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {parseInt(viewCount).toLocaleString()} views
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
                <ThumbUpIcon
  color={isLiked ? 'primary' : 'inherit'}
  style={{ marginRight: '4px', cursor: 'pointer' }}
  onClick={handleLikeClick}
/>
  {parseInt(likeCount).toLocaleString()}
</Typography>

              </Stack></Stack>
          </Box>
        </Box>

        <Box px={2} py={{ md: 1, xs: 5 }} justifyContent='center' alignItems='center'>
        <Typography variant="h6" sx={{ color: 'yellow', textAlign: 'center' }}>
        suggested videos
      </Typography>
      <Videos videos={videos} direction='column'/>
    </Box>
      </Stack>

     
    </Box>
  );
};

export default VideoDetail;
