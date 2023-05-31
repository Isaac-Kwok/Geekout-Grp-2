import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import pages
import App from './pages/App';
import Test from './pages/Test';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/errors/NotFound';


import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Navbar from './components/Navbar';
import { Typography, Box } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SnackbarProvider } from 'notistack';


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


function MainApp() {
  const location = useLocation();
  
  return (
    <>
      <Navbar />
      <TransitionGroup>
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
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </>
    
  )
    
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Typography>
        <BrowserRouter>
          <SnackbarProvider maxSnack={3}>
            <MainApp/>
          </SnackbarProvider>
        </BrowserRouter>
      </Typography>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
