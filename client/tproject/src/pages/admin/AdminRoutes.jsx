import { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Box, Divider, List } from '@mui/material'
import { useSnackbar } from 'notistack'

import NotFound from '../errors/NotFound'
import Test from '../Test'
import ViewUsers from './users/ViewUsers'
import CreateUser from './users/CreateUser'
import CreateLocation from './locations/CreateLocation'
import ViewLocations from './locations/ViewLocations'
import ViewSpecificLocation from './locations/ViewSpecificLocation'
import EditLocation from './locations/EditLocation'
import EditUser from './users/EditUser'
import ViewProducts from './products/ViewProducts'
import CreateProduct from './products/CreateProduct'
import EditProduct from './products/EditProduct'
import BicycleAdmin from './bicycle/BicycleAdmin'
import ViewBicycle from './bicycle/ViewBicycle'
import AddBicycle from './bicycle/AddBicycle'
import EditBicycle from './bicycle/EditBicycle'
import CreateArticle from './support/CreateArticle'
import ViewHelpArticles from './support/ViewHelpArticles'
import EditHelpArticle from './support/EditHelpArticle'
import ViewTickets from './support/ViewTickets'
import ViewTicket from './support/ViewTicket'

// Driver 

import ViewDriverApplications from './driver/ViewDriverApplications'
import EditDriverApplication from './driver/EditDriverApplication'
import ViewDrivers from './driver/ViewDrivers'

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
                <Route path="/locations/view" element={<ViewLocations />} />
                <Route path="/locations/:id" element={<ViewSpecificLocation />} />
                <Route path="/locations/create" element={<CreateLocation />} />
                <Route path="/locations/edit/:id" element={<EditLocation />} />
                <Route path="/users/:id" element={<EditUser />} />
                <Route path="/products" element= {<ViewProducts />}/>
                <Route path="/products/create" element= {<CreateProduct />}/>
                <Route path="/products/:id" element= {<EditProduct />}/>
                <Route path="/bicycle" element={<BicycleAdmin />} />
                <Route path="/bicycle/view" element={<ViewBicycle />} />
                <Route path="/bicycle/add" element={<AddBicycle />} />
                <Route path="/bicycle/:id" element={<EditBicycle />} />


                {/* Driver Paths */}
                <Route path="/driver/viewDriverApplications" element={<ViewDriverApplications />} />
                <Route path="/driver/EditDriverApplication/:id" element={<EditDriverApplication />} />
                <Route path="/driver/viewDrivers" element={<ViewDrivers />} />

                {/* Support Paths */}
                <Route path="/support/article/create" element={<CreateArticle />} />
                <Route path="/support/article/" element={<ViewHelpArticles />} />
                <Route path="/support/article/:id" element={<EditHelpArticle />} />
                <Route path="/support/ticket" element={<ViewTickets />} />
                <Route path="/support/ticket/:id" element={<ViewTicket />} />

            </Routes>

        </Box>

    )
}

export default AdminRoutes