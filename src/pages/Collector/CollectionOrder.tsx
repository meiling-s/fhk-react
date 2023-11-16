import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react'
import { styles } from '../../constants/styles'

const CollectionOrder = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{display:'flex',alignItems:'center',mb:'4+-0px'}}>
    <Typography fontSize={20} color='black' fontWeight='bold'>{t("collection_Order")}</Typography>
    <Button
      onClick={() => navigate("/collector/createCollectionPoint")}
      sx={{
        borderRadius: "20px",
        backgroundColor: "#79ca25",
        '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
        width:'fit-content',
        height: "40px",
        marginLeft:'20px'
      }}
      variant='contained'>
        + {t("col.create")}
    </Button>
  </Box>
  )
}

export default CollectionOrder
