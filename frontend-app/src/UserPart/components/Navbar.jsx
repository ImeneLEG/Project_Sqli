import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from './logo.svg';
import SearchBar from './SearchBar';
import { logout, getCurrentUser } from '../../services/authService';

<link href="https://fonts.googleapis.com/css2?family=Matemasie&family=Nerko+One&display=swap" rel="stylesheet"></link>

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Fetch current user information
    getCurrentUser()
      .then((data) => {
        setUserName(data.username);
        console.log("Current user fetched successfully:", data);

        if (data.country) {
          console.log("Région de l'utilisateur:", data.country);
        }
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    handleMenuClose();
  };

  const handleLogoutConfirm = () => {
    logout(); // Call the logout function from your auth service
    localStorage.removeItem('token'); // Remove token from local storage
    setOpenLogoutDialog(false);
    navigate('./login'); // Redirect to login page
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  // Function to capitalize the first letter of the username
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    
    <Stack
      direction='row'
      alignItems='center'
      p={1}
      sx={{ position: 'sticky', background: '#000', justifyContent: 'space-between', top: '0', zIndex: 2 }}
    >
      <Link to='#' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <img src={logo} height={50} style={{ marginLeft: '55px' }} alt="logo" />
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

      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <SearchBar sx={{ marginRight: '20px', maxWidth: '400px', width: '100%' }} />
        <IconButton
          onClick={handleMenuOpen}
          sx={{ color: 'white', fontSize: '2rem', marginLeft: '10px' }}
        >
          <AccountCircleIcon fontSize="large" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              width: '200px', // Increase width
              padding: '10px' // Add padding to make the menu more spacious
            }
          }}
        >
          <MenuItem>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Nerko One", cursive',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  color: '#e06767',
                  opacity: 1,
                  marginBottom: '20px'
              }}
            >
              Hi👋 {capitalizeFirstLetter(userName)}!
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogoutClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="secondary" startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Navbar;
