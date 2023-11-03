import React from 'react'
import MainDrawer from './MainDrawer'
import MainAppBar from './MainAppBar'
import { Box, Grid, Typography } from '@mui/material'
import { Outlet, useLoaderData } from 'react-router-dom'
import { styles } from '../constants/styles'


function MainLayout() {

  return (
    <>
      <MainDrawer />
      <MainAppBar/>
      <Box sx={styles.innerScreen} >
        <Outlet/>
      </Box>
    </>
  )
}

export default MainLayout