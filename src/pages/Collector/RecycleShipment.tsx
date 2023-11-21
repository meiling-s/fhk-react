import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  makeStyles,
} from "@mui/material";
import { ADD_PERSON_ICON, SEARCH_ICON } from "../../themes/icons";
import { useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import React from "react";
import { createInvitation, getAllTenant } from "../../APICalls/tenantManage";
import { generateNumericId } from "../../utils/uuidgenerator";
import { defaultPath, format } from "../../constants/constant";
import { styles } from "../../constants/styles";
import dateFormat from "date-fns/format";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CheckIcon from "@mui/icons-material/Check";
import { ClearIcon } from "@mui/x-date-pickers";
import CustomItemList, {
  il_item,
} from "../../components/FormComponents/CustomItemList";
import RequestForm from "../../components/FormComponents/RequestForm";
import { FakeDataItem } from "../../interfaces/fakeData";

type Shipment = {
  createDate: Date;
  sender: string;
  recipient: string;
  poNumber: string;
  stockAdjust: boolean;
  logisticsCompany: string;
  returnAddr: string;
  deliveryAddr: string;
};

function createShipment(
  createDate: Date,
  sender: string,
  recipient: string,
  poNumber: string,
  stockAdjust: boolean,
  logisticsCompany: string,
  returnAddr: string,
  deliveryAddr: string
): Shipment {
  return {
    createDate,
    sender,
    recipient,
    poNumber,
    stockAdjust,
    logisticsCompany,
    returnAddr,
    deliveryAddr,
  };
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

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
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
    id: "createDate",
    numeric: false,
    disablePadding: false,
    label: "建立日期",
  },
  {
    id: "sender",
    numeric: false,
    disablePadding: false,
    label: "寄件公司",
  },
  {
    id: "recipient",
    numeric: false,
    disablePadding: false,
    label: "收件公司",
  },
  {
    id: "poNumber",
    numeric: false,
    disablePadding: false,
    label: "運單編號",
  },
  {
    id: "stockAdjust",
    numeric: false,
    disablePadding: false,
    label: "調整庫存",
  },
  {
    id: "logisticsCompany",
    numeric: false,
    disablePadding: false,
    label: "物流公司",
  },
  {
    id: "returnAddr",
    numeric: false,
    disablePadding: false,
    label: "送出地點",
  },
  {
    id: "deliveryAddr",
    numeric: false,
    disablePadding: false,
    label: "到達地點",
  },
];
const fakeData: FakeDataItem[]= [
    {
      createDate: new Date(),
      sender: "A company",
      recipient: "B company",
      poNumber: "PO7834123",
      stockAdjust: true,
      logisticsCompany: "C Logistics",
      deliveryAddr: "旺角亞皆老街8號",
      returnAddr: "觀塘偉業街1851號Suite J , 7/FHang Seng Ind. Bldg",
    },
    {
      createDate: new Date(),
      sender: "C company",
      recipient: "D company",
      poNumber: "PO7834124",
      stockAdjust: false,
      logisticsCompany: "E Logistics",
      deliveryAddr: "旺角亞皆老街8號",
      returnAddr: "荃灣橫龍街68號",
    },
  ];

var fakeTrigger = true;

type inviteModal = {
  open: boolean;
  onClose: () => void;
  id: string;
};

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

function InviteModal({ open, onClose, id }: inviteModal) {
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
              邀請公司
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              以電郵地址邀請
              <Required />
            </Typography>
            <TextField
              fullWidth
              placeholder="請輸入電郵地址"
              onChange={(event: { target: { value: any } }) => {
                console.log(event.target.value);
              }}
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end" sx={{ height: "100%" }}>
                    <Button
                      sx={[
                        styles.buttonFilledGreen,
                        {
                          width: "90px",
                          height: "100%",
                        },
                      ]}
                      variant="outlined"
                    >
                      發送
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
            或
          </Typography>

          <Box>
            <Typography sx={localstyles.typo}>發送連結邀請</Typography>
            <TextField
              fullWidth
              value={defaultPath.tenantRegisterPath + id}
              onChange={(event: { target: { value: any } }) => {
                console.log(event.target.value);
              }}
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end" sx={{ height: "100%" }}>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          defaultPath.tenantRegisterPath + id
                        )
                      }
                      sx={[
                        styles.buttonFilledGreen,
                        {
                          width: "90px",
                          height: "100%",
                        },
                      ]}
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
  );
}

type inviteForm = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    TChiName: string,
    SChiName: string,
    EngName: string,
    type: string,
    BRNo: string,
    remark: string
  ) => void;
};

