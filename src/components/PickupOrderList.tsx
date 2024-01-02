import { FunctionComponent, useState, useEffect } from 'react'

import {
  Box,
  Divider,
  InputAdornment,
  IconButton,
  TextField
} from '@mui/material'
import { LEFT_ARROW_ICON, SEARCH_ICON } from '../themes/icons'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { ReactComponent as Delivery } from '../Delivery.svg'
import RightOverlayForm from '../components/RightOverlayForm'
import { PickupOrder, PickupOrderDetail } from '../interfaces/pickupOrder'
import { useTranslation } from 'react-i18next'
import { Padding } from '@mui/icons-material'
interface AddWarehouseProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectPico?: (picoId: number) => void
}

const PickupOrderList: FunctionComponent<AddWarehouseProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectPico
}) => {
  const { t } = useTranslation()
  const [picoList, setPicoList] = useState<PickupOrderDetail[]>([])
  const [filteredPico, setFilteredPico] = useState<PickupOrderDetail[]>([])

  const handleSearch = (searchWord: string) => {
    if (searchWord != '') {
      const filteredData: PickupOrderDetail[] = []
      filteredPico.map((item) => {
        if (item.senderName.includes(searchWord)) {
          filteredData.push(item)
        }
      })
      if (filteredData) {
        setFilteredPico(filteredData)
      }
    } else {
      setFilteredPico(picoList)
    }
  }

  const dummmy = [
    {
      type: '快捷物流', //picoType
      picoId: 'PO12345678',
      status: '快',
      startDate: '2023/09/20', //effFrmDate
      endDate: '2023/09/30', //effToDate
      routine: '逢星期二、四', //routineType, routine
      shippingCompany: '收件公司', //createPicoDetail.sender_name
      reciver: '收件公司' // reciver
    }
  ]

  return (
    <>
      <div>
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action="none"
          headerProps={{
            title: t('pick_up_order.select_po'),
            subTitle: '',
            onCloseHeader: handleDrawerClose
          }}
        >
          <Box>
            <Divider />
            <div className="p-6">
              <Box>
                <div className="filter-section flex justify-between items-center w-full mb-6">
                  <TextField
                    id="searchShipment"
                    onChange={(event) => handleSearch(event.target.value)}
                    sx={styles.inputState}
                    placeholder={t('pick_up_order.search_company_name')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => {}}>
                            <SEARCH_ICON style={{ color: '#79CA25' }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
                <Box>
                  {dummmy.map((item, index) => (
                    <div
                      key={index}
                      className="card-pico p-4 border border-solid rounded-lg border-grey-line"
                    >
                      <div className="font-bold text-mini mb-2">
                        {item.type}
                      </div>
                      <div className="text-smi mb-2 text-[#717171]">{item.picoId}</div>
                      <div className="date-type mb-2 flex items-center gap-2">
                        <div className="text-smi bg-green-200 text-green-600 px-2 py-3 rounded-[50%]">
                          {item.status}
                        </div>
                        <div className="text-smi text-[#717171]">{item.startDate}</div>
                        <div className='text-smi text-[#717171]'>{t('pick_up_order.to')}</div>
                        <div className="text-smi text-[#717171]">{item.startDate}</div>
                        <div className="text-smi text-[#717171]">{item.routine}</div>
                      </div>
                      <div className="mb- flex items-center gap-2">
                        <div><img src="../Delivery.svg" alt="" /></div>
                        <div className="text-xs text-[#717171]">{item.shippingCompany}</div>
                        <div className="text-xs text-[#717171]">{item.reciver}</div>
                      </div>
                    </div>
                  ))}
                </Box>
              </Box>
            </div>
          </Box>
        </RightOverlayForm>
      </div>
    </>
  )
}

let styles = {
  typo: {
    color: 'grey',
    fontSize: 14
  },
  inputState: {
    mt: 3,
    width: '100%',

    borderRadius: '10px',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: '#79CA25'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      },
      '& label.Mui-focused': {
        color: '#79CA25'
      }
    }
  }
}

export default PickupOrderList
