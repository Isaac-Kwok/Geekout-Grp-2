import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import pages
import AdminRoutes from './pages/admin/AdminRoutes';
import UserRoutes from './pages/UserRoutes';

import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { grey } from '@mui/material/colors';
import { Navbar } from './components/Navbar';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import jwt_decode from "jwt-decode";
import Footer from './components/Footer';
import http from './http'


let fonts = [
  'Poppins',
  'Nunito',
  'Roboto',
  '"Segoe UI"',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',');

// Theme for the website, configure it here
let theme = createTheme({
  palette: {
    primary: {
      main: "#0f6d51",
    },
    secondary: {
      main: grey[500],
    },
    blue: {
      main: "#0083CA",
    },
    yellow: {
      main: "#faf2e9",
    },
  },
  typography: {
    fontFamily: fonts,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        fontFamily: fonts,
      },
    },
  },
});

theme = responsiveFontSizes(theme);

// Global context to store and change stuff on the fly
export const UserContext = React.createContext(null);

function MainApp() {
  const location = useLocation();
  // User global context to store the contents of the JWT token
  const [user, setUser] = useState(null);
  // Global context to store if the current page is an admin page
  const [isAdminPage, setIsAdminPage] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    try {
      // Request to the server to check if the token is valid
      http.get("auth/refresh").then((res) => {
        // If the token is valid, set the user context to the decoded token
        setUser(res.data.user)
        localStorage.setItem("token", res.data.token)
      }).catch((err) => {
        // If the token is invalid, set the user context to null
        setUser(null)
      })
      console.log("User set")
    } catch {
      setUser(null)
    }
  }, [])

  // Return routes. * is a wildcard for any path that doesn't match the other routes, so it will always return the 404 page
  // /admin/* is a wildcard for any path that starts with /admin/, so it will always return the admin routes. Admin routes is in pages/admin/AdminRoutes.jsx
  return (
    <>
      <UserContext.Provider value={{
        user: user,
        setUser: setUser,
        isAdminPage: isAdminPage,
        setIsAdminPage: setIsAdminPage
      }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Routes location={location}>
              <Route path='*' element={<UserRoutes />} />
              <Route path='/admin/*' element={<AdminRoutes />} />
            </Routes>
          </Box>
          <Footer />
        </Box>


      </UserContext.Provider>

    </>

  )

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
          <MainApp />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
