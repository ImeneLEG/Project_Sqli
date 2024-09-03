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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import logo from './logo.svg';
import SearchBar from './SearchBar';
import { logout, getCurrentUser } from '../../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    getCurrentUser()
        .then((data) => {
          setUserName(data.username);
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
    logout();
    localStorage.removeItem('token');
    setOpenLogoutDialog(false);
    navigate('./login');
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

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
                  width: '200px',
                  padding: '10px'
                }
              }}
          >
            <MenuItem>
              <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Nerko One", cursive',
                    fontWeight: 500,
                    color: 'red',
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
            PaperProps={{
              sx: {
                borderRadius: '20px',
                padding: '20px',
                maxWidth: '400px',
                background: 'linear-gradient(135deg, #FF6B6B, #D7AF07)',
                color: '#fff',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)',
              }
            }}
        >
          <DialogTitle id="logout-dialog-title" sx={{ textAlign: 'center', fontFamily: '"Nerko One", cursive', fontSize: '24px' }}>
            <ExitToAppIcon sx={{ color: '#f60000', fontSize: '40px', verticalAlign: 'middle', marginBottom: '10px' }} />
            <br />
            Confirm Logout
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <WarningAmberIcon sx={{ color: '#f80000', fontSize: '80px', marginBottom: '20px' }} />
            <DialogContentText sx={{ fontFamily: '"Matemasie", sans-serif', fontSize: '18px', color: '#fff' }}>
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
                onClick={handleLogoutCancel}
                sx={{
                  fontFamily: '"Matemasie", sans-serif',
                  backgroundColor: '#fff',
                  color: '#FF6B6B',
                  borderRadius: '50px',
                  padding: '10px 20px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#d60000',
                    color: '#fff',
                  }
                }}
            >
              Cancel
            </Button>
            <Button
                onClick={handleLogoutConfirm}
                sx={{
                  fontFamily: '"Matemasie", sans-serif',
                  backgroundColor: '#e60000',
                  color: '#fff',
                  borderRadius: '50px',
                  padding: '10px 20px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#810707',
                    color: '#fff',
                  }
                }}
                startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
  );
};

export default Navbar;
