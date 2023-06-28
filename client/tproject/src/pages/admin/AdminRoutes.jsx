import { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Box, Divider, List } from '@mui/material'
import { useSnackbar } from 'notistack'

import NotFound from '../errors/NotFound'
import Test from '../Test'
import ViewUsers from './users/ViewUsers'
import CreateUser from './users/CreateUser'
import EditUser from './users/EditUser'
import BicycleAdmin from './BicycleAdmin'
import ViewBicycle from './ViewBicycle'

import { UserContext } from '../..'
import AdminNavList from '../../components/AdminNavList'
import { validateAdmin } from '../../functions/user'

function AdminRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setIsAdminPage } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        setIsAdminPage(true)
        if (!validateAdmin()) {
            enqueueSnackbar("You must be an admin to view this page", { variant: "error" });
            navigate("/")
        }
    }, [])

    return (
        <Box sx={{ display: "flex", flexGrow: 1, flexWrap: 1 }}>
            <Box sx={{ display: ["none", "none", "flex"] }}>
                <List sx={{ width: "250px", height: "fit-content", position: "sticky", top: 64 }}>
                    <AdminNavList />
                </List>
                <Divider orientation="vertical" flexItem />
            </Box>
            <Routes>
                <Route path='*' element={<NotFound />} />
                <Route path="/" element={<Test />} />
                <Route path="/users" element={<ViewUsers />} />
                <Route path="/users/create" element={<CreateUser />} />
                <Route path="/users/:id" element={<EditUser />} />
                <Route path="/bicycle" element={<BicycleAdmin />} />
                <Route path="/bicycletest" element={<ViewBicycle />} />

            </Routes>

        </Box>

    )
}

export default AdminRoutes