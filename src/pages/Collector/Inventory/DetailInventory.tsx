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
import { dateToLocalDate, dayjsToLocalDate } from '../../../components/Formatter'

import { useTranslation } from 'react-i18next'
import { PickupOrder } from '../../../interfaces/pickupOrder'

interface InventoryDetailProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedRow?: InventoryItem | null
  selectedPico?: PickupOrder[] | null
}

const InventoryDetail: FunctionComponent<InventoryDetailProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectedRow,
  selectedPico
}) => {
  const { t } = useTranslation()
  const getPicoDtl = (picoId: string, dtlId: number) => {
    if(selectedPico) {
    const pico = selectedPico.find((pico) => pico.picoId == picoId)
    if(pico) {
      const picoDetail = pico.pickupOrderDetail.find((dtl) => dtl.picoDtlId == dtlId)
      return picoDetail
      }
    }
    return null
    
  }
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
      value: selectedRow?.location
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
            title: t('inventory.inventory'),
            subTitle: selectedRow?.unitId,
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
                {selectedRow?.inventoryDetail?.map((item, index) => {
                  const pico = selectedPico?.find((p) => p.picoId ==  item.sourcePicoId)
                  const picoDtl = getPicoDtl(item.sourcePicoId, item.sourcePicoDtlId)
                  let createdDate = ""
                  if(picoDtl) {
                    createdDate = dayjs(new Date(picoDtl.createdAt)).format(format.dateFormat1)
                  }
                  
                  return picoDtl ? (
                    <Box key={index} sx={{ ...localStyle.card, borderColor: '#ACACAC' }}>
                      <div className="header flex items-center gap-2">
                        <div className="font-bold text-base">{picoDtl.senderName}</div>
                        <ArrowForwardOutlinedIcon className="text-grey-darker" />
                        <div className="font-bold text-base">{picoDtl.receiverName}</div>
                      </div>
                      <div className="text-sm text-grey-darker mb-4">
                        {item.sourcePicoId}
                      </div>
                      <div className="logistic flex items-center gap-2 mb-2">
                        <LocalShippingOutlinedIcon
                          fontSize="small"
                          className="text-gray"
                        />
                        <div className="text-sm text-grey-darker">
                          {pico?.routineType}
                        </div>
                      </div>
                      <div className="shiping-loc flex items-center gap-2 mb-2">
                        <LocationOnOutlinedIcon
                          className="text-gray"
                          fontSize="small"
                        />
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-grey-darker">
                            {picoDtl.senderAddr}
                          </div>
                          <ArrowForwardOutlinedIcon
                            fontSize="small"
                            className="text-gray"
                          />
                          <div className="text-sm text-grey-darker">
                            {picoDtl.receiverAddr}
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#F4F4F4] text-green-primary text-xs p-2 rounded-lg">
                        { `Handed over to [${pico?.logisticName}, ${pico?.platNo}] at
                        ${createdDate}`}
                      </div>
                    </Box>
                  ) : null

                })}
              
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
    borderStyle: 'solid',
    marginBottom: 2
  }
}
export default InventoryDetail
