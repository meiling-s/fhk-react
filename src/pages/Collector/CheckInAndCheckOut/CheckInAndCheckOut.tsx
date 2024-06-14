
import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography,
  } from "@mui/material";
  import { DataGrid, GridColDef, GridRowSpacingParams } from "@mui/x-data-grid";
  import dayjs from "dayjs";
  import { useTranslation } from "react-i18next";
  import { STATUS_CODE, format } from "../../../constants/constant";
  import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
  import { SEARCH_ICON } from "../../../themes/icons";
  import {CheckInAndCheckOutDetails} from "../CheckInAndCheckOut";
import { useCallback, useEffect, useState } from "react";
import { AXIOS_DEFAULT_CONFIGS } from "../../../constants/configs";
import axios from "axios";
import { GET_CHECKIN_BY_ID, GET_CHECKIN_CHECKOUT_LIST, GET_CHECKOUT_BY_ID } from "../../../constants/requests";
import { extractError, returnApiToken } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../constants/axiosInstance";
import { getCheckInDetailByID, getCheckOutDetailByID } from "../../../APICalls/Collector/inout";


  function onlyUnique(value:any, index:any, array:any) {
    return array.indexOf(value) === index;
  }

  function CheckInAndCheckOut() {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null)
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [isShow, setIsShow] = useState(false)
    const [details, setDetails] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [filter, setFilter] = useState({
      company: '',
      location: '',
      outin: '',
    })
    const navigate = useNavigate();
    const [totalElements, setTotalElements] = useState<number>(0);

    useEffect(() => {
      getData() // eslint-disable-next-line
    }, [page, keyword]) 

    const request = axios.create({
      baseURL: window.baseURL.collector
    })
  

    const getData = async () => {
     try {
      const token = returnApiToken()

      const table = token.decodeKeycloack

      const {data: dataRes} = await axiosInstance({
        baseURL: window.baseURL.collector,
        ...GET_CHECKIN_CHECKOUT_LIST(table, keyword, page -1, 10, token.realmApiRoute)
      })

      const {content, totalPages, totalElements} = dataRes
      console.log('dataRes', dataRes)
      setData(content.map((item:any, index:number) => {
      return {
        ...item,
        id: index
      }
      }))
      setTotalData(totalPages)
      setTotalElements(totalElements);

     } catch (error:any) {
      const {state, realm} = extractError(error)
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      }
     }

    }

    const handleChangeFilter = (name:string, e:any) => {
      
      setFilter({
        ...filter,
        [name]: e?.target?.value
      })
    }

  
    const columns: GridColDef[] = [
      {
        field: "createdAt",
        headerName: t("checkinandcheckout.creation_date"),
        width: 200,
        type: "string",
        renderCell: (params) => {
          const dateFormatted = dayjs(new Date(params.row.createdAt)).format(
            format.dateFormat1
          );
          return <div>{dateFormatted}</div>;
        },
      },
      {
        field: "outin",
        type: "string",
        width: 150,
        headerName: t("checkinandcheckout.outin"),
        renderCell: (params) => {
          return params.row.chkInId|| params.row.chkOutId ? (
            <div
              className={`px-4 py-2 rounded-full ${params.row.chkInId ? 'bg-green-primary' : 'bg-blue-primary'} text-white font-bold`}
            >
              {params.row.chkInId ? t('checkinandcheckout.send_in') : t('checkinandcheckout.ship')}
            </div>
          ) : null;
        },
      },
      {
        field: "senderName",
        width: 200,
        type: "string",
        headerName: t("checkinandcheckout.shipping_company"),
      },
      {
        field: "receiverName",
        width: 200,
        type: "string",
        headerName: t("checkinandcheckout.receiver"),
      },
      {
        field: "picoId",
        width: 300,
        type: "string",
        headerName: t("checkinandcheckout.waybill_number"),
      },
      {
        field: "adjustmentFlg",
        type: "boolean",
        width: 150,
        headerName: t("checkinandcheckout.adjust_inventory"),
        renderCell: (params) => {
          return params.row.adjustmentFlg ? (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 4.5L6 12.5L2 8.5"
                stroke="#79CA25"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ) : (
            <svg className="w-[16px] h-[16px] text-red-primary" xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 24 24" width="28" fill="currentColor"><path d="M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z"></path></svg>
          );
        },
      },
      {
        field: "logisticName",
        type: "string",
        width: 200,
        headerName: t("checkinandcheckout.logistics_company"),
      },
      {
        field: "senderAddr",
        type: "string",
        width: 200,
        headerName: t("checkinandcheckout.delivery_location"),
      },
      {
        field: "receiverAddr",
        type: "string",
        width: 200,
        headerName: t("checkinandcheckout.arrived"),
      },
    ];

    const handleSelectRow = async ({row}:any) => {
      setSelectedRow(row)
      setIsShow(true)
    }

    const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
      return {
        top: params.isFirstVisible ? 0 : 10,
        
      };
    }, []);
  
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pr: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <ChevronLeftIcon className="text-black" />
          <Typography
            fontSize={16}
            color="black"
            fontWeight="bold"
            style={{ textTransform: "uppercase" }}
          >
            {t("checkinandcheckout.title")}
          </Typography>
          <Box sx={styles.totalElements}>
            <Typography style={{color: 'white', fontSize: '12px'}} >{totalElements}</Typography>
          </Box>
        </Box>
        <Box>
          <div className="flex items-center">
            <TextField
              id="searchShipment"
              onChange={(event) => {
                setKeyword(event.target.value);
              }}
              sx={{
                mt: 3,
                m: 1,
                width: "25%",
                bgcolor: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&:hover fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#79CA25",
                  },
                  "& label.Mui-focused": {
                    color: "#79CA25", // Change label color when input is focused
                  },
                },
              }}
              label={t("checkinandcheckout.search")}
              InputLabelProps={{
                style: { color: "#79CA25" },
                focused: true,
              }}
              placeholder={t("checkinandcheckout.search_placeholder")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => {}}>
                      <SEARCH_ICON style={{ color: "#79CA25" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl
              sx={{
                mt: 3,
                m: 1,
                width: "25%",
                bgcolor: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&:hover fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#79CA25",
                  },
                },
              }}
            >
              <InputLabel id="company-label" sx={styles.textFieldLabel}>
                {t("checkinandcheckout.company")}
              </InputLabel>
              <Select
                labelId="company-label"
                id="company"
                  value={filter.company}
                label={t("checkinandcheckout.company")}
                  onChange={(value) => handleChangeFilter('company', value)}
              >
                <MenuItem value="">
                  {" "}
                  <em>{t("checkinandcheckout.any")}</em>
                </MenuItem>
                {data.map((item:any) => {return item.senderName}).filter(onlyUnique).map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                mt: 3,
                m: 1,
                width: "25%",
                bgcolor: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&:hover fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#79CA25",
                  },
                },
              }}
            >
              <InputLabel id="location-label" sx={styles.textFieldLabel}>
                {t("checkinandcheckout.place")}
              </InputLabel>
              <Select
                labelId="location-label"
                id="location"
                value={filter.location}
                label={t("checkinandcheckout.place")}
                onChange={(value) => handleChangeFilter('location', value)}
              >
                <MenuItem value="">
                  {" "}
                  <em>{t("checkinandcheckout.any")}</em>
                </MenuItem>
                {data.map((item:any) => {return item.senderAddr}).filter(onlyUnique).map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                mt: 3,
                m: 1,
                width: "25%",
                bgcolor: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&:hover fieldset": {
                    borderColor: "#79CA25",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#79CA25",
                  },
                },
              }}
            >
              <InputLabel id="location-label" sx={styles.textFieldLabel}>
                {t("checkinandcheckout.outin")}
              </InputLabel>
              <Select
                labelId="location-label"
                id="location"
                value={filter.outin}
                label={t("checkinandcheckout.outin")}
                onChange={(value) => handleChangeFilter('outin', value)}
              >
                <MenuItem value="">
                  {" "}
                  <em>{t("checkinandcheckout.any")}</em>
                </MenuItem>
                <MenuItem value="out">
                  {" "}
                  {t('ship')}
                </MenuItem>
                <MenuItem value="in">
                {t('checkinandcheckout.send_in')}
                </MenuItem>
              
              </Select>
            </FormControl>
          </div>
        </Box>
        <div className="mt-6">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={data.filter((item:any) => {
                if (filter.company) {
                  return item.senderName === filter.company
                }
                if (filter.location) {
                  return item.senderAddr === filter.location
                }
                if (filter.outin) {
                  if (filter.outin === 'out') {
                    return item.chkOutId
                  }
                  return item.chkInId
                }
                return true
              })}
              getRowId={(row) => row.id}
              hideFooter
              columns={columns}
              checkboxSelection={false}
                onRowClick={handleSelectRow}
                getRowSpacing={getRowSpacing}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  border: "none",
                },
                "& .MuiDataGrid-row": {
                  bgcolor: "white",
                  borderRadius: "10px",
                },
                "&>.MuiDataGrid-main": {
                  "&>.MuiDataGrid-columnHeaders": {
                    borderBottom: "none",
                  },
                },
              }}
            />
            <Pagination
              className="mt-4"
                count={Math.ceil(totalData)}
                page={page}
              
                onChange={(_, newPage) => {
                  setPage(newPage)
                }}
            />
          </Box>
          <CheckInAndCheckOutDetails isShow={isShow} setIsShow={setIsShow} selectedRow={selectedRow} />
        </div>
      </Box>
    );
  }
  
  const styles = {
    textField: {
      borderRadius: "10px",
      fontWeight: "500",
      "& .MuiOutlinedInput-input": {
        padding: "10px",
      },
    },
    textFieldLabel: {
      color: "#79CA25",
      "&.Mui-focused": {
        color: "#79CA25",
      },
    },
    totalElements : {
      display: 'flex', 
      justifyContent: "center", 
      alignItems: 'center', 
      backgroundColor: '#79CA25', 
      padding: '3px', 
      borderRadius: '20px', 
      width: '20px', 
      height: '20px'
    }
  };
  
  export default CheckInAndCheckOut;
  