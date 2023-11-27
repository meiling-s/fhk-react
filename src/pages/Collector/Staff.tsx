import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import RequestForm from '../../components/FormComponents/RequestForm';
import { useLocation } from 'react-router-dom';

const Staff = () => {
  const location = useLocation();
  const stateData = location.state;


  return (
   <Box>{stateData}</Box>
  );
};

export default Staff;