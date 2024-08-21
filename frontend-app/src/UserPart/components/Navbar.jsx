import React from 'react'
import { Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { logo } from '../utils/constants'
import SearchBar from './SearchBar'

const Navbar = () => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      p={1}
      sx={{ position: 'sticky', background: '#000', justifyContent: 'space-between', top: '0',zIndex:2 }}
    >
      <Link to='/' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <img src={logo} height={40} style={{ marginLeft: '55px' }} />
        <Typography
          variant='h6'
          sx={{
            color: 'white',
            fontSize: { xs: '0px', md: '30px' }, // Set font size to 0 on xs, 30px on md and larger
            lineHeight: '30px',
            marginLeft: '5px',
            visibility: { xs: 'hidden', md: 'visible' }, // Hide on xs, visible on md and larger
          }}
        >
          TrendyTube
        </Typography>
      </Link>
      <SearchBar />
    </Stack>
  )
}

export default Navbar;
