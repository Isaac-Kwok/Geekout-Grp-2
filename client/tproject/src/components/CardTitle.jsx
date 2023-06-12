import React from 'react'
import { Typography, Stack } from '@mui/material'

function CardTitle(props) {
    return (
        <Stack direction="row" alignItems={"center"} spacing={2}>
            {props.icon}
            <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                {props.title}
            </Typography>
        </Stack>
    )
}

export default CardTitle