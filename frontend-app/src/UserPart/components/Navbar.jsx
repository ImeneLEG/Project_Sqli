import React, { useState } from 'react';
import { Stack, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import SearchBar from './SearchBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {logout} from '../../services/authService'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('Logged out');
    logout();
    localStorage.removeItem('token');
    navigate('./login');
    handleMenuClose();
  };

    return (
        <Stack
            direction='row'
            alignItems='center'
            p={1}
            sx={{ position: 'sticky', background: '#000', justifyContent: 'space-between', top: '0', zIndex: 2 }}
        >
            <Link to='#' style={{ display: 'flex', justifyContent: 'space-between' }}>
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

            {/* This Box will help align the search bar and user icon to the right */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                {/* Added margin-right to the search bar */}
                <SearchBar sx={{ marginRight: '20px', maxWidth: '400px', width: '100%' }} />
                {/* Added margin-left to the user icon */}
                <IconButton
                    onClick={handleMenuOpen}
                    sx={{ color: 'white', fontSize: '2rem', marginLeft: '10px' }} // Added margin-left to the icon
                >
                    <AccountCircleIcon fontSize="large" />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Box>
        </Stack>
    );
};

export default Navbar;
