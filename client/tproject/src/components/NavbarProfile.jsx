import { useState, useContext } from "react";
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Avatar, Popover, Divider, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { stringAvatar } from "../functions/stringAvatar";
import { UserContext } from "..";


import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import { enqueueSnackbar } from "notistack";

export function NavbarProfile(props) {
    const { user, setUser } = useContext(UserContext);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const navigate = useNavigate()

    function handlePopoverOpen(event) {
        setAnchorEl(event.currentTarget);
        setIsPopoverOpen(true);
    }

    function handleLogout() {
        setIsPopoverOpen(false)
        localStorage.setItem("token", null)
        setUser(null)
        enqueueSnackbar("Successfully logged out", { variant: "success" })
        navigate("/")
    }

    return (
        <>
            <IconButton onClick={(e) => handlePopoverOpen(e)}>
                <Avatar {...stringAvatar(user.name)} />
            </IconButton>
            <Popover
                id={"userPopover"}
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={() => setIsPopoverOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    horizontal: 'right',
                }}
            >
                <Box sx={{ margin: "1rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar {...stringAvatar(user.name)} sx={{ marginRight: "1rem" }} />
                        <Box>
                            <Typography variant="subtitle1">{user.name}</Typography>
                            <Typography variant="body2">{user.email}</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ marginY: "1rem" }} />
                    <List>
                        <ListItem key={"My Profile"} disablePadding>
                            <ListItemButton component={Link} to="/" onClick={() => setIsPopoverOpen(false)}>
                                <ListItemIcon><PersonIcon /></ListItemIcon>
                                <ListItemText primary={"My Profile"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={"Driver's Dashboard"} disablePadding>
                            <ListItemButton component={Link} to="/" onClick={() => setIsPopoverOpen(false)}>
                                <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                                <ListItemText primary={"Driver's Dashboard"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={"Admin Panel"} disablePadding>
                            <ListItemButton component={Link} to="/" onClick={() => setIsPopoverOpen(false)}>
                                <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                                <ListItemText primary={"Admin Panel"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={"Logout"} disablePadding>
                            <ListItemButton onClick={() => handleLogout()}>
                                <ListItemIcon><LogoutIcon /></ListItemIcon>
                                <ListItemText primary={"Logout"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Popover>
        </>
    )
}