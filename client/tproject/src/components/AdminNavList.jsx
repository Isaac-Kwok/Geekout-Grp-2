import React from 'react'
import { Link } from 'react-router-dom'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import StoreIcon from '@mui/icons-material/Store';
import SupportIcon from '@mui/icons-material/Support';
import LocationOnIcon from '@mui/icons-material/LocationOn';


function AdminNavList() {
    return (
        <>
            <ListItem key={"Users"} disablePadding>
                <ListItemButton component={Link} to="/admin/users">
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary={"Users"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Drivers"} disablePadding>
                <ListItemButton component={Link} to="/admin/driver/viewdriverapplications">
                    <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                    <ListItemText primary={"Drivers"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Bicycles"} disablePadding>
                <ListItemButton component={Link} to="/admin/bicycle">
                    <ListItemIcon><PedalBikeIcon /></ListItemIcon>
                    <ListItemText primary={"Bicycles"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Requests"} disablePadding>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon><RequestQuoteIcon /></ListItemIcon>
                    <ListItemText primary={"Requests"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Shop"} disablePadding>
                <ListItemButton component={Link} to="/admin/products">
                    <ListItemIcon><StoreIcon /></ListItemIcon>
                    <ListItemText primary={"Shop"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Support"} disablePadding>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon><SupportIcon /></ListItemIcon>
                    <ListItemText primary={"Support"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"View Locations"} disablePadding>
                <ListItemButton component={Link} to="/admin/locations/view">
                    <ListItemIcon><LocationOnIcon /></ListItemIcon>
                    <ListItemText primary={"Location"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Create Location"} disablePadding>
                <ListItemButton component={Link} to="/admin/locations/create">
                    <ListItemIcon><LocationOnIcon /></ListItemIcon>
                    <ListItemText primary={"Create Location"} />
                </ListItemButton>
            </ListItem>
        </>
    )
}

export default AdminNavList