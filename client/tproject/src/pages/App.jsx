import {Button, Container, Stack, Divider} from '@mui/material';
import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '..';
function App() {
  const { setIsAdminPage } = useContext(UserContext);
  useEffect(() => {
    document.title = "Home - EnviroGo";
    setIsAdminPage(false);
  }, []);
  return (
    <Container maxWidth="xl">
      <h1>Home</h1>
      <p>Welcome to the home page. This website is currently under testing. There are some buttons below to navigate between pages</p>
      <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <Button variant="contained" color="primary" LinkComponent={Link} to="/login">Login</Button>
        <Button variant="contained" color="primary" LinkComponent={Link} to="/test">Test</Button>
        <Button variant="contained" color="primary" LinkComponent={Link} to="/admin/">Admin Test</Button>
      </Stack>
    </Container>
  );
}

export default App;
