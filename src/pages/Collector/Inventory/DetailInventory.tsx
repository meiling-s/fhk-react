import {
  Box,
  Grid,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { styles } from '../../../constants/styles'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import { InventoryItem, InventoryDetail as InvDetails} from '../../../interfaces/inventory'
import { format } from "../../../constants/constant";
import dayjs from 'dayjs'

import { useTranslation } from 'react-i18next'

interface InventoryDetailProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedRow?: InventoryItem | null
}

const InventoryDetail: FunctionComponent<InventoryDetailProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectedRow
}) => {
  const { t } = useTranslation()
  console.log("selectedRow", selectedRow)
  const fieldItem = [
    {
      label: t('inventory.date'),
      value: selectedRow ? dayjs(new Date(selectedRow?.createdAt)).format(format.dateFormat1) : "-"
    },
    {
      label: t('inventory.recycType'),
      value: selectedRow?.recycTypeId
    },
    {
      label: t('inventory.recyleSubType'),
      value: selectedRow?.recycSubTypeId
    },
    {
      label: t('inventory.recyclingNumber'),
      value: selectedRow?.unitId
    },
    {
      label: t('inventory.inventoryLocation'),
      value: '-'
    },
    {
      label: t('inventory.weight'),
      value: `${selectedRow?.weight} kg`
    }
  ]

  useEffect(() => {}, [selectedRow])

  return (
    <>
      <div className="detail-inventory">
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={'none'}
          headerProps={{
            title: t('top_menu.add_new'),
            subTitle: t('vehicle.vehicleType'),
            onCloseHeader: handleDrawerClose
          }}
        >
          <Divider />
          <Box sx={{ PaddingX: 2 }}>
            <Grid
              container
              direction={'column'}
              spacing={4}
              sx={{
                width: { xs: '100%' },
                marginTop: { sm: 2, xs: 6 },
                marginLeft: {
                  xs: 0
                },
                paddingRight: 2
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid item>
                <Box>
                  <Typography sx={styles.header2}>
                    {t('pick_up_order.item.shipping_info')}
                  </Typography>
                </Box>
              </Grid>
              {fieldItem.map((item, index) => (
                <Grid item key={index}>
                  <CustomField label={item.label}>
                    <Typography sx={localStyle.textField}>
                      {item.value}
                    </Typography>
                  </CustomField>
                </Grid>
              ))}
              <Grid item>
                <Box>
                  <Typography sx={styles.header2}>
                    {t('inventory.recyclingInformation')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ ...localStyle.card, borderColor: '#ACACAC' }}>
                  <div className="header flex items-center gap-2">
                    <div className="font-bold text-base">Shipping ccompany</div>
                    <ArrowForwardOutlinedIcon className="text-grey-darker" />
                    <div className="font-bold text-base">Receiver</div>
                  </div>
                  <div className="text-sm text-grey-darker mb-4">
                    PO263783893
                  </div>
                  <div className="logistic flex items-center gap-2 mb-2">
                    <LocalShippingOutlinedIcon
                      fontSize="small"
                      className="text-gray"
                    />
                    <div className="text-sm text-grey-darker">
                      Fast Logistic
                    </div>
                  </div>
                  <div className="shiping-loc flex items-center gap-2 mb-2">
                    <LocationOnOutlinedIcon
                      className="text-gray"
                      fontSize="small"
                    />
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-grey-darker">
                        Deliver loc
                      </div>
                      <ArrowForwardOutlinedIcon
                        fontSize="small"
                        className="text-gray"
                      />
                      <div className="text-sm text-grey-darker">
                        Arrival loc
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F4F4F4] text-green-primary text-2xs p-2 rounded-lg">
                    Handed over to [driver’s name, license plate number] at
                    18:00 on 2023/09/20
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </RightOverlayForm>
      </div>
    </>
  )
}

let localStyle = {
  textField: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  card: {
    borderColor: 'ACACAC',
    borderRadius: '10px',
    padding: 2,
    borderWidth: '1px',
    borderStyle: 'solid'
  }
}
export default InventoryDetail
