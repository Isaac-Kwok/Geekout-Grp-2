import { useState, useContext } from "react"
import { AppBar, Box, Container, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Typography, SwipeableDrawer, Divider } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import HomeIcon from "@mui/icons-material/Home"
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StoreIcon from '@mui/icons-material/Store';
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import { UserContext } from ".."
import { NavbarProfile } from "./NavbarProfile";

export function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const { user, setUser } = useContext(UserContext);

    return (
        <>
            <Container maxWidth="xl" sx={{ marginTop: ["1rem", "2rem"], marginBottom: ["1rem", "2rem"] }}>
                <AppBar position="sticky" sx={{ borderRadius: "0.5rem" }}>
                    <Toolbar>
                        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                            <IconButton color="inherit" sx={{ marginRight: "1rem", display: ["flex", "flex", "none"] }} onClick={() => setIsDrawerOpen(true)}><MenuIcon /></IconButton>
                            <Typography variant="h6" component="div" sx={{ marginRight: "1rem" }}>EnviroGo</Typography>
                            <Box sx={{ display: ["none", "none", "initial"] }}>
                                <Button LinkComponent={Link} variant="text" color="inherit" to="/">Home</Button>
                                <Button LinkComponent={Link} variant="text" color="inherit" to="/login">Car</Button>
                                <Button LinkComponent={Link} variant="text" color="inherit" to="/login">Bicycles</Button>
                                <Button LinkComponent={Link} variant="text" color="inherit" to="/login">Shop</Button>
                            </Box>
                        </Box>
                        {!user && <Button LinkComponent={Link} variant="text" color="inherit" to="/login">Login</Button>}
                        {user && <NavbarProfile />}
                    </Toolbar>
                </AppBar>
            </Container>
            <SwipeableDrawer
                anchor={"left"}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <List sx={{ width: "250px" }}>
                    <ListItem key={"Home"}>
                        <Typography fontWeight={700}>Navigation Menu</Typography>
                    </ListItem>
                    <Divider/>
                    <ListItem key={"Home"} disablePadding>
                        <ListItemButton component={Link} to="/" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Car"} disablePadding>
                        <ListItemButton component={Link} to="/" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                            <ListItemText primary={"Car"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Bicycle"} disablePadding>
                        <ListItemButton component={Link} to="/" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><DirectionsBikeIcon /></ListItemIcon>
                            <ListItemText primary={"Bicycles"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Shop"} disablePadding>
                        <ListItemButton component={Link} to="/" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><StoreIcon /></ListItemIcon>
                            <ListItemText primary={"Shop"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </SwipeableDrawer>
        </>


    )
}