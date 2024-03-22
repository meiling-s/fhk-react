import {
  Button,
  Modal,
  Typography,
  Pagination,
  Divider
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useLocation, useNavigate } from "react-router";
import { DataGrid, GridColDef, GridRowParams, GridRowSpacingParams } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import CustomSearchField from "../../../components/TableComponents/CustomSearchField";
import PickupOrderForm from "../../../components/FormComponents/PickupOrderForm";
import StatusCard from "../../../components/StatusCard";

import { PickupOrder, queryPickupOrder } from "../../../interfaces/pickupOrder";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from 'react-i18next'
import CustomItemList, { il_item } from '../../../components/FormComponents/CustomItemList'
import { getAllPickUpOrder, getAllLogisticsPickUpOrder, getAllReason } from "../../../APICalls/Collector/pickupOrder/pickupOrder";
import { editPickupOrderStatus } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import i18n from '../../../setups/i18n'
import { displayCreatedDate } from '../../../utils/utils'
import TableOperation from "../../../components/TableOperation";
import { localStorgeKeyName } from '../../../constants/constant'

type Approve = {
  open: boolean
  onClose: () => void
  selectedRow: any
}

const ApproveModal: React.FC<Approve> = ({ open, onClose, selectedRow }) => {
  const { t } = useTranslation()

  const onApprove = async () => {
    const updatePoStatus = {
      status: 'CONFIRMED',
      reason: selectedRow.reason,
      updatedBy: selectedRow.updatedBy
    }
    try {
      const result = await editPickupOrderStatus(
        selectedRow.picoId,
        updatePoStatus
      )
      if (result) {
        toast.info('Approved successfully', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        onClose()
      }
    } catch (error) {
      console.error('Error approve:', error)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('pick_up_order.confirm_approve_title')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ alignSelf: 'center' }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                onApprove()
              }}
            >
              {t('pick_up_order.confirm_approve')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('pick_up_order.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

const Required = () => {
  return (
    <Typography
      sx={{
        color: "red",
        ml: "5px",
      }}
    >
      *
    </Typography>
  );
};

type rejectForm = {
  open: boolean;
  onClose: () => void;
  selectedRow: any
  reasonList: any
};

function RejectForm({
  open,
  onClose,
  selectedRow,
  reasonList
}: rejectForm) {
  
  const { t } = useTranslation();
  const [rejectReasonId, setRejectReasonId] = useState<string>('');
  const handleConfirmRejectOnClick = async (rejectReasonId: string) => {
    const rejectReasonItem = reasonList.find((item: { id: string; }) => item.id === rejectReasonId)
    const reason = rejectReasonItem?.name || '';
    const updatePoStatus = {
        status: 'REJECTED',
        reason: reason,
        updatedBy: selectedRow.updatedBy
      }
      try {
        const result = await editPickupOrderStatus(
          selectedRow.picoId,
          updatePoStatus
        )
        if (result) {
          toast.info('Rejected successfully', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          onClose()
        }
      } catch (error) {
        console.error('Error reject:', error)
      }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {t('pick_up_order.confirm_reject_title')}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              {t("check_in.reject_reasons")}
              <Required />
            </Typography>
            <CustomItemList items={reasonList} singleSelect={setRejectReasonId} />
          </Box>

          <Box sx={{ alignSelf: "center" }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                handleConfirmRejectOnClick(rejectReasonId);
                onClose();
              }}
            >
              {t('pick_up_order.confirm_reject')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('pick_up_order.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

interface Option {
  value: string;
  label: string;
}

const PickupOrders = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10 
  const [totalData , setTotalData] = useState<number>(0)
  const [showOperationColumn, setShowOperationColumn] = useState<Boolean>(false)
  const columns: GridColDef[] = [
    { field: "createdAt", headerName: t('pick_up_order.table.created_datetime'), width: 150 },
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
      width: 220,
      editable: true,
    },
    {
      field: "deliveryDate",
      headerName: t('pick_up_order.table.delivery_date'),
      type: 'string',
      width: 200,
      editable: true,
    },
    {
      field: "senderCompany",
      headerName: t('pick_up_order.table.sender_company'),
      type: "sring",
      width: 260,
      editable: true,
    },
    {
      field: "receiver",
      headerName: t('pick_up_order.table.receiver'),
      type: "string",
      width: 260,
      editable: true,
    },
    {
      field: "status",
      headerName: t('pick_up_order.table.status'),
      type: "string",
      width: 100,
      editable: true,
      renderCell: (params) => (
        <StatusCard status={params.value}/>
      ),
    },
    showOperationColumn && {
      field: "operation",
      headerName: t('pick_up_order.table.operation'),
      type: "string",
      width: 220,
      editable: true,
      renderCell: (params) => (
        <TableOperation
          row={params.row}
          onApprove={showApproveModal}
          onReject={showRejectModal}
          navigateToJobOrder={navigateToJobOrder}
        />
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
  const [approveModal, setApproveModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [reasonList, setReasonList] = useState<any>([])
  const role = localStorage.getItem(localStorgeKeyName.role)
  
  const initPickupOrderRequest = async () => {
    setPickupOrder([])
    setTotalData(0)
    let result = null
    if (role === 'logisticadmin') {
      result = await getAllLogisticsPickUpOrder(page - 1, pageSize, query);
    } else {
      result = await getAllPickUpOrder(page - 1, pageSize, query);
    }
    const data = result?.data.content;
    if (data && data.length > 0) {
      setPickupOrder(data);
    } else {
      setPickupOrder([])
    }
    setTotalData( result?.data.totalPages)
  }
  
  const showApproveModal = (row: any) => {
    setSelectedRow(row);
    setApproveModal(true)
  }
  const showRejectModal = (row: any) => {
    setSelectedRow(row);
    setRejectModal(true)
  }
  const navigateToJobOrder = () => {
    console.log('navigateToJobOrder')
  }
  const resetPage = async () => {
    setApproveModal(false)
    setRejectModal(false)
    initPickupOrderRequest()
  }

  const getRejectReason = async() => {
    let result = await getAllReason()
    if (result && result?.data && result?.data.length > 0) {
      let reasonName = ""
      switch (i18n.language) {
        case 'enus':
          reasonName = 'reasonNameEng'
          break
        case 'zhch':
          reasonName = 'reasonNameSchi'
          break
        case 'zhhk':
          reasonName = 'reasonNameTchi'
          break
        default:
          reasonName = 'reasonNameEng'
          break
      }
      result?.data.map((item: { [x: string]: any; id: any; reasonId: any; name: any; }) => {
        item.id = item.reasonId
        item.name = item[reasonName]
      })
      setReasonList(result?.data)
    }
  }
  
  useEffect(() => {
    setShowOperationColumn(role === 'logisticadmin')
  }, [role, columns, i18n.language])

  useEffect(()=>{
    initPickupOrderRequest()
  }, [i18n.language])

  useEffect(() => {
    initPickupOrderRequest();
    getRejectReason()
    if(action){
      var toastMsg = "";
      switch(action){
        case "created":
          toastMsg = t("pick_up_order.created_pickup_order");
          break;
        case "updated":
          toastMsg = t("pick_up_order.changed_pickup_order");
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
    } else if(row.routineType === 'daily'){
      return "Daily"
    } else {
      return `${row.routine.join(', ')}`
    }
  }

  useEffect (() => {
  // const mappingData = () => {
    const tempRows: any[] =(pickupOrder?.map((item) => ({
      ...item,
      id: item.picoId,
      createdAt: displayCreatedDate(item.createdAt),
      logisticCompany: item.logisticName,
      picoId: item.picoId, 
      deliveryDate: getDeliveryDate(item),
      senderCompany: item.pickupOrderDetail[0]?.receiverAddr,
      receiver: item.pickupOrderDetail[0]?.receiverName,
      status: item.status,
      recyType: item.pickupOrderDetail.map(item => {return item.recycType}),
      operation: '',
      
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
    <Box sx={{ display: "flex",  flexDirection: "column" }}>
        <Modal open={openModal} onClose={handleCloses} >
          <PickupOrderForm onClose={handleCloses} selectedRow={selectedRow} pickupOrder={pickupOrder} initPickupOrderRequest={initPickupOrderRequest} navigateToJobOrder={navigateToJobOrder} />
        </Modal>
      <Box sx={{ display: "flex", alignItems: "center",ml:'6px'}}>
        <Typography fontSize={20} color="black" fontWeight="bold">
        {t('pick_up_order.enquiry_pickup_order')}
        </Typography>
        <Button
          onClick={() => navigate("/logistics/createPickupOrder")}
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
            key={s.field}
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
              }
            },
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

      <ApproveModal open={approveModal} onClose={resetPage} selectedRow={selectedRow} />
      <RejectForm
          open={rejectModal}
          onClose={() => {
            setRejectModal(false);
            resetPage()
          }}
          selectedRow={selectedRow}
          reasonList={reasonList}
        />
    </Box>
    </>
  );
};

export default PickupOrders;


let localstyles = {
  btn_WhiteGreenTheme: {
    borderRadius: "20px",
    borderWidth: 1,
    borderColor: "#79ca25",
    backgroundColor: "white",
    color: "#79ca25",
    fontWeight: "bold",
    "&.MuiButton-root:hover": {
      bgcolor: "#F4F4F4",
      borderColor: "#79ca25",
    },
  },
  table: {
    minWidth: 750,
    borderCollapse: "separate",
    borderSpacing: "0px 10px",
  },
  headerRow: {
    //backgroundColor: "#97F33B",
    borderRadius: 10,
    mb: 1,
    "th:first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "th:last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  row: {
    backgroundColor: "#FBFBFB",
    borderRadius: 10,
    mb: 1,
    "td:first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "td:last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  headCell: {
    border: "none",
    fontWeight: "bold",
  },
  bodyCell: {
    border: "none",
  },
  typo: {
    color: "#ACACAC",
    fontSize: 13,
    // fontWeight: "bold",
    display: "flex",
  },
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "34%",
    height: "fit-content",
    padding: 4,
    backgroundColor: "white",
    border: "none",
    borderRadius: 5,
  },
  textArea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderColor: "#ACACAC",
    borderRadius: 5,
  },
}