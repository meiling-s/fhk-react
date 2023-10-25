import React from 'react'
import MainDrawer from './MainDrawer'
import MainAppBar from './MainAppBar'
import { Box, Grid, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'


const MainLayout = () => {
  
    

  return (
    <>
    <MainDrawer/>
    <MainAppBar/>
    <Box sx={{display:'flex',bgcolor:'black',mt:'64px'}} >
    <Outlet/>
    </Box>
    </>
  )
}

export default MainLayout