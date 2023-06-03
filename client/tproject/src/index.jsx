import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import pages
import App from './pages/App';
import Test from './pages/Test';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/errors/NotFound';
import AdminRoutes from './pages/admin/AdminRoutes';


import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Navbar } from './components/Navbar';
import { Box } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SnackbarProvider } from 'notistack';
import jwt_decode from "jwt-decode";


// Theme for the website, configure it here
const theme = createTheme({
  palette: {
    primary: {
      main: "#5D8A5C",
    },
    secondary: {
      main: grey[500],
    },
  },
});

// Global context to store and change stuff on the fly
export const UserContext = React.createContext(null);

function MainApp() {
  const location = useLocation();
  // User global context to store the contents of the JWT token
  const [user, setUser] = useState(null);
  // Global context to store if the current page is an admin page
  const [isAdminPage, setIsAdminPage] = useState(false);

  // Try to decode the JWT token in local storage and set the user context to the decoded token
  useEffect(() => {
    try {
      setUser(jwt_decode(localStorage.getItem("token")))
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
        setUser, setUser,
        isAdminPage: isAdminPage,
        setIsAdminPage: setIsAdminPage
      }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <TransitionGroup style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
              <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
                unmountOnExit
              >
                <Routes location={location}>
                  <Route path='*' element={<NotFound />} />
                  <Route path="/" element={<App />} />
                  <Route path="/test" element={<Test />} />
                  <Route path="/login" element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/admin/*' element={<AdminRoutes />} />
                </Routes>
              </CSSTransition>
            </TransitionGroup>
          </Box>
        </Box>


      </UserContext.Provider>

    </>

  )

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
          <MainApp />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
