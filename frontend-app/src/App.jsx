import React from 'react'
import { BrowserRouter,Routes,Route , useLocation  } from 'react-router-dom'
import {Box} from '@mui/material'

import {Navbar,Feed,SearchFeed,VideoDetail} from './UserPart/components';
import Login from './Authentification/Login/Login';
import SignUp from './Authentification/SignUp/SignUp';
import Admin from './AdminPart/Admin';
import LandingPage from './LandingPage/LandingPage';
import ProtectedRoute from './UserPart/components/ProtectedRoute';
import ResetPassword from './Authentification/Login/ResetPassword';
import Sendemail from './Authentification/Login/Sendemail';


const AppWrapper = () => {
  const location = useLocation();

  // Check if the current path is login or signUp
  const shouldShowLayout = !['/', '/signup', '/admin', '/welcome', '/login', '/send-email'].includes(location.pathname) && !location.pathname.startsWith('/reset-password');

  return (
    <>
      {shouldShowLayout ? (
        <Box sx={{ backgroundColor: '#000' }}>
          <Navbar />
          <Routes>
            <Route path="/trendingVideos/:userId" element={
                          <ProtectedRoute>
                            <Feed />
                          </ProtectedRoute>} />
            <Route path='/video/:videoId' exact element={<VideoDetail />} />
            <Route path='/search/:searchTerm' exact element={<SearchFeed />} />
            <Route path='/user' exact element={<Feed />} />

          </Routes>
        </Box>
      ) : (
        <Routes>
          <Route path='/' exact element={<Login />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/signup' exact element={<SignUp />} />
          <Route path='/admin' exact element={<Admin />} />
          <Route path='/welcome' exact element={<LandingPage />}/>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/send-email" element={<Sendemail />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default App;