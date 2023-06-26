import React from 'react'
import { Link } from 'react-router-dom'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import StoreIcon from '@mui/icons-material/Store';
import SupportIcon from '@mui/icons-material/Support';


function AdminNavList() {
    return (
        <>
            <ListItem key={"Users"} disablePadding>
                <ListItemButton component={Link} to="/admin/users">
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary={"Users"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"Vehicles"} disablePadding>
                <ListItemButton component={Link} to="/">
                    <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                    <ListItemText primary={"Vehicles"} />
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
                <ListItemButton component={Link} to="/">
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
        </>
    )
}

export default AdminNavList