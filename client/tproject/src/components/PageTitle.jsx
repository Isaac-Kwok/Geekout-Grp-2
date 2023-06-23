import React from 'react'
import { Box, Typography } from '@mui/material'

function PageTitle(props) {
    return (
        <Box margin={"3rem"} textAlign={"center"}>
            <Typography variant="h3" fontWeight={700}>{props.title}</Typography>
            {props.subtitle && <Typography variant="h5" fontWeight={500} color={"yellow.main"}>{props.subtitle}</Typography>}
        </Box>
    )
}

export default PageTitle