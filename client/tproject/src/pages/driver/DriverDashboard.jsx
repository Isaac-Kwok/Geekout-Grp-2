import React from 'react'
import { Link, Box } from '@mui/material'

function DriverDashboard() {
  return (
    <Box sx={{
      border: 'solid, black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
    <Link href="/driver/routes">Driver routes</Link>
    </Box>
  )
}

export default DriverDashboard