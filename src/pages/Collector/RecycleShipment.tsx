import { Box, Button, Checkbox, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography, makeStyles } from "@mui/material";
import { ADD_PERSON_ICON, SEARCH_ICON } from "../../themes/icons";
import { useEffect, useState } from "react";
import { visuallyHidden } from '@mui/utils';
import React from "react";
import { createInvitation, getAllTenant } from "../../APICalls/tenantManage";
import { generateNumericId } from "../../utils/uuidgenerator";
import { defaultPath, format } from "../../constants/constant";
import { styles } from "../../constants/styles"
import dateFormat from "date-fns/format";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CheckIcon from '@mui/icons-material/Check';
import { ClearIcon } from "@mui/x-date-pickers";
import CustomItemList, { il_item } from "../../components/FormComponents/CustomItemList";
import CustomAvatar from "../../components/CustomAvatar";
import { getAllCheckInRequests, updateCheckinStatus } from "../../APICalls/Collector/warehouseManage";
import { updateStatus } from "../../interfaces/warehouse";
import RequestForm from "../../components/FormComponents/RequestForm";


type Shipment = {
    createDate: Date,
    sender: string,
    recipient: string,
    poNumber: string,
    stockAdjust: boolean,
    logisticsCompany: string,
    returnAddr: string,
    deliveryAddr: string,
    status: string,
    checkInId: number

}

function createShipment(
    createDate: string,
    sender: string,
    recipient: string,
    poNumber: string,
    stockAdjust: boolean,
    logisticsCompany: string,
    returnAddr: string,
    deliveryAddr: string,
    status: string,
    checkInId: number
): Shipment {
    var createAt = new Date(createDate)
    return { createDate: createAt, sender, recipient: "匡智會", poNumber, stockAdjust, logisticsCompany, returnAddr, deliveryAddr: "天水圍天華路65號", status, checkInId };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Shipment;
    label: string;
    numeric: boolean;
  }
  const headCells: readonly HeadCell[] = [
    {
        id: 'createDate',
        numeric: false,
        disablePadding: false,
        label: '建立日期',
    },
    {
        id: 'sender',
        numeric: false,
        disablePadding: false,
        label: '寄件公司',
    },
    {
        id: 'recipient',
        numeric: false,
        disablePadding: false,
        label: '收件公司',
    },
    {
        id: 'poNumber',
        numeric: false,
        disablePadding: false,
        label: '運單編號',
    },
    {
        id: 'stockAdjust',
        numeric: false,
        disablePadding: false,
        label: '調整庫存',
    },
    {
        id: 'logisticsCompany',
        numeric: false,
        disablePadding: false,
        label: '物流公司',
    },
    {
        id: 'returnAddr',
        numeric: false,
        disablePadding: false,
        label: '送出地點',
    },
    {
        id: 'deliveryAddr',
        numeric: false,
        disablePadding: false,
        label: '到達地點',
    }

  ];

     const fakeData = [
        {
            createDate: new Date(), sender: "A company", recipient: "B company", 
            poNumber: "PO7834123", stockAdjust: true, logisticsCompany: "C Logistics", 
            deliveryAddr: "旺角亞皆老街8號", returnAddr: "觀塘偉業街1851號Suite J , 7/FHang Seng Ind. Bldg"
        },
        {
            createDate: new Date(), sender: "C company", recipient: "D company", 
            poNumber: "PO7834124", stockAdjust: false, logisticsCompany: "E Logistics", 
            deliveryAddr: "旺角亞皆老街8號", returnAddr: "荃灣橫龍街68號"
        }
    ]


type inviteModal = {
    open: boolean,
    onClose: () => void,
    id: string
}

const Required = () => {
    return(
        <Typography
            sx={{
                color: 'red',
                ml: "5px"
            }}>
                *
        </Typography>
    )
}


type rejectForm = {
    open: boolean;
    onClose: () => void,
    checkedShipments:Shipment[],
    onRejected?: () => void 
}

