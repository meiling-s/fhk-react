import {
  Button,
  Modal,
  OutlinedInputProps,
  TextField,
  TextFieldProps,
  Typography,
  Pagination
} from "@mui/material";
import { Box, Stack, alpha, styled } from "@mui/system";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router";
import { DataGrid, GridColDef, GridRowParams, GridRowSpacingParams, GridToolbar, GridValueGetterParams } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import CustomSearchField from "../../../components/TableComponents/CustomSearchField";
import PickupOrderForm from "../../../components/FormComponents/PickupOrderForm";
import StatusCard from "../../../components/StatusCard";

import { PickupOrder, queryPickupOrder } from "../../../interfaces/pickupOrder";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from 'react-i18next'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { getAllPickUpOrder } from "../../../APICalls/Collector/pickupOrder/pickupOrder";
import i18n from '../../../setups/i18n'
import { format } from "../../../constants/constant";
import dayjs from 'dayjs'

interface Option {
  value: string;
  label: string;
}

const PickupOrders = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10 
  const [totalData , setTotalData] = useState<number>(0)

  const columns: GridColDef[] = [
    { field: "createdAt", headerName: t('pick_up_order.table.created_datetime'), width: 300 },
    {
      field: "logisticCompany",
      headerName: t('pick_up_order.table.logistic_company'),
      width: 170,
      editable: true,
    },
    {
      field: "picoId",
      headerName: t('pick_up_order.table.pico_id'),
      type:"string",
      width: 200,
      editable: true,
    },
    {
      field: "deliveryDate",
      headerName: t('pick_up_order.table.delivery_date'),
      type: 'string',
      width: 300,
      editable: true,
    },
    {
        field: "senderCompany",
        headerName: t('pick_up_order.table.sender_company'),
        type: "sring",
        width: 170,
        editable: true,
    },
    {
        field: "receiver",
        headerName: t('pick_up_order.table.receiver'),
        type: "string",
        width: 170,
        editable: true,
    },
    {
        field: "status",
        headerName: t('pick_up_order.table.status'),
        type: "string",
        width: 170,
        editable: true,
        renderCell: (params) => (
            <StatusCard  status={params.value}/>
            ),
    },
   
  ];
 

  // const {pickupOrder} = useContainer(CheckInRequestContainer)
  const {recycType} = useContainer(CommonTypeContainer)
  const [recycItem, setRecycItem] = useState<il_item[]>([])
  const location = useLocation();
  const action: string = location.state;
  const [pickupOrder,setPickupOrder] = useState<PickupOrder[]>();
  const [rows, setRows] = useState<Row[]>([])
  const [filteredPico , setFilteredPico] = useState<Row[]>([])
  const [query, setQuery] = useState<queryPickupOrder>({
    picoId: '',
    effFromDate: '',
    effToDate: '',
    logisticName: '',
    recycType: '',
    receiverAddr: '',
    status: 0
  });
  
  const initPickupOrderRequest = async () => {
    const result = await getAllPickUpOrder(page - 1, pageSize, query);
    const data = result?.data.content;
    console.log("pickup order content: ", data);
    if (data && data.length > 0) {
      setPickupOrder(data);
    } else {
      setPickupOrder([])
    }
    setTotalData( result?.data.totalPages)
  }
 
    useEffect(() => {
      initPickupOrderRequest();
      if(action){
        var toastMsg = "";
        switch(action){
          case "created":
            toastMsg = t("回收運單已建立");
            break;
          case "updated":
            toastMsg = t("回收運單已更改");
            break;
        }
        toast.info(toastMsg, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      navigate(location.pathname, { replace: true });
    }, [page, query]);

  useEffect(() =>{
   
   const recycItems: il_item[] = []
   recycType?.forEach((item) =>{
    var name = ""
    switch (i18n.language) {
      case 'enus':
        name = item.recyclableNameEng
        break
      case 'zhch':
        name = item.recyclableNameSchi
        break
      case 'zhhk':
        name = item.recyclableNameTchi
        break
      default:
        name = item.recyclableNameTchi
        break
    }
    recycItems.push({
      name: name,
      id: item.recycTypeId.toString()
    })
   })

   setRecycItem(recycItems)
  }, [recycType]);

  const getDeliveryDate = (row: PickupOrder) => {
    if( row.picoType === 'AD_HOC') {
      return `${row.effFrmDate} - ${row.effToDate}`
    } else {
      if(row.routineType === 'daily'){
        return "Daily"
      }else {
        return `${row.routine.join(', ')}`
      }
     
    }
  }

  const getFormatDate = (data: string) => {
    const formattedDate = dayjs(data).format(format.dateFormat1)
  
    return formattedDate
  }

  useEffect (() => {
  // const mappingData = () => {
    const tempRows: any[] =(pickupOrder?.map((item) => ({
      id: item.picoId,
      createdAt: getFormatDate(item.createdAt),
      logisticCompany: item.logisticName,
      picoId: item.picoId, 
      deliveryDate: getDeliveryDate(item),
      senderCompany: item.pickupOrderDetail[0]?.receiverAddr,
      receiver: item.pickupOrderDetail[0]?.receiverName,
      status: item.status,
      recyType: item.pickupOrderDetail.map(item => {return item.recycType})
    //}))??[])
    }))??[]).filter((item) => item.status !== 'CLOSED');
    setRows(tempRows)
    setFilteredPico(tempRows)
  // }
  },[pickupOrder])

 

  interface Row {
    id: number;
    createdAt: string;
    logisticCompany: string;
    picoId: number;
    deliveryDate: string;
    senderCompany: string;
    receiver: string;
    status: string;
    recyType: string[];
  }
  const searchfield = [
    {label:t('pick_up_order.filter.search'),width:'14%', field: 'picoId'},
    {label:t('pick_up_order.filter.dateby'),width:'10%',options:getUniqueOptions('createdAt'), field:"effFromDate"},
    {label:t('pick_up_order.filter.to'),width:'10%',options:getUniqueOptions('deliveryDate'), field:"effToDate"},
    {label:t('pick_up_order.filter.logistic_company'),width:'14%',options:getUniqueOptions('logisticCompany'), field:"logisticName"},
    {label:t('pick_up_order.table.sender_company'),width:'14%',options:getUniqueOptions('senderCompany'), field:"receiverAddr"},
    {label:t('pick_up_order.filter.recycling_category'),width:'14%',options:getReycleOption(), field:"recycType"},
    {label:t('pick_up_order.filter.status'),width:'14%',options:getUniqueOptions('status'), field:"status"}
    
  ]
  
 
  const navigate = useNavigate()
  const [openModal,setOpenModal] =useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  console.log(selectedRow)

  function getUniqueOptions(propertyName:keyof Row) {
    const optionMap = new Map();
  
    rows.forEach((row) => {
      optionMap.set(row[propertyName], row[propertyName]);
    });
  
    let options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option,
    }));
    options.push({
      value: '',
      label: "any",
    })
    return options
  }

  function getReycleOption() {
    const options: Option[] = recycItem.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  
    return options;
  }
  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
      
    };
  }, []);
  const handleCloses = () =>{
    setOpenModal(false)
  }
  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as Row;
    setSelectedRow(row);
    setOpenModal(true);
  };

  
  const updateQuery = (newQuery: Partial<queryPickupOrder>) => {
    setQuery({ ...query, ...newQuery });
  }

  const handleSearch = (keyName: string, value: string) => {
    if(keyName == 'status') {
      const statusMapping: { [key: string]: number } = {
        CREATED: 0,
        STARTED: 1,
        CONFIRMED: 2,
        REJECTED: 3,
        COMPLETED: 4,
        CLOSED: 5,
        OUTSTANDING: 6
      };
      const mappedStatus = statusMapping[value];
      updateQuery({ ...query, [keyName]: mappedStatus });
    } else {
      updateQuery({[keyName]: value})
    }
    
  }
   
  return (
    <>
    <ToastContainer/>
    <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <Modal open={openModal} onClose={handleCloses} >
                      <PickupOrderForm onClose={handleCloses} selectedRow={selectedRow} pickupOrder={pickupOrder} initPickupOrderRequest={initPickupOrderRequest} />
                    </Modal>
      <Box sx={{ display: "flex", alignItems: "center",ml:'6px',width:'100%' }}>
        <Typography fontSize={20} color="black" fontWeight="bold">
        {t('pick_up_order.enquiry_pickup_order')}
        </Typography>
        <Button
          onClick={() => navigate("/collector/createPickupOrder")}
          sx={{
            borderRadius: "20px",
            backgroundColor: "#79ca25",
            "&.MuiButton-root:hover": { bgcolor: "#79ca25" },
            width: "fit-content",
            height: "40px",
            marginLeft: "20px",
          }}
          variant="contained"
        >
          + {t("col.create")}
        </Button>
      </Box>
      <Box />
      <Stack direction='row' mt={3} >
        {searchfield.map((s)=>(
            <CustomSearchField  
            label={s.label} 
            width={s.width} 
            field={s.field}
            options={s.options || []} 
            onChange={handleSearch} />
        ))}
        

      </Stack>
      <Box pr={4} pt={3} pb={3} sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={filteredPico}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          onRowClick={handleRowClick} 
          getRowSpacing={getRowSpacing}
          hideFooter
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              border: "none", // Remove the borders from the cells
            },
            "& .MuiDataGrid-row": {
                bgcolor:'white', 
                borderRadius:'10px',
              },
            '&>.MuiDataGrid-main': {
                '&>.MuiDataGrid-columnHeaders': {
                  borderBottom: 'none',
                }},
        
          }}
        />
        <Pagination
            count={Math.ceil(totalData)}
            page={page}
            onChange={(_, newPage) => {
              setPage(newPage) 
              }}
        />
        
      </Box>
    </Box>
    </>
  );
};

export default PickupOrders;
