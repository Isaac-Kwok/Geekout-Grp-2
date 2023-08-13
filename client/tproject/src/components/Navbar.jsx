import { useState, useContext } from "react"
import { AppBar, Box, Container, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Typography, Divider, Drawer, Stack, Button } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import HomeIcon from "@mui/icons-material/Home"
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StoreIcon from '@mui/icons-material/Store';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from "react-router-dom"
import { UserContext } from ".."
import { NavbarProfile } from "./NavbarProfile";
import AdminNavList from "./AdminNavList";

export function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false)
    const { user, isAdminPage } = useContext(UserContext);

    return (
        <>
            {!isAdminPage &&
                <Container maxWidth="xl" sx={{ marginTop: ["1rem", "2rem"], position: "sticky", top: ["1rem", "2rem"], zIndex:999 }}>
                    <AppBar position="sticky" sx={{ borderRadius: "0.5rem" }}>
                        <Toolbar>
                            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                                <IconButton color="inherit" sx={{ marginRight: "1rem", display: ["flex", "flex", "none"] }} onClick={() => setIsDrawerOpen(true)}><MenuIcon /></IconButton>
                                {/* <Typography variant="h6" component="div" sx={{ marginRight: "1rem", fontFamily: "'caveat brush'" }}>EnviroGo</Typography> */}
                                <Button color="inherit" variant="text" LinkComponent={Link} to="/" sx={{ marginRight: "1rem", fontFamily: "'caveat brush'", textTransform: "none", fontSize: "18px", padding: "0" }}>EnviroGo</Button>
                                <Divider orientation="vertical" flexItem sx={{ marginRight: "1rem", display: ["none", "none", "flex"] }} />
                                <Stack spacing={2} direction="row" sx={{ display: ["none", "none", "flex"] }}>
                                    <Button startIcon={<HomeIcon/>} LinkComponent={Link} variant="text" color="inherit" to="/">Home</Button>
                                    <Button startIcon={<DirectionsCarIcon/>} LinkComponent={Link} variant="text" color="inherit" to="/riderequests/myrequests">Car</Button>
                                    <Button startIcon={<DirectionsBikeIcon/>} LinkComponent={Link} variant="text" color="inherit" to="/bicycle">Bicycles</Button>
                                    <Button startIcon={<StoreIcon/>} LinkComponent={Link} variant="text" color="inherit" to="/products">Shop</Button>
                                </Stack>
                            </Box>
                            {!user && <Button LinkComponent={Link} variant="text" color="inherit" to="/login" startIcon={<LoginIcon/>}>Login</Button>}
                            {user && <NavbarProfile />}
                        </Toolbar>
                    </AppBar>
                </Container>
            }
            {isAdminPage &&
                <AppBar position="sticky" sx={{zIndex:999}}>
                    <Toolbar>
                        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                            <IconButton color="inherit" sx={{ marginRight: "1rem", display: ["flex", "flex", "none"] }} onClick={() => setIsAdminDrawerOpen(true)}><MenuIcon /></IconButton>
                            <Button color="inherit" variant="text" LinkComponent={Link} to="/" sx={{ marginRight: "1rem", fontFamily: "'caveat brush'", textTransform: "none", fontSize: "18px", padding: "0" }}>EnviroGo</Button>
                            <Divider orientation="vertical" flexItem sx={{ marginRight: "1rem" }} />
                            <Typography variant="h6" component="div" sx={{ marginRight: "1rem" }}>Admin Panel</Typography>
                        </Box>
                        {user && <NavbarProfile />}
                    </Toolbar>
                </AppBar>
            }

            <Drawer
                anchor={"left"}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <List sx={{ width: "250px" }}>
                    <ListItem key={"Home"}>
                        <Typography fontWeight={700}>Navigation Menu</Typography>
                    </ListItem>
                    <Divider sx={{marginBottom: 1}} />
                    <ListItem key={"Home"} disablePadding>
                        <ListItemButton component={Link} to="/" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Car"} disablePadding>
                        <ListItemButton component={Link} to="/riderequests/myrequests" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                            <ListItemText primary={"Car"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Bicycle"} disablePadding>
                        <ListItemButton component={Link} to="/bicycle" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><DirectionsBikeIcon /></ListItemIcon>
                            <ListItemText primary={"Bicycles"} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"Shop"} disablePadding>
                        <ListItemButton component={Link} to="/products" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><StoreIcon /></ListItemIcon>
                            <ListItemText primary={"Shop"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Drawer anchor={"left"} open={isAdminDrawerOpen} onClose={() => setIsAdminDrawerOpen(false)} variant="temporary">
                <List sx={{ width: "250px" }}>
                    <ListItem key={"Home"}>
                        <Typography fontWeight={700}>Admin Navigation</Typography>
                    </ListItem>
                    <Divider sx={{marginBottom: 1}} />
                    <AdminNavList />
                </List>
            </Drawer>
        </>


    )
}