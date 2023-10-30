import { Box, Button, Checkbox, IconButton, InputAdornment, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography } from "@mui/material";
import { ADD_PERSON_ICON, SEARCH_ICON } from "../../themes/icons";
import { useState } from "react";
import { visuallyHidden } from '@mui/utils';
import React from "react";
import { createInvitation } from "../../APICalls/tenantManage";
import { generateNumericId } from "../../utils/uuidgenerator";

type Company = {
    id: string,
    cName: string,
    eName: string,
    status: number,
    type: string,
    createDate: Date,
    accountNum: number
}

function createCompany(
    id: string,
    cName: string,
    eName: string,
    status: number,
    type: string,
    createDate: Date,
    accountNum: number
): Company {
    return { id, cName, eName, status, type, createDate, accountNum };
}

const rows = [
    createCompany("T001", '回收公司1', 'Collector Company1', 1, 'collector', new Date("2023/09/20 2:31pm"), 3),
    createCompany("T002", '回收公司2', 'Collector Company2', 1, 'collector', new Date("2023/09/20 4:54pm"), 6),
];

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
        disablePadding: true,
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
    },

  ];

type inviteModal = {
    open: boolean,
    onClose: () => void
}

function InviteModal({open,onClose}: inviteModal){

    return(
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={styles.modal}>
                <Stack spacing={2}>
                    <Box>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontWeight: "bold"}}>
                            邀請公司
                        </Typography>
                    </Box>  
                    <Box>
                        <Typography sx={styles.typo}>以電郵地址邀請</Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入電郵地址"
                            onChange={(event) => {
                                console.log(event.target.value);
                            }}
                            InputProps={{
                                sx: styles.textField,
                                endAdornment: (
                                  <InputAdornment position="end" sx={{height: "100%"}}>
                                    <Button
                                        sx={[styles.btn_WhiteGreenTheme,{
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
                        <Typography sx={styles.typo}>發送連結邀請</Typography>
                        <TextField
                            fullWidth
                            onChange={(event) => {
                                console.log(event.target.value);
                            }}
                            InputProps={{
                                sx: styles.textField,
                                endAdornment: (
                                  <InputAdornment position="end" sx={{height: "100%"}}>
                                    <Button
                                        sx={[styles.btn_WhiteGreenTheme,{
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

    function checkSubmitable(){
        //check if any of these value empty
        if( TChiName && SChiName && EngName && type && BRN ){
            //should also check if value valid
            return true;
        }else{
            return false;
        }
    }

    return(

        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={styles.modal}>
                <Stack spacing={2}>
                    <Box>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{fontWeight: "bold"}}>
                            邀請公司
                        </Typography>
                    </Box>  
                    <Box>
                        <Typography sx={styles.typo}>公司類別</Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司類別"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event) => setType(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={styles.typo}>公司繁體中文名</Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司繁體中文名稱"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event) => setTChiName(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={styles.typo}>公司簡體中文名</Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司簡體中文名稱"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event) => setSChiName(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={styles.typo}>公司英文名</Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入公司英文名稱"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event) => setEngName(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={styles.typo}>商業登記編號</Typography>
                        <TextField
                            fullWidth
                            placeholder="請輸入商業登記編號"
                            InputProps={ {
                                sx: styles.textField
                            }}
                            onChange={(event) => setBRN(event.target.value)}
                        />
                    </Box>
                    <Box>
                        <Typography sx={styles.typo}>備註</Typography>
                        <textarea 
                            name="remark"
                            placeholder="請輸入文字"
                            style={{...styles.textArea,
                                boxSizing: "border-box"
                            }}
                            onChange={(event) => setRemark(event.target.value)}
                        />
                    </Box>

                    <Box sx={{ alignSelf: "center" }}
                    >
                        <Button
                            onClick={() => onSubmit(TChiName,SChiName,EngName,type,BRN,remark)}
                            sx={styles.formButton}
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

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const [selected, setSelected] = useState<string[]>([]);

    const [orderBy, setOrderBy] = useState<string>('name');

    const [invFormModal, setInvFormModal] = useState<boolean>(false);

    const [invSendModal, setInvSendModal] = useState<boolean>(false);

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property: keyof Company) => (event: React.MouseEvent<unknown>) => {
        handleRequestSort(event, property);
    };

    function onSelectAllClick(){
        const newSelected = rows.map((row) => row.id);
        setSelected(newSelected);
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
            brPhoto: "string",
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
        console.log(result);
        setInvSendModal(true);
        setInvFormModal(false);
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
                <Button sx={[styles.btn_WhiteGreenTheme,{
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
                        sx={styles.table}
                        aria-labelledby="tableTitle"
                        size='small'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={styles.cell}>
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < rows.length}
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
                                    sx={styles.cell}
                                >
                                    <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
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
                            {rows.map((row) => {
                                const { id, cName, eName, status, type, createDate, accountNum } = row;
                                return (
                                    <TableRow
                                        hover key={id}
                                        tabIndex={-1}
                                        role="checkbox"
                                        sx={[styles.row]}
                                        onClick={(event)=>handleClick(event,id)}
                                        >
                                        <TableCell sx={styles.cell}>
                                            <Checkbox
                                                color="primary"
                                                checked={selected.includes(id)}
                                                inputProps={{
                                                    'aria-label': 'select all desserts',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={styles.cell}>{id}</TableCell>
                                        <TableCell sx={styles.cell}>{cName}</TableCell>
                                        <TableCell sx={styles.cell}>{eName}</TableCell>
                                        <TableCell sx={styles.cell}>{status}</TableCell>
                                        <TableCell sx={styles.cell}>{type}</TableCell>
                                        <TableCell sx={styles.cell}>{createDate.toString()}</TableCell>
                                        <TableCell sx={styles.cell}>{accountNum}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <InviteForm open={invFormModal} onClose={() => setInvFormModal(false)} onSubmit={onInviteFormSubmit}/>

                <InviteModal open={invSendModal} onClose={() => setInvSendModal(false)}/>
            </Box>
        </Box>
    );
}

let styles = {
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
    cell: {
        border: "none"
    },
    typo: {
        color: "grey",
        fontSize: 14,
        fontWeight: "bold"
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
        color: "white"
    }
}

export default CompanyManage;