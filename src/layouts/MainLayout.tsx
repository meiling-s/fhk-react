import React from 'react'
import MainDrawer from './MainDrawer'
import MainAppBar from './MainAppBar'
import { Box, Grid, Typography } from '@mui/material'
import { Outlet, useLoaderData } from 'react-router-dom'


function MainLayout() {

  return (
    <>
      <MainDrawer />
      <MainAppBar/>
      <Box sx={{display:'flex',mt:'64px'}} >
        <Outlet/>
      </Box>
    </>
  )
}

export default MainLayout