function RejectForm({
    open,
    onClose,
    checkedShipments,
    onRejected
}: rejectForm){

    const [rejectReasonId, setRejectReasonId] = useState<string[]>([]);

    const reasons: il_item[] = [
        {
            id: "1",
            name: "原因 1"
        },
        {
            id: "2",
            name: "原因 2"
        },
        {
            id: "3",
            name: "原因 3"
        }
    ]

    const handleConfirmRejectOnClick = async (rejectReasonId: string[]) => {
        const checkInIds = checkedShipments.map((checkedShipments) => checkedShipments.checkInId);
        const rejectReason = rejectReasonId.map(id => {
            const reasonItem = reasons.find(reason => reason.id === id);
            return reasonItem ? reasonItem.name : '';
        });
        console.log("checkin ids are " + checkInIds);
        const reason = rejectReason;
        const statReason: updateStatus = {
            status: 'REJECTED',
            reason: reason
        }
    
        const results = await Promise.allSettled(checkInIds.map(async (checkInId) => {
            try {
                const result = await updateCheckinStatus(checkInId, statReason);
                const data = result?.data;
                if(data){
                    console.log("updated check-in status: ", data);
                    if(onRejected){
                        onRejected();
                    }
                }
            } catch (error) {
                console.error(`Failed to update check-in status for id ${checkInId}: `, error);
            }
        }));
    }

    return(

        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={localstyles.modal}>
                <Stack spacing={2}>
                    <Box>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontWeight: "bold"}}>
                            確認拒絕送入請求嗎？
                        </Typography>
                    </Box>  
                    <Box>
                        <Typography sx={localstyles.typo}>拒絕原因（可多選）<Required/></Typography>

                        <CustomItemList
                            items={reasons}
                            multiSelect={setRejectReasonId}
                        />
                    
                    </Box>
                    

                    <Box sx={{ alignSelf: "center" }}
                    >
                        <Button
                            sx={[localstyles.formButton, {m:0.5}]}
                            onClick={() => {handleConfirmRejectOnClick(rejectReasonId); onClose();}}
                            >
                            確認拒絕
                        </Button>
                        <Button
                            sx={[localstyles.cancelButton, {m:0.5}]}
                            onClick={() => onClose()}
                            >
                            取消
                        </Button>
                    </Box>
                    
                </Stack>
            </Box>
        </Modal>
    );
}

