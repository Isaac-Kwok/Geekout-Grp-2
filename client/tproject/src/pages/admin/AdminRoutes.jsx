import { useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'

import NotFound from '../errors/NotFound'
import Test from '../Test'

import { UserContext } from '../..'
import AdminNavList from '../../components/AdminNavList'

function AdminRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setIsAdminPage } = useContext(UserContext);

    useEffect(() => {
        setIsAdminPage(true)
    }, [])
    return (
        <Box sx={{ display: "flex", flexGrow: 1 }}>
            <Box sx={{ display: ["none", "none", "flex"] }}>
                <List sx={{ width: "250px" }}>
                    <AdminNavList />
                </List>
                <Divider orientation="vertical" flexItem />
            </Box>
            <Routes>
                <Route path='*' element={<NotFound />} />
                <Route path="/" element={<Test />} />
            </Routes>
        </Box>

    )
}

export default AdminRoutes