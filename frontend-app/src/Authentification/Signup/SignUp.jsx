import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authService'; // Import du service signUp
import { getRegions } from "../../services/videoService"; // Import de la fonction getRegions
import logo from '../../UserPart/components/logo.svg';

// Création du thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#bf2904', // Couleur personnalisée pour les boutons et le focus des champs
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#bf2904', // Couleur personnalisée pour la bordure en focus
            },
          },
        },
      },
    },
  },
});

export default function SignUp() {
  const navigate = useNavigate();

  // État pour gérer la visibilité du mot de passe
  const [showPassword, setShowPassword] = React.useState(false);

  // État pour gérer les messages d'erreur
  const [errorMessage, setErrorMessage] = React.useState('');

  // États pour gérer les régions
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState("");
  const [regions, setRegions] = React.useState([]);

  // useEffect pour récupérer les régions depuis le backend au montage du composant
  React.useEffect(() => {
    console.log("Fetching regions...");
    getRegions()
        .then((data) => {
          setRegions(data);
          console.log("Regions fetched successfully:", data);
        })
        .catch((error) => {
          console.error("Error fetching regions:", error);
        });
  }, []);

  // Fonction pour gérer la sélection d'une région
  const handleRegionSelect = (regionCode) => {
    console.log("Region selected:", regionCode);
    setSelectedRegion(regionCode);
    setAnchorEl(null);
  };

  // Fonction pour ouvrir le menu des régions
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("Menu opened:", event.currentTarget);
  };

  // Fonction pour afficher ou masquer le mot de passe
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Fonction pour valider le mot de passe
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password');

    // Validation du mot de passe
    if (!validatePassword(password)) {
      setErrorMessage('Password must contain at least one number, one special character, one lowercase letter, and one uppercase letter.');
      return;
    }

    // Créer l'objet à envoyer au backend
    const userData = {
      Username: data.get('firstName'),
      Email: data.get('email'),
      Password: password,
      Country: selectedRegion, // Utiliser la région sélectionnée
      Role: {
        Name: 'user', // Rôle par défaut
      }
    };

    // Envoyer les données au backend via axios
    try {
      const response = await signUp(userData);

      if(response.status === 200){
        console.log('Succès:', response.data);
        // Stocker la région sélectionnée dans le localStorage
        localStorage.setItem('defaultRegion', selectedRegion);
        console.log('Région par défaut stockée:', selectedRegion);

        navigate('/login');
      }else{
        setErrorMessage('Email already taken.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to sign up.');
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
                  <TextField
                      required
                      fullWidth
                      id="country"
                      label="Country"
                      name="country"
                      value={selectedRegion} // Utiliser la région sélectionnée
                      onClick={handleMenuOpen}
                      autoComplete="family-name"
                      InputProps={{
                        readOnly: true, // Rendre le champ non modifiable
                      }}
                  />
                  <Menu
                      id="region-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                  >
                    {regions.length > 0 ? (
                        regions.map((region) => (
                            <MenuItem
                                key={region.item1}
                                onClick={() => handleRegionSelect(region.item1)}
                                style={{ color: "black" }}
                            >
                              {region.item2}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No regions available</MenuItem>
                    )}
                  </Menu>
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
                      type={showPassword ? 'text' : 'password'} // Utilisation de l'état pour définir le type
                      id="password"
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
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
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
              Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </ThemeProvider>
  );
}
