import { AppBar, Toolbar, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';

function Test() {
  return (
    <Box>
        <AppBar>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Hello World</Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    </Box>
  );
}

export default Test;
