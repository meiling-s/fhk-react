import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  Card,
  FormControl,
  ButtonBase,
  ImageList,
  ImageListItem
} from '@mui/material'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { EVENT_RECORDING } from '../../../constants/configs'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { Vehicle, CreateVehicle as CreateVehicleForm } from '../../../interfaces/vehicles'
import { formErr } from '../../../constants/constant'
import { returnErrorMsg, ImageToBase64 } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { createVehicles as addVehicle, deleteVehicle, editVehicle } from '../../../APICalls/Collector/vehicles'
import { localStorgeKeyName } from "../../../constants/constant";
import i18n from '../../../setups/i18n'

interface UpdateCurrencyProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  action: 'edit'
  tenantCurrency: string;
}

const UpdateCurrency: FunctionComponent<UpdateCurrencyProps> = ({
  drawerOpen,
  handleDrawerClose,
  action,
  tenantCurrency
}) => {
  const { t } = useTranslation()
  const currencyList: il_item[] = [
    {
      id: 'HKD',
      name: 'HKD'
    },
    {
      id: 'RMB',
      name: 'RMB'
    },
    {
        id: 'USD',
        name: 'USD'
      },
      {
        id: 'SGD',
        name: 'SGD'
      },
      {
        id: 'THB',
        name: 'THB'
      },
      {
        id: 'AUD',
        name: 'AUD'
      },
      {
        id: 'EUR',
        name: 'EUR'
      },
      {
        id: 'GBP',
        name: 'GBP'
      },
  ]
  
  const [currencyType, setCurrencyType] = useState<il_item[]>(currencyList)
  const [selectedCurrency, setSelectedCurrency] = useState<il_item>({
    id: tenantCurrency,
    name: tenantCurrency
  })
  const [vehicleTypeList, setVehicleType] = useState<il_item[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<il_item>({id: '1', name: "Van"})
  const [licensePlate, setLicensePlate] = useState('')
  const [pictures, setPictures] = useState<ImageListType>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const {vehicleType } = useContainer(CommonTypeContainer);
  const [listedPlate, setListedPlate] = useState<string[]>([])

  useEffect(() => {
    setSelectedCurrency({
        id: tenantCurrency,
        name: tenantCurrency,
    })
  }, [tenantCurrency])

  useEffect(() => {
    setValidation([])
  }, [drawerOpen])
  

  const handleSubmit = () => {
    // const loginId = localStorage.getItem(localStorgeKeyName.username) || ""

    // const formData: CreateVehicleForm = {
    //   vehicleTypeId: selectedVehicle.id,
    //   vehicleName: selectedVehicle.name,
    //   plateNo: licensePlate,
    //   serviceType: selectedService.id,
    //   photo:  ImageToBase64(pictures),
    //   status: "ACTIVE",
    //   createdBy: loginId,
    //   updatedBy: loginId
    // }
    // console.log("iamge", ImageToBase64(pictures))
    // if (action == 'add') {
    //   handleCreateVehicle(formData)
    // } else {
    //   handleEditVehicle(formData)
    // }
    console.log('hitt save', selectedCurrency)
    handleDrawerClose()
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
          onCloseHeader: handleDrawerClose,
          onSubmit: handleSubmit,
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
                    const selectedValue = currencyType.find(item => item.id === event.target.value);
                    if (selectedValue) {
                      setSelectedCurrency(selectedValue);
                    }
                  }}
                >
                  {currencyType.map((item, index) => (
                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                  ))}
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
