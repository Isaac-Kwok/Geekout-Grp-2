import { useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import NotFound from './errors/NotFound'
import Test from './Test'
import App from './App'
import Login from './Login'
import Register from './Register'

import { UserContext } from '..'

function UserRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setIsAdminPage } = useContext(UserContext);

    useEffect(() => {
        setIsAdminPage(false)
    }, [])
    return (
        <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path="/" element={<App />} />
            <Route path="/test" element={<Test />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}

export default UserRoutes