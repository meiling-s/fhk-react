import { Box, Button, Checkbox, IconButton, InputAdornment, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography } from "@mui/material";
import { ADD_PERSON_ICON, SEARCH_ICON } from "../../themes/icons";
import { useEffect, useState } from "react";
import { visuallyHidden } from '@mui/utils';
import React from "react";
import { createInvitation, getAllTenant } from "../../APICalls/tenantManage";
import { generateNumericId } from "../../utils/uuidgenerator";
import { defaultPath, format } from "../../constants/constant";
import { styles } from "../../constants/styles"
import dateFormat from "date-fns/format";

type Company = {
    id: string,
    cName: string,
    eName: string,
    status: string,
    type: string,
    createDate: Date,
    accountNum: number
}

function createCompany(
    id: string,
    cName: string,
    eName: string,
    status: string,
    type: string,
    createDate: Date,
    accountNum: number
): Company {
    return { id, cName, eName, status, type, createDate, accountNum };
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
    id: keyof Company;
    label: string;
    numeric: boolean;
  }
  
  const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        numeric: false,
        disablePadding: false,
        label: '公司編號',
    },
    {
        id: 'cName',
        numeric: false,
        disablePadding: false,
        label: '公司中文名',
    },
    {
        id: 'eName',
        numeric: false,
        disablePadding: false,
        label: '公司英文名',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: '狀態',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: '公司類別',
    },
    {
        id: 'createDate',
        numeric: false,
        disablePadding: false,
        label: '建立日期',
    },
    {
        id: 'accountNum',
        numeric: false,
        disablePadding: false,
        label: '帳戶數量',
    }

  ];

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

