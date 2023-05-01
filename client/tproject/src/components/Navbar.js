import { AppBar, Toolbar } from "@mui/material"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

function Navbar() {
    return (
        <AppBar>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Hello World</Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar