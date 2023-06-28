import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import NotFound from './errors/NotFound'
import Test from './Test'
import App from './App'
import Login from './Login'
import Register from './Register'
import Verify from './Verify'
import Reset from './Reset'
import ProfileRoutes from './profile/ProfileRoutes'
import DriverRoutes from './driver/DriverRoutes'

import { UserContext } from '..'

function UserRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setIsAdminPage } = useContext(UserContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        setIsAdminPage(false)
    }, [])
    return (
        <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path="/" element={<App />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={"/"} />} />
            <Route path="/test" element={<Test />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/profile/*" element={<ProfileRoutes />} />
            <Route path="/driver/*" element={<DriverRoutes />} />
        </Routes>
    )
}

export default UserRoutes