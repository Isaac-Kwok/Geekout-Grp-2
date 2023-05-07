import { AppBar, Container, Toolbar } from "@mui/material"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Transport Project</Typography>
                    <Button LinkComponent={Link} variant="text" color="inherit" to="/login">Login</Button>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar