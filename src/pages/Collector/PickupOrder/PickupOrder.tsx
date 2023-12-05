import {
  Button,
  Modal,
  OutlinedInputProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { Box, Stack, alpha, styled } from "@mui/system";
import { t } from "i18next";
import { useNavigate } from "react-router";
import { DataGrid, GridColDef, GridRowParams, GridRowSpacingParams, GridValueGetterParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import CustomSearchField from "../../../components/TableComponents/CustomSearchField";
import PickupOrderForm from "../../../components/FormComponents/PickupOrderForm";
import StatusCard from "../../../components/StatusCard";


interface Option {
  value: string;
  label: string;
}


const PickupOrder = () => {
  const columns: GridColDef[] = [
    { field: "建立日期", headerName: "建立日期", width: 300 },
    {
      field: "物流公司",
      headerName: "物流公司",
      width: 170,
      editable: true,
    },
    {
      field: "运单编号",
      headerName: "运单编号",
      type:"string",
      width: 170,
      editable: true,
    },
    {
      field: "送货日期",
      headerName: "送货日期",
      type: 'string',
      width: 300,
      editable: true,
    },
    {
        field: "寄件公司",
        headerName: "寄件公司",
        type: "sring",
        width: 170,
        editable: true,
    },
    {
        field: "收件公司",
        headerName: "收件公司",
        type: "string",
        width: 170,
        editable: true,
    },
    {
        field: "状态",
        headerName: "状态",
        type: "string",
        width: 170,
        editable: true,
        renderCell: (params) => (
            <StatusCard  status={params.value}/>
            ),
    },
   
  ];
  const rows = [
    { id:1,建立日期:"2023-10-23", 物流公司: "快捷物流", 运单编号:'P01234523789', 送货日期:'2023-10-25',寄件公司:"a公司",收件公司:"a公司",状态:'处理中',},
    { id:2,建立日期:"2023-10-24", 物流公司: "顺丰物流", 运单编号:'P01234562789', 送货日期:'2023-10-26',寄件公司:"b公司",收件公司:"a公司",状态:'已拒绝'},
    { id:3,建立日期:"2023-10-25", 物流公司: "顶级物流", 运单编号:'P012245678239', 送货日期:'2023-10-27',寄件公司:"c公司",收件公司:"c公司",状态:'已完成'},
    { id:4,建立日期:"2023-10-26", 物流公司: "福建物流", 运单编号:'P012345678339', 送货日期:'2023-10-28',寄件公司:"d公司",收件公司:"d公司",状态:'已取消'},
    { id:5,建立日期:"2023-10-27", 物流公司: "香港物流", 运单编号:'P012345678339', 送货日期:'2023-10-29',寄件公司:"d公司",收件公司:"d公司",状态:'已完成'},
  ];

  interface Row {
    id: number;
    建立日期: string;
    物流公司: string;
    运单编号: string;
    送货日期: string;
    寄件公司: string;
    收件公司: string;
    状态: string;
  }
  const searchfield = [
    {label:'搜索',width:'14%',},
    {label:'日期由',width:'10%',options:getUniqueOptions('建立日期')},
    {label:'至',width:'10%',options:getUniqueOptions('送货日期')},
    {label:'物流公司',width:'14%',options:getUniqueOptions('物流公司')},
    {label:'地点',width:'14%',options:getUniqueOptions('收件公司')},
    {label:'回收物类别',width:'14%',options:getUniqueOptions('状态')},
    {label:'状态',width:'14%',options:getUniqueOptions('状态')}
    
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
  
    const options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option,
    }));
    return options
  }
  console.log(getUniqueOptions('建立日期'))
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
   
  return (
    <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <Modal open={openModal} onClose={handleCloses} >
                      <PickupOrderForm onClose={handleCloses} selectedRow={selectedRow} />
                    </Modal>
      <Box sx={{ display: "flex", alignItems: "center",ml:'6    px' }}>
        <Typography fontSize={20} color="black" fontWeight="bold">
          查询运单
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
            <CustomSearchField   label={s.label} width={s.width} options={s.options || []}  />
        ))}
        

      </Stack>
      <Box pr={4} pt={3} sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={rows}
          hideFooter
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          onRowClick={handleRowClick} 
          getRowSpacing={getRowSpacing}
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
      </Box>
    </Box>
  );
};

export default PickupOrder;
