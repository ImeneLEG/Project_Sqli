import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authService';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import logo from '../../UserPart/components/logo.svg';
import { getRegions } from '../../services/videoService'; // Import your getRegions function
import FormControl from '@mui/material/FormControl';  // Added import
import InputLabel from '@mui/material/InputLabel';  // Added import
import Select from '@mui/material/Select';  // Added import
import MenuItem from '@mui/material/MenuItem';  // Added import

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#bf2904', // Custom color for buttons and field focus
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#bf2904', // Custom color for focus border
            },
          },
        },
      },
    },
  },
});

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for handling error messages
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    // Fetch regions using the getRegions function from your video service
    const fetchRegions = async () => {
      try {
        const regionsData = await getRegions();
        console.log('Fetched regions:', regionsData); // Log fetched data
        setRegions(regionsData);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };
  
    fetchRegions();
  }, []);
  

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password');

    // Validate password
    if (!validatePassword(password)) {
      setErrorMessage('Password must contain at least one number, one special character, one lowercase letter, and one uppercase letter.');
      return;
    }

    // Create the object to send to the backend
    const userData = {
      Username: data.get('firstName'),
      Email: data.get('email'),
      Password: password,
      Country: data.get('country'),
      Role: {
        Name: 'user', // Default role
      },
    };

    // Send the data to the backend via signUp function
    try {
      const response = await signUp(userData);

      if (response.status === 200) {
        console.log('Success:', response.data);
        navigate('/login');
      } else {
        setErrorMessage('Email already taken.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while signing up.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={logo}
            alt="YouTube Logo"
            style={{ width: 30, height: 30, marginBottom: 8 }}
          />
          <Typography component="h1" variant="h5">
            Sign up to TrendyTube
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {errorMessage}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    id="country"
                    name="country"
                    label="Country"
                  >
                    {regions.map((region) => (
                      <MenuItem key={region.code} value={region.code}>
                        {region.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