function ShipmentManage(){

    const drawerWidth = 246;

    const [searchText, setSearchText] = useState<string>("");

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const [selected, setSelected] = useState<string[]>([]);

    const [orderBy, setOrderBy] = useState<string>('name');

    const [rejFormModal, setRejFormModal] = useState<boolean>(false);

    const [shipments, setShipments] = useState<Shipment[]>([]);

    const [filterShipments, setFilterShipments] = useState<Shipment[]>([]);
    
    const [company, setCompany] = useState('');

    const [location, setLocation] = useState('');

    const [checkedShipments, setCheckedShipments] = useState<Shipment[]>([]);

    const [open, setOpen] = useState<boolean>(false);
    
    const [selectedRow, setSelectedRow] = useState<Shipment>();


    useEffect(()=>{
        initShipments()
        // setShipments(fakeData);
        // setFilterShipments(fakeData);
    },[]);

    async function initShipments() {
        const result = await getAllCheckInRequests();
        const data = result?.data.content;
        if(data){
            var ships: Shipment[] = [];
            data.map((ship: any) => {
                if(ship.status == "CREATED"){
                ships.push(
                    createShipment(
                        ship?.createdAt,
                        ship?.senderName,
                        ship?.recipientCompany,
                        ship?.picoId,
                        ship?.adjustmentFlg,
                        ship?.logisticName,
                        ship?.senderAddr,
                        ship?.deliveryAddress,
                        ship?.status,
                        ship?.chkInId
                ));}
            })
            setShipments(ships);
            setFilterShipments(ships);
        }
    }

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleFilterPoNum = (searchWord: string) => {

        if(searchWord != ""){
            const filteredShipments: Shipment[] = [];
            shipments.map((shipment)=>{
                if(shipment.poNumber.includes(searchWord)){
                    filteredShipments.push(shipment);
                }
            });
            if(filteredShipments){
                setFilterShipments(filteredShipments);
            }

        }
        else{
            console.log("searchWord empty, don't filter shipments")
            setFilterShipments(shipments);
        }
        
    }

    

    const handleComChange = (event: SelectChangeEvent) => {
        setCompany(event.target.value);
        var searchWord = event.target.value;
        console.log(searchWord);
        if(searchWord != ""){
            const filteredShipments: Shipment[] = [];
            shipments.map((shipment)=>{
                if(
                    shipment.sender.includes(searchWord) 
                ){
                    filteredShipments.push(shipment);
                }
            });

            if(filteredShipments){
                setFilterShipments(filteredShipments);
            }
        }
        else {
            setFilterShipments(shipments);
        }
    };
    
    const handleLocChange = (event: SelectChangeEvent) => {
        setLocation(event.target.value);
        var searchWord = event.target.value;
        console.log(searchWord);
        if(searchWord != ""){
            const filteredShipments: Shipment[] = [];
            shipments.map((shipment)=>{
                if(
                    shipment.returnAddr.includes(searchWord) 
                ){
                    filteredShipments.push(shipment);
                }
            });

            if(filteredShipments){
                setFilterShipments(filteredShipments);
            }

        }
        else {
            setFilterShipments(shipments);
        }
    };

    const handleApproveOnClick = async () => {
        console.log(checkedShipments);
        const checkInIds = checkedShipments.map((checkedShipments) => checkedShipments.checkInId);
        console.log("checkin ids are " + checkInIds);
        const confirmReason: string[] = ["Confirmed"];
        const statReason: updateStatus = {
            status: 'CONFIRMED',
            reason: confirmReason
        }
    
        const results = await Promise.allSettled(checkInIds.map(async (checkInId) => {
            try {
                const result = await updateCheckinStatus(checkInId, statReason);
                const data = result?.data;
                if(data){
                    console.log("updated check-in status: ",data);
                    initShipments();
                }
            } catch (error) {
                console.error(`Failed to update check-in status for id ${checkInId}: `, error);
            }
        }));
    }


    const createSortHandler = (property: keyof Shipment) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };

    function onSelectAllClick(){
        if(selected.length < shipments.length){     //if not selecting all, do select all
            const newSelected = shipments.map((shipment) => shipment.poNumber);
            setSelected(newSelected);
            // Trigger the function for each individual checkbox
            console.log(shipments);
            var selectedShipment: Shipment[] = [];
            shipments.map((shipment) => {
                // Only call handleCheck if the shipment is not already checked
                selectedShipment.push(shipment);
            });
            setCheckedShipments(selectedShipment);
        }else{
            setSelected([]);
            // If all checkboxes are deselected, you might also want to trigger a function here
            checkedShipments.forEach((shipment) => {
                // Call handleCheck for the shipment
                handleCheck(shipment, false);
            });
            // Clear the checkedShipments array
            setCheckedShipments([]);
        }
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];
     
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1)
          );
        }
        setSelected(newSelected);
        setOpen(true);
       console.log(id)
        const selectedItem = shipments?.find(item => item.poNumber.toString() ===id);
        console.log('123456'+selectedItem)
        setSelectedRow(selectedItem); //
      };

    const handleCheck = (item: Shipment, isChecked: boolean) => {
        if (isChecked) {
          setCheckedShipments([...checkedShipments, item]);
        } else {
          setCheckedShipments(checkedShipments.filter(i => i !== item));
        }
      };

      const handleClose = () => {
        setOpen(false);
      };


    return(
        <>
            <Modal open={open} onClose={handleClose}>
                    <RequestForm onClose={handleClose} selectedItem={selectedRow} />
                </Modal>
                
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display:'flex',
                    flexDirection: 'column',
                    pr: 4
                }}
            >
                <Grid container alignItems="center">
                    <Grid item>
                    <Button aria-label="back" size="small">
                        <ChevronLeftIcon
                            sx={styles.buttonBlack}
                        />
                        <Typography fontSize={20} color='black' fontWeight='bold'>送入請求</Typography>
                    </Button> 
                    </Grid>
                    <Grid item>
                        {filterShipments.length>0 && (
                            <CustomAvatar name={filterShipments.length.toString()} 
                            backgroundColor="#79CA25" fontColor="#FFFFFF" isBold size={20} fontSize="14px"/>
                        )}
                    
                    </Grid>
                </Grid>
                <Box>
                    <Button sx={[styles.buttonFilledGreen,{
                        mt: 3,
                        width:'90px',
                        height: "40px",
                        m:0.5
                    }]}
                        variant="outlined"
                        onClick={()=>{handleApproveOnClick()}}
                        > 接受 
                    </Button>
                    <Button sx={[styles.buttonOutlinedGreen,{
                        mt: 3,
                        width:'90px',
                        height: "40px",
                        m:0.5
                    }]}
                        variant="outlined"
                        onClick={()=>setRejFormModal(true)}
                        > 拒絕
                    </Button>
                </Box>
                <Box>
                <TextField
                    id="searchShipment"
                    onChange={(event) => handleFilterPoNum(event.target.value)}
                    sx={{
                        mt: 3,
                        m: 1,
                        width: "32%",
                        bgcolor: "white",
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#79CA25',
                            },
                            '&:hover fieldset': {
                              borderColor: '#79CA25',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#79CA25',
                            },
                            "& label.Mui-focused": {
                                color: "#79CA25" // Change label color when input is focused
                            },
                          }
                    }}
                    label="搜索"
                    InputLabelProps={{
                        style: { color: '#79CA25' },
                        focused: true,
                      }}
                    placeholder="輸入運單編號"
                    InputProps={{
                        // startAdornment: (
                        //     <InputAdornment position="start">
                        //         <Typography>搜索</Typography>
                        //     </InputAdornment>
                        // ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={()=>{}}>
                                    <SEARCH_ICON style={{color: "#79CA25"}}/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <FormControl 
                    sx={{
                        mt: 3,
                        m: 1,
                        width: "32%",
                        bgcolor: "white",
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#79CA25',
                            },
                            '&:hover fieldset': {
                              borderColor: '#79CA25',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#79CA25',
                            },
                          }
                    }}>
                <InputLabel id="company-label">寄件公司</InputLabel>
                <Select
                labelId="company-label"
                id="company"
                value={company}
                label="寄件公司"
                onChange={handleComChange}
                >
                    <MenuItem value=""> <em>任何</em></MenuItem>
                {
                    shipments.map((item) => (
                        <MenuItem value={item.sender}>{item.sender}</MenuItem>
                    ))}  
                </Select>
                </FormControl>
                <FormControl 
                    sx={{
                        mt: 3,
                        m: 1,
                        width: "32%",
                        bgcolor: "white",
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#79CA25',
                            },
                            '&:hover fieldset': {
                            borderColor: '#79CA25',
                            },
                            '&.Mui-focused fieldset': {
                            borderColor: '#79CA25',
                            },
                        }
                    }}>
                <InputLabel id="location-label">送出地點</InputLabel>
                <Select
                labelId="location-label"
                id="location"
                value={location}
                label="送出地點"
                onChange={handleLocChange}
                >
                <MenuItem value=""> <em>任何</em></MenuItem>
                {
                    shipments.map((item) => (
                        <MenuItem value={item.returnAddr}>{item.returnAddr}</MenuItem>    
                    ))}
                 </Select>
                 
                </FormControl>
                </Box>
                <TableContainer
                    sx={{
                        mt: 2
                    }}>
                    <Table
                        sx={localstyles.table}
                        aria-labelledby="tableTitle"
                        size='small'
                    >
                        <TableHead>
                            <TableRow
                                key={"header"}
                                tabIndex={-1}
                                sx={[localstyles.headerRow]}>
                                <TableCell sx={localstyles.headCell}>
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < shipments.length}
                                        checked={ selected.length > 0 }
                                        onChange={onSelectAllClick}
                                        inputProps={{
                                        'aria-label': 'select all desserts',
                                        }}
                                    />
                                </TableCell>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? 'right' : 'left'}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                        sx={localstyles.headCell}
                                    >
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={() => {
                                                createSortHandler(headCell.id)
                                            }}
                                        >
                                            {headCell.label}
                                            {orderBy === headCell.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {   filterShipments.map((shipment) => {
                                const { createDate, sender, recipient, poNumber, stockAdjust, logisticsCompany, returnAddr, deliveryAddr } = shipment;
                                return (
                                    <TableRow
                                        hover key={poNumber}
                                        tabIndex={-1}
                                        role="checkbox"
                                        sx={[localstyles.row]}
                                        onClick={(event)=>handleClick(event,poNumber)}
                                        >
                                        <TableCell sx={localstyles.bodyCell}>
                                            <Checkbox
                                                color="primary"
                                                checked={selected.includes(poNumber)}
                                                onChange={(e) => handleCheck(shipment, e.target.checked)}
                                                inputProps={{
                                                    'aria-label': 'select request',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{dateFormat(createDate,format.dateFormat2)}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{sender}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{recipient}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{poNumber}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{stockAdjust?(<CheckIcon sx={styles.endAdornmentIcon}/>)
                                        :(<ClearIcon sx={styles.endAdornmentIcon}/>)}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{logisticsCompany}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{returnAddr}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{deliveryAddr}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
               
                <RejectForm checkedShipments={checkedShipments} open={rejFormModal}
                    onClose={() => {
                        setRejFormModal(false)
                    }}
                    onRejected={() => initShipments()}
                    />

            </Box>
        </>
    );
}

let localstyles = {
    btn_WhiteGreenTheme: {
        borderRadius: "20px",
        borderWidth: 1,
        borderColor: "#79ca25",
        backgroundColor: "white",
        color: "#79ca25",
        fontWeight: "bold",
        '&.MuiButton-root:hover':{
            bgcolor: "#F4F4F4",
            borderColor: "#79ca25"
        }
    },
    table: {
        minWidth: 750,
        borderCollapse: 'separate',
        borderSpacing: '0px 10px'
    },
    headerRow: {
        //backgroundColor: "#97F33B",
        borderRadius: 10,
        mb: 1,
        "th:first-child": {
            borderRadius: "10px 0 0 10px"
        },
        "th:last-child": {
            borderRadius: "0 10px 10px 0"
        },
    },
    row: {
        backgroundColor: "#FBFBFB",
        borderRadius: 10,
        mb: 1,
        "td:first-child": {
            borderRadius: "10px 0 0 10px"
        },
        "td:last-child": {
            borderRadius: "0 10px 10px 0"
        },
    },
    headCell: {
        border: "none",
        fontWeight: "bold"
    },
    bodyCell: {
        border: "none"
    },
    typo: {
        color: "#ACACAC",
        fontSize: 13,
        // fontWeight: "bold",
        display: "flex"
    },
    textField: {
        borderRadius: "10px",
        fontWeight: "500",
        "& .MuiOutlinedInput-input": {
            padding: "10px"
        }
    },
    modal: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: 'translate(-50%,-50%)',
        width: "34%",
        height: "fit-content",
        padding: 4,
        backgroundColor: "white",
        border: "none",
        borderRadius: 5
    },
    textArea: {
        width: "100%",
        height: "100px",
        padding: "10px",
        borderColor: "#ACACAC",
        borderRadius: 5
    },
    formButton: {
        ...styles.buttonFilledGreen,
        width: "150px"
    },
    cancelButton: {
        ...styles.buttonOutlinedGreen,
        width: "150px"
    }
}

export default ShipmentManage;
