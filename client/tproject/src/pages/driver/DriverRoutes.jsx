import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { useSnackbar } from 'notistack'
import { validateUser } from '../../functions/user'
import NotFound from '../errors/NotFound'
import DriverRegister from './DriverRegister'
import DriverDashboard from './DriverDashboard'
import DriverRouting from './DriverRouting'


function ProfileRoutes() {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" })
            return navigate("/login")
        }
        
    }, [])

    return (
        
        <>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/register" element={<DriverRegister />} />
                <Route path="/dashboard" element={<DriverDashboard />} />
                <Route path="/routes" element={<DriverRouting />} />
            </Routes>
        </>
    )
}

export default ProfileRoutes