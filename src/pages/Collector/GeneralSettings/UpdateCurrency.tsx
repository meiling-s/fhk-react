import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  MenuItem,
  FormControl
} from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { formValidate } from '../../../interfaces/common'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { STATUS_CODE, localStorgeKeyName } from '../../../constants/constant'
import {
  updateUserCurrency,
  getCurrencyList
} from '../../../APICalls/Collector/currency'
import { Currency } from '../../../interfaces/currency'
import { extractError, showErrorToast } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'

interface UpdateCurrencyProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'edit'
  tenantCurrency: string
  monetaryVersion: number
  onSubmitData: (type: string, msg: string) => void
}

const UpdateCurrency: FunctionComponent<UpdateCurrencyProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  tenantCurrency,
  onSubmitData,
  monetaryVersion
}) => {
  const { t } = useTranslation()
  const [currencyList, setCurrencyList] = useState<il_item[]>([])

  const [currencyType, setCurrencyType] = useState<il_item[]>(currencyList)
  const [selectedCurrency, setSelectedCurrency] = useState<il_item>({
    id: tenantCurrency,
    name: tenantCurrency
  })
  const [validation, setValidation] = useState<formValidate[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setSelectedCurrency({
      id: tenantCurrency,
      name: tenantCurrency
    })
  }, [tenantCurrency])

  useEffect(() => {
    setValidation([])
    getAllCurrency()
  }, [drawerOpen])

  const getAllCurrency = async () => {
    const result = await getCurrencyList()
    let tempCurrency: il_item[] = []
    if (result) {
      result.data
        .filter((cur: any) => cur.status != 'INACTIVE')
        .map((item: any) => {
          tempCurrency.push({
            id: item.monetary,
            name: item.monetary
          })
        })
      setCurrencyList(tempCurrency)
      setCurrencyType(currencyList)
    }
  }

  const handleSubmit = async () => {
    try {
      const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''
      const username = localStorage.getItem(localStorgeKeyName.username) || ''
  
      const result = await updateUserCurrency(
        tenantId,
        selectedCurrency.id,
        username,
        monetaryVersion
      )
      if (result) {
        onSubmitData('success', t('common.saveSuccessfully'))
        handleDrawerClose()
      }
    } catch (error: any) {
      const {state} = extractError(error);
        if (state.code === STATUS_CODE[503]) {
          navigate('/maintenance')
        } else if (state.code === STATUS_CODE[409]){
          showErrorToast(error.response.data.message);
        }
    }
  }

  return (
    <div className="add-vehicle">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={action}
        headerProps={{
          title: t('general_settings.default_currency'),
          submitText: t('add_warehouse_page.save'),
          cancelText: '',
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit
        }}
      >
        <Divider></Divider>
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
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('general_settings.default_currency')}
              </Typography>
              <FormControl
                sx={{
                  width: '100%'
                }}
              >
                <Select
                  labelId="currencyType"
                  id="currencyType"
                  value={selectedCurrency.id}
                  sx={{
                    borderRadius: '12px'
                  }}
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedValue = currencyType.find(
                      (item) => item.id === event.target.value
                    )
                    if (selectedValue) {
                      setSelectedCurrency(selectedValue)
                    }
                  }}
                >
                  {currencyType.length > 0 ? (currencyType.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))) : (
                    <MenuItem disabled value="">
                      <em>{t('common.noOptions')}</em>
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default UpdateCurrency
