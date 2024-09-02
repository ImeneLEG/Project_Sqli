import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { Navbar, Feed, SearchFeed, VideoDetail } from './UserPart/components';
import Login from './Authentification/Login/Login';
import SignUp from './Authentification/SignUp/SignUp';
import AdminDashboard from './AdminPart/AdminDashboard';
import LandingPage from './LandingPage/LandingPage';
import ProtectedRoute from './UserPart/components/ProtectedRoute';
import AdminRoute from './UserPart/components/AdminRoute'; // Import du nouveau composant

const AppWrapper = () => {
  const location = useLocation();

  // Check if the current path is login or signUp
  const shouldShowLayout = location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/admin' && location.pathname !== '/welcome' && location.pathname !== '/login';

  return (
    <>
      {shouldShowLayout ? (
        <Box sx={{ backgroundColor: '#000' }}>
          <Navbar />
          <Routes>
            <Route
              path="/trendingVideos/:userId"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route path="/video/:videoId" exact element={<VideoDetail />} />
            <Route path="/search/:searchTerm" exact element={<SearchFeed />} />
            <Route path="/user" exact element={<Feed />} />
          </Routes>
        </Box>
      ) : (
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path='/admin-dashboard' exact element={ <AdminDashboard />} />
          <Route path="/welcome" exact element={<LandingPage />} />
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
