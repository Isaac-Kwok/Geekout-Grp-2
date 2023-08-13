import React, { useEffect } from 'react'
import { validateUser } from '../../functions/user'
import { useSnackbar } from 'notistack'
import { Routes, Route, useNavigate } from 'react-router-dom'
import CreateRideRequest from './CreateRideRequest'
import ViewRideRequests from './ViewRideRequests'
import EditRideRequests from './EditRideRequests'
import ViewSpecificRequest from './ViewSpecificRequest'
import CreateLocationRequest from './CreateLocationRequest'
import CreateRideRating from '../riderating/CreateRideRating'
import ViewAllRatings from '../riderating/ViewAllRatings'

function RiderRoutes() {
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()

    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" })
            return navigate("/login")
        }
    }, [])

    return (
        <Routes>
            <Route path="/create" element={<CreateRideRequest />} />
            <Route path="/myrequests/" element={<ViewRideRequests />} />
            <Route path="/:userId/update/:id" element={<EditRideRequests />} />
            <Route path="/myrequests/:userId/:requestId" element={<ViewSpecificRequest />} />
            <Route path="/:userId/requestnewpickup/" element={<CreateLocationRequest />} />
            <Route path="/completed/rate/user/:userId/request/:requestId" element={<CreateRideRating />} />
            <Route path="/completed/viewRating/:userId" element={<ViewAllRatings />} />
        </Routes>
    )
}

export default RiderRoutes