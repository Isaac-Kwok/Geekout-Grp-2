import React from 'react'
import { Box, Typography } from '@mui/material'

function PageTitle(props) {
    return (
        <Box margin={"3rem"} textAlign={"center"}>
            <Typography variant="h3" fontWeight={700} mb={"0.5rem"}>{props.title}</Typography>
            {props.subtitle && <Typography variant="h5" fontWeight={500} color={"yellow.dark"}>{props.subtitle}</Typography>}
        </Box>
    )
}

export default PageTitle