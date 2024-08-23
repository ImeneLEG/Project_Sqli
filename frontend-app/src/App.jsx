import React from 'react'
import { BrowserRouter,Routes,Route , useLocation  } from 'react-router-dom'
import {Box} from '@mui/material'

import {Navbar,Feed,SearchFeed,VideoDetail} from './UserPart/components';
import Login from './Authentification/Login/Login';
import SignUp from './Authentification/SignUp/SignUp';
import Admin from './AdminPart/Admin';


const AppWrapper = () => {
  const location = useLocation();

  // Check if the current path is login or signUp
  const shouldShowLayout = location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/admin';

  return (
    <>
      {shouldShowLayout ? (
        <Box sx={{ backgroundColor: '#000' }}>
          <Navbar />
          <Routes>
            <Route path='/user' exact element={<Feed />} />
            <Route path='/video/:id' exact element={<VideoDetail />} />
            <Route path='/search/:searchTerm' exact element={<SearchFeed />} />
            
          </Routes>
        </Box>
      ) : (
        <Routes>
          <Route path='/login' exact element={<Login />} />
          <Route path='/signup' exact element={<SignUp />} />
          <Route path='/admin' exact element={<Admin />} />
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