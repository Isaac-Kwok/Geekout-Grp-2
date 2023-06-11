import React from 'react'
import { Container, Typography, Divider } from '@mui/material'

function Footer() {
    return (
        <>
            <Divider />
            <Container maxWidth="xl" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    EnviroGo - 2023 - Full Stack Development Group 1
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    The footer is not final, it will be updated later
                </Typography>
            </Container>
        </>
    )
}

export default Footer