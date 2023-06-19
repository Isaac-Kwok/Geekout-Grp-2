import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

function InfoBox(props) {
    return (
        <Box flexGrow={props.flexGrow}>
            <Typography variant="body" fontWeight={700}>{props.title}</Typography>
            <Typography marginTop={"0.25rem"}>
                {props.boolean == null && props.value}
                {props.boolean && <Chip size='small' icon={<CheckIcon/>} label={props.value} color="success" />}
                {props.boolean == false && <Chip size='small' icon={<CloseIcon/>} label={props.value} color="error" />}
            </Typography>
        </Box>
    )
}

export default InfoBox