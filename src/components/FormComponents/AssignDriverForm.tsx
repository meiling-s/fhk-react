import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState} from "react";
import { styles } from "../../constants/styles";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import theme from "../../themes/palette";
import CustomField from "./CustomField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { t } from "i18next";
import { AssignJobDriver, AssignJobField } from "../../interfaces/pickupOrder";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type props = {
  onClose: () => void;
  editRowId: number | null;
  pickupOrderDetail: AssignJobDriver[],
  setPickupOrderDetail : (val: AssignJobDriver[]) => void;
  setIsEdit: (val: boolean) => void;
  isEdit: boolean
};

const AssignDriver = ({
  onClose,
  editRowId,
  pickupOrderDetail,
  setPickupOrderDetail,
  setIsEdit,
  isEdit
}: props) => {
  
  const [assignField, setAssignField] = useState<AssignJobField>({ driverId: '', vehicleId: 0})
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      setAssignField(prev=> {
        return{
          ...prev,
          driverId: '', vehicleId: 0
        }
      })
      onClose && onClose();
    }
  };
  
  useEffect(() => {
    if(isEdit){
      const assign = pickupOrderDetail.find((item, index) => {
        if(editRowId === index){
          return item
        }
      });
      if(assign){
        setStartDate(dayjs(assign.pickupAt))
        setAssignField((prev: AssignJobField) => {
          return{
            ...prev,
            driverId: assign?.driverId,
            vehicleId: assign?.vehicleId
          }
        })
      }
    }
  }, [isEdit])
 
  const onHandleAssign = () => {
    if(assignField.driverId === '' || assignField.vehicleId === 0 ){
      return
    }
    
    const ids = pickupOrderDetail.map((item, index) => {
      if(index === editRowId){
        return{
          ...item,
          pickupAt: new Date(startDate.format()).toISOString(),
          vehicleId: assignField.vehicleId,
          driverId: assignField.driverId
        }
      } else {
        return item
      }
    })
   
    setPickupOrderDetail(ids)
    setIsEdit(false)
    onClose()
  }

  const onChangeField = (field: string, value: any) => {
    setAssignField((prev : AssignJobField) => {
      return{
        ...prev,
        [field]: value
      }
    })
  }

  return (
    <>
      <form>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={localstyles.modal} onClick={handleOverlayClick}>
            <Box sx={localstyles.container}>
              <Box
                sx={{ display: "flex", flex: "1", p: 4, alignItems: "center" }}
              >
                <Box>
                  <Typography sx={styles.header4}>{t('jobOrder.assign_driver')}</Typography>
                </Box>

                <Box sx={{ marginLeft: "auto" }}>
                  <Button
                    variant="outlined"
                    sx={localstyles.button}
                    onClick={onHandleAssign}
                  >
                    {t('jobOrder.finish')}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      ...localstyles.button,
                      color: theme.palette.primary.main,
                      bgcolor: "white",
                    }}
                    onClick={() => onClose && onClose()}
                  >
                    {t('jobOrder.cancel')}
                  </Button>
                  <IconButton sx={{ ml: "25px" }}>
                    <KeyboardTabIcon sx={{ fontSize: "30px" }} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
              <Stack spacing={2} sx={localstyles.content}>
              {
                pickupOrderDetail.map((item, index) => {
                  if(index === editRowId){
                    return<div className='flex flex-col gap-y-4'>
                      <div className="flex flex-col bg-white border border-solid border-[#E2E2E2] rounded-md px-[15px] py-[18px]">
                        <div className='flex justify-start flex-col'>
                            <label className='font-bold text-[#717171]'> {t('jobOrder.main_category')}</label>
                            <p className='font-semibold text-black'>{item.recycType}</p>
                        </div>
                        <div className='flex justify-start flex-col'>
                            <label className='font-bold text-[#717171]'> {t('jobOrder.subcategory')}</label>
                            <p className='font-semibold text-black'>{item.recycSubType}</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex items-center flex-1 gap-x-1'>
                                <AccessTimeIcon />
                                <label className='font-bold text-[#717171]'> {t('jobOrder.estimated_shipping_time')}</label>
                            </div>
                            <p className='flex-1 font-semibold text-[#535353]'>{item.pickupAt}</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex items-center flex-1 gap-x-1'>
                                <MonitorWeightOutlinedIcon />
                                <label className='font-bold text-[#717171]'> {t('jobOrder.weight')}</label>
                            </div>
                            <p className='flex-1 font-semibold text-[#535353]'>${item.weight}kg</p>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex flex-1  items-center gap-x-1'>
                                <CardTravelIcon />
                                <label className='font-bold text-[#717171]'> {t('jobOrder.shipping_and_receiving_companies')}</label>
                            </div>
                            <div className='flex flex-1 items-center gap-x-1'>
                                <p className='font-semibold text-[#535353]'>{item.receiverName}</p>
                                <ArrowForwardIcon fontSize='small'/>
                                <p className='font-semibold text-[#535353]'>{item.senderName}</p>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex flex-1  items-center gap-x-1'>
                                <PlaceOutlinedIcon />
                                <label className='font-bold text-[#717171]'> {t('jobOrder.delivery_and_arrival_locations')}</label>
                            </div>
                            <div className='flex flex-1 items-center gap-x-1'>
                                <p className='font-semibold text-[#535353]'>{item.receiverAddr}</p>
                                <ArrowForwardIcon fontSize='small'/>
                                <p className='font-semibold text-[#535353]'>{item.senderAddr}</p>
                            </div>
                        </div>
                      </div>
                    
                      <div className="flex flex-col gap-y-2">
                        <label htmlFor="" className="font-bold text-[#717171]">{t('jobOrder.shipping_and_receiving_companies')}</label>
                        <div className="flex gap-x-1">
                        <DatePicker
                        
                        value={dayjs(startDate)}
                        format="YYYY/MM/DD"
                        onChange={(value) => setStartDate(value!!)}
                        />
                        <TimePicker
                            sx={{ width: "50%%" }}
                            value={dayjs(startDate)}
                            format="HH:mm:s"
                            onChange={(value) => setStartDate(value!!)}
                        />
                      </div>

                     </div>
                    
                    <CustomField label={t('jobOrder.driver')}>
                      <Autocomplete
                        disablePortal
                        id="driver"
                        sx={{width: '100%'}}
                        value={assignField.driverId}
                        options={ ['123', '1232', '1233', '1234']}
                        onChange={(event, value) => {
                          console.log(value)
                          if (value) {
                            onChangeField('driverId', value)
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t('jobOrder.driver')}
                            sx={[styles.textField, { width: 400 }]}
                            InputProps={{
                              ...params.InputProps,
                              sx: styles.inputProps
                            }}
                          />
                        )}
                      />
                    </CustomField>

                    <CustomField label={t('jobOrder.plat_number')}>
                      <Autocomplete
                        disablePortal
                        id="plat_number"
                        sx={{width: '100%'}}
                        value={assignField.vehicleId}
                        options={[1,2,3,4,5,6,7]}
                        onChange={(event, value) => {
                          if (value) {
                            onChangeField('vehicleId', value)
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t('jobOrder.plat_number')}
                            sx={[styles.textField, { width: 400 }]}
                            InputProps={{
                              ...params.InputProps,
                              sx: styles.inputProps
                            }}
                          />
                        )}
                      />
                    </CustomField>
                    </div>
                    }
                  })
              }
              
              </Stack>
            </Box>
          </Box>
        </LocalizationProvider>
      </form>
    </>
  );
};

let localstyles = {
  modal: {
    display: "flex",
    height: "100vh",
    width: "100%",
    justifyContent: "flex-end",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "40%",
    bgcolor: "white",
    overflowY: "scroll",
  },

  button: {
    borderColor: theme.palette.primary.main,
    color: "white",
    width: "100px",
    height: "35px",
    p: 1,
    bgcolor: theme.palette.primary.main,
    borderRadius: "18px",
    mr: "10px",
  },
  content: {
    flex: 9,
    p: 4,
  },
  typo_header: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#858585",
    letterSpacing: "2px",
    mt: "10px",
  },
  typo_fieldTitle: {
    fontSize: "15px",
    color: "#ACACAC",
    letterSpacing: "2px",
  },
  typo_fieldContent: {
    fontSize: "17PX",
    letterSpacing: "2px",
  },
};

export default AssignDriver;
