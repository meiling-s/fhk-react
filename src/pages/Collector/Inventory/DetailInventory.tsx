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
import {
  InventoryItem,
  InventoryDetail as InvDetails
} from '../../../interfaces/inventory'
import { format } from '../../../constants/constant'
import dayjs from 'dayjs'
import {
  dateToLocalDate,
  dayjsToLocalDate
} from '../../../components/Formatter'

import { useTranslation } from 'react-i18next'
import { PickupOrder } from '../../../interfaces/pickupOrder'
import { returnApiToken } from '../../../utils/utils'
import { getItemTrackInventory } from '../../../APICalls/Collector/inventory'
import InventoryShippingCard from '../../../components/InventoryShippingCard'
import { formatWeight } from '../../../utils/utils'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'

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
  const [shippingData, setShippingData] = useState<any[]>([])
  const { decimalVal } = useContainer(CommonTypeContainer)
  const getPicoDtl = (picoId: string, dtlId: number) => {
    if (selectedPico) {
      const pico = selectedPico.find((pico) => pico.picoId == picoId)
      if (pico) {
        const picoDetail = pico.pickupOrderDetail.find(
          (dtl) => dtl.picoDtlId == dtlId
        )
        return picoDetail
      }
    }
    return null
  }
  const fieldItem = [
    {
      label: t('inventory.date'),
      value: selectedRow?.createdAt
    },
    {
      label: t('col.recycType'),
      value: selectedRow?.recyName
    },
    {
      label: t('inventory.recyleSubType'),
      value: selectedRow?.subName
    },
    {
      label: t('inventory.package'),
      value: selectedRow?.packageName
    },
    {
      label: t('inventory.inventoryLocation'),
      value: selectedRow?.location
    },
    {
      label: t('inventory.weight'),
      value: `${formatWeight(selectedRow?.weight || 0, decimalVal)} kg`
    }
  ]

  useEffect(() => {
    initItemTrackInventory()
  }, [selectedRow])

  const initItemTrackInventory = async () => {
    const token = returnApiToken()
    if (selectedRow !== null && selectedRow !== undefined) {
      let result
      if (token.realmApiRoute === 'account') {
      } else {
        result = await getItemTrackInventory(
          token.realmApiRoute,
          token.decodeKeycloack,
          selectedRow?.itemId
        )

        if (result) {
          const data = result.data
          setShippingData(data)
        }
      }
    }
  }

  return (
    <>
      <div className="detail-inventory">
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={'none'}
          headerProps={{
            title: t('recyclables'),
            subTitle: selectedRow?.recyName,
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
                    {t('warehouseDashboard.recyclingInformation')}
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
              {shippingData.length > 0 && (
                <Grid item>
                  <Typography sx={styles.header2}>
                    {t('pick_up_order.item.shipping_info')}
                  </Typography>
                  <InventoryShippingCard shippingData={shippingData} />
                </Grid>
              )}
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
