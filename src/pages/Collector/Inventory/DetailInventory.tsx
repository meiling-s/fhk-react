import { Box, Grid, Divider, Typography } from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { styles } from '../../../constants/styles'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import CircularLoading from '../../../components/CircularLoading'
import {
  InventoryItem,
  InventoryDetail as InvDetails
} from '../../../interfaces/inventory'
import { useTranslation } from 'react-i18next'
import { PickupOrder } from '../../../interfaces/pickupOrder'
import { returnApiToken, formatWeight } from '../../../utils/utils'
import { getItemTrackInventory } from '../../../APICalls/Collector/inventory'
import InventoryShippingCard from '../../../components/InventoryShippingCard'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      label: t('inventory.recyleType'),
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
    setIsLoading(true)
    const token = returnApiToken()
    setShippingData([])
    if (selectedRow !== null && selectedRow !== undefined) {
      let result
      if (token.realmApiRoute === 'account') {
        // TODO document why this block is empty
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
    setIsLoading(false)
  }

  return (
    <div className="detail-inventory">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'none'}
        useConfirmModal={false}
        headerProps={{
          title: t('inventory.recyclingNumber'),
          subTitle: `${selectedRow?.labelId}`,
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
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Grid item>
                {shippingData.length > 0 && (
                  <Grid>
                    <Typography sx={styles.header2}>
                      {t('pick_up_order.item.shipping_info')}
                    </Typography>
                    <InventoryShippingCard shippingData={shippingData} />
                  </Grid>
                )}
             </Grid>
            )}
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
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
