import { useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import NotFound from '../errors/NotFound'
import Test from '../Test'

import { UserContext } from '../..'

function AdminRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setIsAdminPage } = useContext(UserContext);

    useEffect(() => {
        setIsAdminPage(true)
    }, [])
    return (
        <Routes>
            <Route path='*' element={<NotFound />}  />
            <Route path="/" element={<Test />} />

        </Routes>
    )
}

export default AdminRoutes