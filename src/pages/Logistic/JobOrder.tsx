import {
    Box,
    Button,
    Typography,
    Grid,
    Modal
  } from '@mui/material'
import React, { useEffect, useState,  } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import CustomField from '../../components/FormComponents/CustomField'
import { styles } from '../../constants/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CardTravelIcon from '@mui/icons-material/CardTravel';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import { useTranslation } from "react-i18next";
import AssignDriverForm from '../../components/FormComponents/AssignDriverForm'
import {OrderJobHeader, AssignJobDriver } from '../../interfaces/pickupOrder'
import axiosInstance from '../../constants/axiosInstance'
import { AXIOS_DEFAULT_CONFIGS } from '../../constants/configs'
import { GET_PICK_UP_ORDER_BY_ID } from '../../constants/requests'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from '../../constants/constant'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'; 
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'; 

const JobOrder = () => {
const [openModal, setOpenModal] = useState<boolean>(false);
const [orderDetail, setOrderDetail] = useState<OrderJobHeader>({picoId: "", receiverName: "", setupDate: "", effFrmDate: '', effToDate: ''});
const [pickupOrderDetail, setPickupOrderDetail] = useState<AssignJobDriver[]>([])
const [id, setId] = useState<number>(0);
const { picoId } = useParams()
const urlParams = new URLSearchParams(window.location.search);
const [isEdit, setIsEdit] = useState(false);

const { t } = useTranslation();

const handleCloses = () => {
    setId(0);
    setOpenModal(false);
};

console.log('pickupOrderDetail', pickupOrderDetail)
const getPicoById = async (picoId: string) => {
    try {
        const response = await axiosInstance({
        baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
        ...GET_PICK_UP_ORDER_BY_ID(picoId)
        })

        const details = response.data.pickupOrderDetail.map((item:any)=> {
            return{
                picoId: response?.data?.picoId,
                picoDtlId: item?.picoDtlId ?? 0,
                plateNo: item?.plateNo ?? '',
                senderId: item?.senderId ?? '',
                senderName: item?.senderName ?? '',
                senderAddr: item?.senderAddr ?? '',
                senderAddrGps: item?.senderAddrGps ?? [],
                receiverId: item?.receiverId ?? '',
                receiverName: item?.receiverName ?? '',
                receiverAddr: item?.receiverAddr ?? '',
                receiverAddrGps: item?.receiverAddrGps ?? [],
                recycType: item?.recycType ?? '',
                recycSubType: item?.recycSubType ?? '',
                weight: item?.weight ?? 0,
                vehicleId: item?.vehicleId ?? 0,
                driverId: item?.driverId ?? '',
                contractNo: response?.data?.contractNo ?? '',
                pickupAt: item?.pickupAt ?? '',
                createdBy: item?.createdBy ?? '',
            }
        })

        setPickupOrderDetail(details)
    
        setOrderDetail(prev => {
        return{
            ...prev,
            picoId: response?.data?.picoId,
            receiverName: response.data.logisticName,
            effFrmDate: response.data.effFrmDate,
            effToDate: response.data.effToDate
        }
        })
    } catch (error) {
        return null
    }
}

useEffect( () => {
    if(picoId) getPicoById(picoId);
}, [picoId])

const onHandleAssign = (index : number) => {
    setOpenModal(true)
    setId(index)
}

const onHandleEdit = (index : number) => {
    setOpenModal(true)
    setId(index)
    setIsEdit(true)
}

const handleDelete = (index: number) => {
    const ids = pickupOrderDetail.map((item, indexItem) => {
        if(indexItem === index) {
            return{
                ...item,
                pickupAt: '',
                vehicleId: '',
                driverId: ''
            }
        } else {
            return item
        }
    })

    setPickupOrderDetail(ids)
}

return (
    <Box sx={[styles.innerScreen_container, { paddingRight: 0 }]}>
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-cn"
        >
            <Grid
                container
                direction={'column'}
                spacing={2}
                sx={{ ...styles.gridForm }}
            >
                <Grid item>
                    <Typography sx={styles.header1}>
                    {t('jobOrder.create_work_waybill')}
                    </Typography>
                </Grid>

                <Grid item>
                    <Typography sx={styles.header2}>
                    {t('jobOrder.shipping_information')}
                    </Typography>
                </Grid>

                <CustomField label={t('jobOrder.corresponding_waybill')}>
                    <Typography sx={localstyles.typo_fieldContent}>
                        {orderDetail.picoId}
                    </Typography>
                </CustomField>
                
                <Grid display={'flex'} style={{marginTop: '15px', marginLeft: '15px'}} direction={'row'}>
                    <div className='flex flex-col w-[240px]'>
                        <Typography sx={{}}>{t('jobOrder.shipping_validity_date_from')}</Typography>
                        <DatePicker
                            value={dayjs(orderDetail.effFrmDate)}
                            sx={localstyles.typo_fieldContent}
                            format={format.dateFormat2}
                            disabled
                        />
                    </div>
                    <div className='flex flex-col ml-2 w-[240px]'>
                        <Typography sx={{}}>{t('jobOrder.shipping_validity_date_to')}</Typography>
                        <DatePicker
                            value={dayjs(orderDetail.effToDate)}
                            sx={localstyles.typo_fieldContent}
                            format={format.dateFormat2}
                            disabled
                        />
                    </div>
                    
                </Grid>

                <CustomField label={t('jobOrder.shipping_company_name')}>
                    <Typography sx={localstyles.typo_fieldContent}>
                        {orderDetail.receiverName}
                    </Typography>
                </CustomField>

                <div  className='flex flex-col gap-y-3 ml-4'>
                    <p className='font-semibold text-[#717171]'> {t('jobOrder.recycling_location_information')}</p>
                    {
                        pickupOrderDetail.map((item: AssignJobDriver, index) => {
                            return <div className={`flex flex-col rounded-sm px-[15px] py-[18px] w-[450px] bg-white`}>
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

                            {
                                !item.driverId && !item.plateNo ? <div className='flex flex-col items-center justify-center h-[113px] rounded-md w-full border border-solid border-[#8AF3A3]'>
                                    <AddCircleIcon 
                                        fontSize='large' 
                                        className='text-[#7CE495] hover:cursor-pointer' 
                                        onClick={() => onHandleAssign(index)}
                                    />
                                    <label htmlFor="" className='font-semibold'>{t('jobOrder.assign_driver')}</label>
                                </div> : 
                                    <div className='flex items-center justify-between p-2  border border-solid border-[#8AF3A3] rounded-md'>
                                    <div className='flex items-center justify-center gap-x-1'>
                                        <div className='flex items-center justify-center border border-[#7CE495] rounded-2xl h-[25px] w-[25px] p-1 bg-[#7CE495]'>
                                            <label className='text-white font-bold'>DR</label>
                                        </div>
                                        <div className='flex flex-col'>
                                            <label className='label-0'>{item.driverId}</label>
                                            <label className='label-0'>{item.vehicleId}</label>
                                        </div>
                                    </div>
                                    <div className='flex  gap-x-1'>
                                        <DriveFileRenameOutlineOutlinedIcon 
                                            fontSize='medium'
                                            className='hover:cursor-pointer'
                                            onClick={() => onHandleEdit(index)}
                                        />
                                        <DeleteForeverOutlinedIcon 
                                            fontSize='medium'
                                            className='hover:cursor-pointer'
                                            onClick={() => handleDelete(index)}
                                        />
                                    </div>
                    
                                </div>
                                
                            }
                            
                            
                        </div>
                        })
                    }

                </div>

                <Grid item>
                    <Typography sx={{}}>
                    {t('jobOrder.setup_time')} : 2023/09/24 17:00
                    </Typography>
                </Grid>

                <Grid item>
                    <Button
                    type="submit"
                    sx={[styles.buttonFilledGreen, localstyles.localButton]}
                    >
                    {t('jobOrder.finish')}
                    </Button>
                    <Button
                    sx={[styles.buttonOutlinedGreen, localstyles.localButton]}
                    // onClick={handleHeaderOnClick}
                    >
                    {t('jobOrder.cancel')}
                    </Button>
                </Grid>
            </Grid>

            <Modal open={openModal} onClose={handleCloses}>
                <AssignDriverForm
                    onClose={handleCloses}
                    editRowId={id}
                    pickupOrderDetail={pickupOrderDetail}
                    setPickupOrderDetail={setPickupOrderDetail}
                    setIsEdit={setIsEdit}
                    isEdit={isEdit}
                />
            </Modal>

        </LocalizationProvider>
    </Box>
)
}
  
let localstyles = {
localButton: {
    width: '200px',
    fontSize: 18,
    mr: 3
},
picoIdButton: {
    flexDirection: 'column',
    borderRadius: '8px',
    width: '400px',
    padding: '32px',
    border: 1,
    borderColor: '#79ca25',
    backgroundColor: 'white',
    color: 'black',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
    bgcolor: '#F4F4F4'
    }
},
modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
},
typo_fieldContent: {
    fontSize: '17PX',
    letterSpacing: '2px'
},
datePicker: {
    ...styles.textField,
    maxWidth: '280px',
    '& .MuiIconButton-edgeEnd': {
        color: '#79CA25'
    }
    }
}
  
export default JobOrder
  