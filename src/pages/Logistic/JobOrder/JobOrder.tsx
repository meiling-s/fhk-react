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
import JobOrderForm from "../../../components/FormComponents/JobOrderForm";
import StatusCard from "../../../components/StatusCard";

import { JobListOrder, queryJobOrder, Row } from "../../../interfaces/JobOrderInterfaces";
import { useContainer } from "unstated-next";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from 'react-i18next'
import { getAllJobOrder, editJobOrderStatus } from "../../../APICalls/jobOrder";
import i18n from '../../../setups/i18n'
import { displayCreatedDate, extractError, returnApiToken } from '../../../utils/utils'
import { localStorgeKeyName, STATUS_CODE, Languages } from '../../../constants/constant'
import CustomButton from "../../../components/FormComponents/CustomButton";

import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import CommonTypeContainer from "../../../contexts/CommonTypeContainer";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
import { getDriverList } from "../../../APICalls/driver";
import { Driver } from "../../../interfaces/driver";

dayjs.extend(utc)
dayjs.extend(timezone)

type Approve = {
  open: boolean
  onClose: () => void
  selectedRow: any
}

const ApproveModal: React.FC<Approve> = ({ open, onClose, selectedRow }) => {
  const { t } = useTranslation()
  const auth = returnApiToken()
  const onApprove = async () => {
    const updateJOStatus = {
      status: 'REJECTED',
      reason: [],
      updatedBy: auth.loginId
    }
    try {
      const result = await editJobOrderStatus(
        selectedRow.joId,
        updateJOStatus
      )
      if (result) {
        toast.info(t('job_order.approved_success'), {
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
              {t('job_order.confirm_approve_title')}
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
              {t('job_order.confirm_approve')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('job_order.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

interface Option {
  value: string;
  label: string;
}

const JobOrder = () => {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10 
  const [totalData , setTotalData] = useState<number>(0)
  const [driverLists, setDriverLists] = useState<Driver[]>([])
  const {dateFormat} = useContainer(CommonTypeContainer)
  const statusList: {
    value: string
    labelEng: string
    labelSchi: string
    labelTchi: string
  }[] = [
    {
      value: 'CREATED',
      labelEng: 'CREATED',
      labelSchi: '待处理',
      labelTchi: '待處理'
    },
    {
      value: 'REJECTED',
      labelEng: 'REJECTED',
      labelSchi: '已拒绝',
      labelTchi: '已拒絕'
    },
    {
      value: 'COMPLETED',
      labelEng: 'COMPLETED',
      labelSchi: '已完成',
      labelTchi: '已完成'
    },
    {
      value: 'CLOSED',
      labelEng: 'CLOSED',
      labelSchi: '已取消',
      labelTchi: '已取消'
    },
    {
      value: 'OUTSTANDING',
      labelEng: 'OUTSTANDING',
      labelSchi: '已逾期',
      labelTchi: '已逾期'
    },
    {
      value: '',
      labelEng: 'any',
      labelSchi: '任何',
      labelTchi: '任何'
    }
  ]

  const columns: GridColDef[] = [
    {
      field: "createdAt", 
      headerName: t('job_order.item.date_time'), 
      width: 150,
      renderCell: (params) => {
        return dayjs.utc(params.row.createdAt).tz('Asia/Hong_Kong').format(`${dateFormat} HH:mm`)
      }
    },
    {
      field: "driverId",
      headerName: t('job_order.table.driver_id'),
      type:"string",
      width: 150,
      editable: true,
      renderCell: (params) => {
        const driverId = params.row.driverId
        const driverName = driverLists.filter(item => item.driverId == driverId)
        if (driverName.length > 0) {
          return (
            <div>{i18n.language === 'enus' ? driverName[0].driverNameEng : i18n.language === 'zhhk' ? driverName[0].driverNameTchi : driverName[0].driverNameSchi}</div>
          )
        } else {
          return <div>{driverId}</div>
        }
      }
    },
    {
      field: "plateNo",
      headerName: t('job_order.table.plate_no'),
      type: 'string',
      width: 150,
      editable: true,
    },
    {
      field: "joId",
      headerName: t('job_order.table.jo_id'),
      type:"string",
      width: 200,
      editable: true,
    },
    {
      field: "picoId",
      headerName: t('job_order.item.reference_po_number'),
      type:"string",
      width: 200,
      editable: true,
    },
    {
      field: "senderName",
      headerName: t('job_order.table.sender_company'),
      type: "sring",
      width: 220,
      editable: true,
    },
    {
      field: "receiverName",
      headerName: t('job_order.table.receiver_company'),
      type: "string",
      width: 220,
      editable: true,
    },
    {
      field: "status",
      headerName: t('job_order.table.status'),
      type: "string",
      width: 150,
      editable: true,
      renderCell: (params) => (
        <StatusCard status={params.value}/>
      ),
    },
    {
      field: "operation",
      headerName: t('job_order.table.operation'),
      type: "string",
      width: 220,
      editable: true,
      renderCell: (params) => (
        params.row.status === 'DENY' && <CustomButton text={t('job_order.table.approve')} onClick={() => {
          showApproveModal(params.row)
        }}></CustomButton>
      ),
    },
  ];
  // const {pickupOrder} = useContainer(CheckInRequestContainer)
  const location = useLocation();
  const action: string = location.state;
  const [jobOrder, setJobOrder] = useState<JobListOrder[]>();
  const [rows, setRows] = useState<Row[]>([])
  const [filteredPico , setFilteredPico] = useState<Row[]>([])
  const [query, setQuery] = useState<queryJobOrder>({
    id: '',
    joId: '',
    picoId: '',
    driverId: '',
    senderName: '',
    receiverName: '',
    status: ''
  });
  const [approveModal, setApproveModal] = useState(false)
  const { localeTextDataGrid } = useLocaleTextDataGrid();

  const initJobOrderRequest = async () => {
    try {
      setJobOrder([])
      const params = {
        page: page - 1,
        size: pageSize,
        ...query
      }
      const res = await getAllJobOrder(params)
      if (res) {
        const data = res?.data.content
        setJobOrder(data)
      }
      setTotalData(res?.data.totalPages)
    } catch (error: any) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }
  
  const initDriverList = async () => {
    try {
      const res = await getDriverList(0, 1000)
      if (res) {
        const data = res.data.content
        setDriverLists(data)
      }
    } catch (error) {
      const { state, realm } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const showApproveModal = (row: any) => {
    setSelectedRow(row);
    setApproveModal(true)
  }
  const resetPage = async () => {
    setApproveModal(false)
    initJobOrderRequest()
  }

  useEffect(()=>{
    initJobOrderRequest()
    initDriverList()
  }, [i18n.language])

  useEffect(() => {
    initJobOrderRequest();
  }, [page, query]);

  function getStatusOpion() {
    const options: Option[] = statusList.map((item) => {
      if (i18n.language === Languages.ENUS) {
        return {
          value: item.value,
          label: item.labelEng
        }
      } else if (i18n.language === Languages.ZHCH) {
        return {
          value: item.value,
          label: item.labelSchi
        }
      } else {
        return {
          value: item.value,
          label: item.labelTchi
        }
      }
    })
    return options
  }


  useEffect (() => {
  // const mappingData = () => {
    const tempRows: any[] =(jobOrder?.map((item) => ({
      ...item,
      id: item.joId,
      joId: item.joId,
      picoId: item.picoId,
      createdAt: displayCreatedDate(item.createdAt),
      driverId: item.driverId,
      plateNo: item.plateNo, 
      senderName: item.senderName,
      receiverName: item.receiverName,
      status: item.status,
      operation: '',
      
    //}))??[])
    }))??[]).filter((item) => item.status !== 'CLOSED');
    setRows(tempRows)
    setFilteredPico(tempRows)
  // }
  },[jobOrder])


  const searchfield = [
    {label:t('job_order.filter.search'), placeholder: t('check_in.search_input') , field: 'joId'},
    {label:t('job_order.table.sender_company'),options:getUniqueOptions('senderName'), field:"senderName"},
    {label:t('job_order.table.receiver_company'),options:getUniqueOptions('receiverName'), field:"receiverName"},
    {label:t('job_order.table.driver_id'),options:getUniqueOptions('driverId'), field:"driverId"},
    {label:t('job_order.table.status'),options:getStatusOpion(), field:"status"}
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

  const updateQuery = (newQuery: Partial<queryJobOrder>) => {
    setQuery({ ...query, ...newQuery });
    // initJobOrderRequest()
  }

  const handleSearch = (keyName: string, value: string) => {
    updateQuery({ [keyName]: value })
  }
  return (
    <>
    <ToastContainer/>
    <Box sx={{ display: "flex",  flexDirection: "column" }}>
        <Modal open={openModal} onClose={handleCloses} >
          <JobOrderForm onClose={handleCloses} selectedRow={selectedRow} onApproved={() => setApproveModal(true)} />
        </Modal>
      <Box sx={{ display: "flex", alignItems: "center",ml:'6px'}}>
        <Typography fontSize={20} color="black" fontWeight="bold">
        {t('job_order.item.detail')}
        </Typography>
      </Box>
      <Box />
      <Stack direction='row' mt={3} >
        {searchfield.map((s)=>(
          <CustomSearchField
            key={s.field}
            label={s.label} 
            // width={s.width} 
            placeholder={s?.placeholder}
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
          localeText={localeTextDataGrid}
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
    </Box>
    </>
  );
};

export default JobOrder;


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