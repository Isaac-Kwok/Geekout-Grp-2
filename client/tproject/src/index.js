import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import pages
import App from './pages/App';
import Test from './pages/Test';
import Login from './pages/Login';
import NotFound from './pages/errors/NotFound';


import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Navbar from './components/Navbar';
import { Typography, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[500],
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Typography>
        <BrowserRouter>
          <Navbar />
          <Box sx={{ height: 16 }} />
          <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path="/" element={<App />} />
            <Route path="/test" element={<Test />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </Typography>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
