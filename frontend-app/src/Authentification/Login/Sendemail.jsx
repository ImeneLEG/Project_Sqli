import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import logo from '../../UserPart/components/logo.svg';
import axios from 'axios'; // Import Axios

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
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
      main: '#bf2904', // Custom color for buttons and focus states
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#bf2904', // Custom border color when focused
            },
          },
        },
      },
    },
  },
});

export default function Sendemail() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState(''); // State for success message

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email'); // Get the email from the form data

    try {
      // Make the API call to the backend to request a password reset
      const response = await axios.post('https://localhost:7275/api/auth/request-reset-password', {
        email: email,
      });

      console.log('Success:', response);
      setSuccessMessage('An email for password reset has been sent.'); // Set success message
      setErrorMessage(''); // Clear error message

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to send password reset email. Please try again later.');
      setSuccessMessage(''); // Clear success message
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
            style={{ width: 50, height: 50, marginBottom: 8 }}
          />
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          {successMessage && ( // Display success message
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && ( // Display error message
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {errorMessage}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={20}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>

              <Grid item xs={20}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send Email
                </Button>
              </Grid>
            </Grid>
            
            <Grid container>
              <Grid item xs>
                <Link href="/send-email" variant="body2" sx={{ display: 'none' }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2" sx={{ display: 'none' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ display: 'none' }} />
      </Container>
    </ThemeProvider>
  );
}
