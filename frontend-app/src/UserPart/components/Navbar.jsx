import React, { useState } from 'react';
import { Stack, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import SearchBar from './SearchBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {logout} from '../../services/authService'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const navigate = useNavigate();
    try {
      // Call the logout function from authService
      const response = await logout();

      if (response.status === 200) {
        console.log('Successfully logged out');
        // Clear local storage or cookies here if needed
        localStorage.removeItem('user'); // Example, replace with your logic
        localStorage.removeItem('token'); // Example, replace with your logic
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Error logging out:', response.message);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error.message);
    } finally {
      handleMenuClose();
    }
  };


  return (
    <Stack
      direction='row'
      alignItems='center'
      p={1}
      sx={{ position: 'sticky', background: '#000', justifyContent: 'space-between', top: '0', zIndex: 2 }}
    >
      <Link to='/' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <img src={logo} height={50} style={{ marginLeft: '55px' }} />
        <Typography
          variant='h6'
          sx={{
            color: 'white',
            fontSize: { xs: '0px', md: '30px' },
            lineHeight: '30px',
            marginLeft: '5px',
            marginTop: '10px',
            visibility: { xs: 'hidden', md: 'visible' },
          }}
        >
          TrendyTube
        </Typography>
      </Link>
      <SearchBar />
      <div>
        <IconButton
          onClick={handleMenuOpen}
          sx={{ color: 'white' }}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </Stack>
  );
};

export default Navbar;