function InviteModal({open,onClose,id}: inviteModal){

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
                            邀請公司
                        </Typography>
                    </Box>  
                    <Box>
                        <Typography sx={localstyles.typo}>以電郵地址邀請<Required/></Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入電郵地址"
                            onChange={(event: { target: { value: any; }; }) => {
                                console.log(event.target.value);
                            }}
                            InputProps={{
                                sx: styles.textField,
                                endAdornment: (
                                  <InputAdornment position="end" sx={{height: "100%"}}>
                                    <Button
                                        sx={[styles.buttonFilledGreen,{
                                            width:'90px',
                                            height: "100%"
                                        }]}
                                        variant="outlined"
                                    >
                                        發送
                                    </Button>
                                  </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Typography variant="h6" component="h2" sx={{fontWeight: "bold"}}>或</Typography>
                    
                    <Box>
                        <Typography sx={localstyles.typo}>發送連結邀請</Typography>
                        <TextField
                            fullWidth
                            value={defaultPath.tenantRegisterPath+id}
                            onChange={(event: { target: { value: any; }; }) => {
                                console.log(event.target.value);
                            }}
                            InputProps={{
                                sx: styles.textField,
                                endAdornment: (
                                  <InputAdornment position="end" sx={{height: "100%"}}>
                                    <Button
                                        onClick={() => navigator.clipboard.writeText(defaultPath.tenantRegisterPath+id)}
                                        sx={[styles.buttonFilledGreen,{
                                            width:'90px',
                                            height: "100%"
                                        }]}
                                        variant="outlined"
                                    >
                                        複製
                                    </Button>
                                  </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                </Stack>
            </Box>
        </Modal>
    )
}

type inviteForm = {
    open: boolean;
    onClose: () => void,
    onSubmit: ( TChiName: string, SChiName: string, EngName: string, type: string, BRNo: string, remark: string ) => void
}

function InviteForm({
    open,
    onClose,
    onSubmit
}: inviteForm){

    const [TChiName, setTChiName] = useState<string>("");
    const [SChiName, setSChiName] = useState<string>("");
    const [EngName, setEngName] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [BRN, setBRN] = useState<string>("");
    const [remark, setRemark] = useState<string>("");
    const [submitable, setSubmitable] = useState<boolean>(false);

    useEffect(()=>{
        //check if any of these value empty
        if( TChiName && SChiName && EngName && type && BRN ){
            //should also check if value valid
            setSubmitable(true);
        }else{
            setSubmitable(false);
        }
    },[TChiName,SChiName,EngName,type,BRN])

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
                            邀請公司
                        </Typography>
                    </Box>  
                    <Box>
                        <Typography sx={localstyles.typo}>公司類別<Required/></Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司類別"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setType(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={localstyles.typo}>公司繁體中文名<Required/></Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司繁體中文名稱"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setTChiName(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={localstyles.typo}>公司簡體中文名<Required/></Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司簡體中文名稱"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setSChiName(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={localstyles.typo}>公司英文名<Required/></Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司英文名稱"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setEngName(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={localstyles.typo}>商業登記編號<Required/></Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入商業登記編號"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => setBRN(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={localstyles.typo}>備註</Typography>
                        <textarea 
                            name="remark"
                            placeholder="請輸入文字"
                            style={{...localstyles.textArea,
                                boxSizing: "border-box"
                            }}
                            onChange={(event) => setRemark(event.target.value)}
                        />
                    </Box>

                    <Box sx={{ alignSelf: "center" }}
                    >
                        <Button
                            disabled={!submitable}
                            onClick={() => onSubmit(TChiName,SChiName,EngName,type,BRN,remark)}
                            sx={localstyles.formButton}
                            >
                            提交
                        </Button>
                    </Box>
                    
                </Stack>
            </Box>
        </Modal>
    );
}

function CompanyManage(){

    const drawerWidth = 246;

    const [searchText, setSearchText] = useState<string>("");

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const [selected, setSelected] = useState<string[]>([]);

    const [orderBy, setOrderBy] = useState<string>('name');

    const [invFormModal, setInvFormModal] = useState<boolean>(false);

    const [invSendModal, setInvSendModal] = useState<boolean>(false);

    const [InviteId, setInviteId] = useState<string>("");

    const [companies, setCompanies] = useState<Company[]>([]);

    const [filterCompanies, setFilterCompanies] = useState<Company[]>([]);

    useEffect(()=>{
        initCompanies()
    },[]);

    async function initCompanies() {
        const result = await getAllTenant();
        const data = result?.data;
        if(data){
            var coms: Company[] = [];
            data.map((com: any) => {
                coms.push(
                    createCompany(
                        com?.tenantId,
                        com?.companyNameTchi,
                        com?.companyNameEng,
                        com?.status,
                        com?.tenantType,
                        new Date(com?.createdAt),
                        0
                ));
            })
            setCompanies(coms);
            setFilterCompanies(coms);
        }
    }

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleFilterCompanies = (searchWord: string) => {

        if(searchWord != ""){
            const filteredCompanies: Company[] = [];
            companies.map((company)=>{
                if(
                    company.id.toString().includes(searchWord) ||
                    company.cName.includes(searchWord) ||
                    company.eName.includes(searchWord) ||
                    company.status.includes(searchWord) ||
                    company.type.includes(searchWord) ||
                    dateFormat(company.createDate,"yyyy/MM/dd HH:mm").includes(searchWord) ||
                    company.accountNum.toString().includes(searchWord)
                ){
                    filteredCompanies.push(company);
                }
            });

            if(filteredCompanies){
                setFilterCompanies(filteredCompanies);
            }

        }else{
            console.log("searchWord empty, don't filter companies")
            setFilterCompanies(companies);
        }
        
    }

    const createSortHandler = (property: keyof Company) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };

    function onSelectAllClick(){
        if(selected.length < companies.length){
            const newSelected = companies.map((company) => company.id);
            setSelected(newSelected);
        }else{
            setSelected([]);
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
            selected.slice(selectedIndex + 1),
          );
        }
        setSelected(newSelected);
    };

    const onInviteFormSubmit = async(
        TChiName: string, 
        SChiName: string, 
        EngName: string, 
        type: string, 
        BRNo: string, 
        remark: string
    ) => {
        const randomId = generateNumericId();
        console.log(randomId);
        const result = await createInvitation({
            tenantId: randomId,
            companyNameTchi: TChiName,
            companyNameSchi: SChiName,
            companyNameEng: EngName,
            tenantType: type,
            status: "string",
            brNo: BRNo,
            remark: remark,
            contactNo: "string",
            email: "string",
            contactName: "string",
            brPhoto: ["string"],
            epdPhoto: ["string"],
            decimalPlace: 0,
            monetaryValue: "string",
            inventoryMethod: "string",
            allowImgSize: 0,
            allowImgNum: 0,
            approvedAt: "2023-10-25T07:14:25.562Z",
            approvedBy: "string",
            rejectedAt: "2023-10-25T07:14:25.562Z",
            rejectedBy: "string",
            createdBy: "string",
            updatedBy: "string"
        });
        if(result!=null){
            console.log(result);
            setInviteId(result.data?.tenantId);
            setInvSendModal(true);
            setInvFormModal(false);
        }
        
    }

    return(
        <Box sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor:'#f4f5f7', height: "100vh", display: "flex" }}>
            <Box
                sx={{
                    pt: "50px",
                    pl:'40px',
                    pr:'40px',
                    width: "100%",
                    height: "100%",
                    display:'flex',
                    flexDirection: 'column'
                }}
            >
                <Typography fontSize={20} color='black' fontWeight='bold'>公司</Typography>
                <Button sx={[styles.buttonFilledGreen,{
                    mt: 3,
                    width:'90px',
                    height: "40px"
                }]}
                    variant="outlined"
                    onClick={()=>setInvFormModal(true)}
                    >
                        <ADD_PERSON_ICON/> 邀請
                </Button>
                <TextField
                    id="searchCompany"
                    onChange={(event) => handleFilterCompanies(event.target.value)}
                    sx={{
                        mt: 3,
                        width: "100%",
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
                    }}
                    label="搜索"
                    placeholder="輸入公司編號"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={()=>{}}>
                                    <SEARCH_ICON style={{color: "#79CA25"}}/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
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
                                        indeterminate={selected.length > 0 && selected.length < companies.length}
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
                            {filterCompanies.map((company) => {
                                const { id, cName, eName, status, type, createDate, accountNum } = company;
                                return (
                                    <TableRow
                                        hover key={id}
                                        tabIndex={-1}
                                        role="checkbox"
                                        sx={[localstyles.row]}
                                        onClick={(event)=>handleClick(event,id)}
                                        >
                                        <TableCell sx={localstyles.bodyCell}>
                                            <Checkbox
                                                color="primary"
                                                checked={selected.includes(id)}
                                                inputProps={{
                                                    'aria-label': 'select all desserts',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{id}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{cName}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{eName}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{status}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{type}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{dateFormat(createDate,format.dateFormat2)}</TableCell>
                                        <TableCell sx={localstyles.bodyCell}>{accountNum}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <InviteForm open={invFormModal} onClose={() => setInvFormModal(false)} onSubmit={onInviteFormSubmit}/>

                <InviteModal open={invSendModal} onClose={() => setInvSendModal(false)} id={InviteId}/>
            </Box>
        </Box>
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
        color: "grey",
        fontSize: 14,
        fontWeight: "bold",
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
        width: "150px",
        borderRadius: 5,
        backgroundColor: "#79CA25",
        color: "white",
        '&.MuiButton-root:hover':{
            backgroundColor: "#7AD123",
        }
    }
}

export default CompanyManage;