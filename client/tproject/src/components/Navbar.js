import { AppBar, Container, Toolbar } from "@mui/material"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

function Navbar() {
    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Hello World</Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar