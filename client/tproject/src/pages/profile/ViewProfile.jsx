import React, { useState, useEffect } from 'react'
import { Container, Box, Card, CardContent, CardActions, Typography, Button, Stack } from '@mui/material'
import ProfilePicture from '../../components/ProfilePicture'
import CardTitle from '../../components/CardTitle'
import http from '../../http'
import { useSnackbar } from 'notistack'

import BadgeIcon from '@mui/icons-material/Badge';

function ViewProfile() {
    const [user, setUser] = useState(null)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        http.get("/user").then((res) => {
            setUser(res.data)
        }).catch((err) => {
            enqueueSnackbar(err.response.data.message, { variant: "error" })
        })
    }, [])

    return (
        <>
            <Card>
                <CardContent>
                    <CardTitle icon={<BadgeIcon />} title="Profile Information" />
                </CardContent>
            </Card>
        </>
    )
}

export default ViewProfile