function InviteForm({ open, onClose, onSubmit }: inviteForm) {
  const [TChiName, setTChiName] = useState<string>("");
  const [SChiName, setSChiName] = useState<string>("");
  const [EngName, setEngName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [BRN, setBRN] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [submitable, setSubmitable] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string[]>([]);

  useEffect(() => {
    //check if any of these value empty
    if (TChiName && SChiName && EngName && type && BRN) {
      //should also check if value valid
      setSubmitable(true);
    } else {
      setSubmitable(false);
    }
  }, [TChiName, SChiName, EngName, type, BRN]);

  const defaultItems: il_item[] = [
    {
      id: "1",
      name: "原因 1",
    },
    {
      id: "2",
      name: "原因 2",
    },
  ];

  function setTrigger(): void {
    fakeTrigger = false;
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
              確認拒絕送入請求嗎？
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              拒絕原因（可多選）
              <Required />
            </Typography>

            <CustomItemList
              items={defaultItems}
              multiSelect={setRejectReason}
            />
          </Box>

          <Box sx={{ alignSelf: "center" }}>
            <Button
              // disabled={!submitable}
              // onClick={() => onSubmit(TChiName,SChiName,EngName,type,BRN,remark)}
              sx={[localstyles.formButton, { m: 0.5 }]}
              onClick={() => {
                setTrigger();
                onClose();
              }}
            >
              確認拒絕
            </Button>
            <Button
              sx={[localstyles.cancelButton, { m: 0.5 }]}
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

function ShipmentManage() {
  const drawerWidth = 246;

  const [searchText, setSearchText] = useState<string>("");

  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [selected, setSelected] = useState<string[]>([]);

  const [orderBy, setOrderBy] = useState<string>("name");

  const [invFormModal, setInvFormModal] = useState<boolean>(false);

  const [invSendModal, setInvSendModal] = useState<boolean>(false);

  const [InviteId, setInviteId] = useState<string>("");

  const [shipments, setShipments] = useState<Shipment[]>([]);

  // const [companies, setCompanies] = useState<Company[]>([]);

  const [filterShipments, setFilterShipments] = useState<Shipment[]>([]);

  const [company, setCompany] = React.useState("");

  const [location, setlocation] = React.useState("");

  const [open, setOpen] = useState<boolean>(false);

  const [selectedRow, setSelectedRow] = useState<FakeDataItem[] | null>(null);


  useEffect(() => {
    // initShipments()
    setShipments(fakeData);
    setFilterShipments(fakeData);
  }, []);

  async function initShipments() {
    const result = await getAllTenant();
    const data = result?.data;
    if (data) {
      var ships: Shipment[] = [];
      data.map((ship: any) => {
        ships.push(
          createShipment(
            new Date(ship?.createdAt),
            ship?.senderCompany,
            ship?.recipientCompany,
            ship?.purchaseOrderNumber,
            false,
            ship?.tenentLogisticsCompany,
            ship?.returnAddress,
            ship?.deliveryAddress
          )
        );
      });
      setShipments(ships);
      setFilterShipments(ships);
    }
  }

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterPoNum = (searchWord: string) => {
    if (searchWord != "" && fakeTrigger) {
      const filteredShipments: Shipment[] = [];
      shipments.map((shipment) => {
        if (shipment.poNumber.includes(searchWord)) {
          filteredShipments.push(shipment);
        }
      });
      if (filteredShipments) {
        setFilterShipments(filteredShipments);
      }
    } else if (!fakeTrigger) {
      const filteredShipments: Shipment[] = [];

      if (filteredShipments) {
        setFilterShipments(filteredShipments);
      }
    } else {
      console.log("searchWord empty, don't filter shipments");
      setFilterShipments(shipments);
    }
  };

  const handleComChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value);
    var searchWord = event.target.value;
    console.log(searchWord);
    if (searchWord != "") {
      const filteredShipments: Shipment[] = [];
      shipments.map((shipment) => {
        if (shipment.sender.includes(searchWord)) {
          filteredShipments.push(shipment);
        }
      });

      if (filteredShipments) {
        setFilterShipments(filteredShipments);
      }
    } else {
      setFilterShipments(shipments);
    }
  };

  const handleLocChange = (event: SelectChangeEvent) => {
    setlocation(event.target.value);
    var searchWord = event.target.value;
    console.log(searchWord);
    if (searchWord != "") {
      const filteredShipments: Shipment[] = [];
      shipments.map((shipment) => {
        if (shipment.returnAddr.includes(searchWord)) {
          filteredShipments.push(shipment);
        }
      });

      if (filteredShipments) {
        setFilterShipments(filteredShipments);
      }
    } else {
      setFilterShipments(shipments);
    }
  };

  const createSortHandler =
    (property: keyof Shipment) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  function onSelectAllClick() {
    if (selected.length < shipments.length) {
      const newSelected = shipments.map((shipment) => shipment.poNumber);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  }
  const handleClose = () => {
    setOpen(false);
  };

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
    const selectedItem = fakeData.find(item => item.poNumber === id);
    console.log(selectedItem)
    setSelectedRow(selectedItem ? [selectedItem] : null);
 
  };

  const onInviteFormSubmit = async (
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
      updatedBy: "string",
    });
    if (result != null) {
      console.log(result);
      setInviteId(result.data?.tenantId);
      setInvSendModal(true);
      setInvFormModal(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <RequestForm onClose={handleClose} fakedata={selectedRow|| []} />
      </Modal>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pr: 4,
        }}
      >
        <Box>
          <IconButton aria-label="back" size="small" sx={{ m: 1 }}>
            <ChevronLeftIcon sx={styles.buttonBlack} />
          </IconButton>
          <Typography
            fontSize={20}
            color="black"
            fontWeight="bold"
            display="inline"
          >
            送入請求
          </Typography>
        </Box>
        <Box>
          <Button
            sx={[
              styles.buttonFilledGreen,
              {
                mt: 3,
                width: "90px",
                height: "40px",
                m: 0.5,
              },
            ]}
            variant="outlined"
            // onClick={()=>setInvFormModal(true)}
          >
            {" "}
            接受
          </Button>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                mt: 3,
                width: "90px",
                height: "40px",
                m: 0.5,
              },
            ]}
            variant="outlined"
            onClick={() => setInvFormModal(true)}
          >
            {" "}
            拒絕
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
            label="搜索"
            InputLabelProps={{
              style: { color: "#79CA25" },
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
              width: "32%",
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
            <InputLabel id="company-label">寄件公司</InputLabel>
            <Select
              labelId="company-label"
              id="company"
              value={company}
              label="寄件公司"
              onChange={handleComChange}
            >
              <MenuItem value="">
                {" "}
                <em>任何</em>
              </MenuItem>
              {fakeData.map((item) => (
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
            <InputLabel id="location-label">送出地點</InputLabel>
            <Select
              labelId="location-label"
              id="location"
              value={location}
              label="送出地點"
              onChange={handleLocChange}
            >
              <MenuItem value="">
                {" "}
                <em>任何</em>
              </MenuItem>
              {fakeData.map((item) => (
                <MenuItem value={item.returnAddr}>{item.returnAddr}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer
          sx={{
            mt: 2,
          }}
        >
          <Table
            sx={localstyles.table}
            aria-labelledby="tableTitle"
            size="small"
          >
            <TableHead>
              <TableRow
                key={"header"}
                tabIndex={-1}
                sx={[localstyles.headerRow]}
              >
                <TableCell sx={localstyles.headCell}>
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < shipments.length
                    }
                    checked={selected.length > 0}
                    onChange={onSelectAllClick}
                    inputProps={{
                      "aria-label": "select all desserts",
                    }}
                  />
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={localstyles.headCell}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => {
                        createSortHandler(headCell.id);
                      }}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                //filterCompanies.map((company) => {

                filterShipments.map((shipment) => {
                  const {
                    createDate,
                    sender,
                    recipient,
                    poNumber,
                    stockAdjust,
                    logisticsCompany,
                    returnAddr,
                    deliveryAddr,
                  } = shipment;
                  if (fakeTrigger) {
                    return (
                      <TableRow
                        hover
                        key={poNumber}
                        tabIndex={-1}
                        role="checkbox"
                        sx={[localstyles.row]}
                        onClick={(event) => handleClick(event, poNumber)}
                      >
                        <TableCell sx={localstyles.bodyCell}>
                          <Checkbox
                            color="primary"
                            checked={selected.includes(poNumber)}
                            inputProps={{
                              "aria-label": "select all desserts",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {dateFormat(createDate, format.dateFormat2)}
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {sender}
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {recipient}
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {poNumber}
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {stockAdjust ? (
                            <CheckIcon sx={styles.endAdornmentIcon} />
                          ) : (
                            <ClearIcon sx={styles.endAdornmentIcon} />
                          )}
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {logisticsCompany}
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {returnAddr}
                        </TableCell>
                        <TableCell sx={localstyles.bodyCell}>
                          {deliveryAddr}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <InviteForm
          open={invFormModal}
          onClose={() => setInvFormModal(false)}
          onSubmit={onInviteFormSubmit}
        />

        <InviteModal
          open={invSendModal}
          onClose={() => setInvSendModal(false)}
          id={InviteId}
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
  formButton: {
    ...styles.buttonFilledGreen,
    width: "150px",
  },
  cancelButton: {
    ...styles.buttonOutlinedGreen,
    width: "150px",
  },
};

export default ShipmentManage;
