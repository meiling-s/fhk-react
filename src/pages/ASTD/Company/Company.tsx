import { useEffect, useState, FunctionComponent, useCallback } from "react";
import { Box, Button, Typography, Pagination } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { styles } from "../../../constants/styles";
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
} from "../../../themes/icons";
import { getAllCompany } from "../../../APICalls/Collector/company";
import { Company as CompanyItem } from "../../../interfaces/company";
import CreateCompany from "../../Collector/Company/CreateCompany";
import useLocaleTextDataGrid from "../../../hooks/useLocaleTextDataGrid";
// import CreateCompany from "./CreateCompany";

function createCompany(
  companyId: string,
  nameTchi: string,
  nameSchi: string,
  nameEng: string,
  brNo: string,
  description: string,
  remark: string,
  status: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
): CompanyItem {
  return {
    companyId,
    nameTchi,
    nameSchi,
    nameEng,
    brNo,
    description,
    remark,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
};
}

const Company: FunctionComponent = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<{ [key: string]: number }>({
    collectorlist: 1,
    logisticlist: 1,
    manulist: 1,
    customerlist: 1,
  });  
  const pageSize = 10;
  const [action, setAction] = useState<"add" | "edit" | "delete">("add");
  const [rowId, setRowId] = useState<number>(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalData, setTotalData] = useState<{ [key: string]: number }>({
    collectorlist: 0,
    logisticlist: 0,
    manulist: 0,
    customerlist: 0,
  });
  // const [companyList, setCompanyList] = useState<CompanyItem[]>([]);
  const [selectedRow, setSelectedRow] = useState<CompanyItem | null>(null);
  const companyTypeList: string[] = ['collectorlist', 'logisticlist', 'manulist', 'customerlist']
  const [selectCompanyType, setSelectCompanyType] = useState<string>('')
  const [collectorList, setCollectorList] = useState<CompanyItem[]>([]);
  const [logisticList, setLogisticList] = useState<CompanyItem[]>([]);
  const [manuList, setManuList] = useState<CompanyItem[]>([]);
  const [customerList, setCustomerList] = useState<CompanyItem[]>([]);
  const initCompanyList = async (companyType: string) => {
    const result = await getAllCompany(companyType, page[companyType] - 1, pageSize);
    const data = result?.data;
    // setCompanyList(data);
    if (data) {
      var companyMapping: CompanyItem[] = [];
      const prefixItemName = companyType === 'manulist' ? 'manufacturer' : companyType.replace('list', '')
      data.content.map((item: any) => {
        companyMapping.push(
          createCompany(
            item[`${prefixItemName}Id`],
            item[`${prefixItemName}NameTchi`],
            item[`${prefixItemName}NameSchi`],
            item[`${prefixItemName}NameEng`],
            item?.brNo,
            item?.description,
            item?.remark,
            item?.status,
            item?.createdBy,
            item?.updatedBy,
            item?.createdAt,
            item?.updatedAt,
          )
        );
      });
      switch (companyType) {
        case 'collectorlist':
          setCollectorList(companyMapping);
          break;
        case 'logisticlist':
          setLogisticList(companyMapping);
          break;
        case 'manulist':
          setManuList(companyMapping);
          break;
        case 'customerlist':
          setCustomerList(companyMapping);
          break;
        default:
          break;
      }
      setTotalData((prevTotalData) => ({
        ...prevTotalData,
        [companyType]: data.totalPages,
      }));
      console.log('data', totalData, "page", page)
    }
  };
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const getSelectedCompanyList = useCallback((companyType: string) => {
    let selectedList: CompanyItem[] = [];
    switch (companyType) {
      case 'collectorlist':
        selectedList = collectorList;
        break;
      case 'logisticlist':
        selectedList = logisticList;
        break;
      case 'manulist':
        selectedList = manuList;
        break;
      case 'customerlist':
        selectedList = customerList;
        break;
      default:
        selectedList = [];
        break;
    }
    return selectedList;
  }, [collectorList, logisticList, manuList, customerList]);

  const initAllData = () => {
    for (const type of companyTypeList) {
      initCompanyList(type);
    }
  }
  
  useEffect(() => {
    initAllData()
  }, [])

  useEffect(() => {
    if (selectCompanyType) {
      initCompanyList(selectCompanyType);
    }
  }, [page, selectCompanyType]);
  

  const columns: GridColDef[] = [
    {
      field: "nameTchi",
      headerName: t("common.traditionalChineseName"),
      width: 200,
      type: "string",
    },
    {
      field: "nameSchi",
      headerName: t("common.simplifiedChineseName"),
      width: 200,
      type: "string",
    },
    {
      field: "nameEng",
      headerName: t("common.englishName"),
      width: 200,
      type: "string",
    },
    {
      field: "brNo",
      headerName: t("companyManagement.brNo"),
      width: 200,
      type: "string",
    },
    {
      field: "description",
      headerName: t("common.description"),
      width: 100,
      type: "string",
    },
    {
      field: "remark",
      headerName: t("common.remark"),
      width: 100,
      type: "string",
    },
    {
      field: "edit",
      headerName: t('pick_up_order.item.edit'),
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleAction(params, "edit");
              console.log({params})
              // setSelectCompanyType()
            }}
          >
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              style={{ cursor: "pointer" }}
            />
          </Button>
        );
      },
    },
    {
      field: "delete",
      headerName: t('pick_up_order.item.delete'),
      renderCell: (params) => {
        return (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleAction(params, "delete");
            }}
          >
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              style={{ cursor: "pointer" }}
            />
          </Button>
        );
      },
    },
  ];

  const handleAction = (
    params: GridRenderCellParams,
    action: "add" | "edit" | "delete"
  ) => {
    setAction(action);
    setRowId(params.row.id);
    setSelectedRow(params.row);
    setDrawerOpen(true);
  };

  const handleSelectRow = (params: GridRowParams, type: string) => {
    setAction("edit");
    setSelectCompanyType(type)
    setRowId(params.row.id);
    setSelectedRow(params.row);
    setDrawerOpen(true);
  };

  const showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showSuccessToast = (msg: string) => {
    toast.info(msg, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const onSubmitData = (type: string, msg: string) => {
    initAllData();
    if (type == "success") {
      showSuccessToast(msg);
    } else {
      showErrorToast(msg);
    }
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10,
    };
  }, []);

  return (
    <>
      {
        companyTypeList.map((item, index) => {
          return (
            <Box
            key={index}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                pr: 4,
              }}
            >
              <ToastContainer></ToastContainer>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginY: 4,
                }}
              >
                <Typography fontSize={16} color="black" fontWeight="bold">
                  {t(`companyManagement.${item}`)}
                </Typography>
                <Button
                  sx={[
                    styles.buttonOutlinedGreen,
                    {
                      width: "max-content",
                      height: "40px",
                    },
                  ]}
                  variant="outlined"
                  onClick={() => {
                    setSelectCompanyType(item)
                    setDrawerOpen(true);
                    setAction("add");
                  }}
                >
                  <ADD_ICON /> {t("top_menu.add_new")}
                </Button>
              </Box>
              <div className="table-vehicle">
                <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
                  <DataGrid
                    rows={getSelectedCompanyList(item)}
                    getRowId={(row) => row.companyId}
                    hideFooter
                    columns={columns}
                    checkboxSelection
                    onRowClick={(params) => {
                      handleSelectRow(params, item)
                    }}
                    getRowSpacing={getRowSpacing}
                    localeText={localeTextDataGrid}
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
                    count={Math.ceil(totalData[item])}
                    page={page[item]}
                    onChange={(_, newPage) => {
                      setSelectCompanyType(item)
                      setPage((prevPage) => ({
                        ...prevPage,
                        [item]: newPage,
                      }));
                    }}
                  />
                </Box>
              </div>
            </Box>
          )
        })
      }
      {rowId !== 0 && (
        <CreateCompany
          companyType={selectCompanyType}
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          action={action}
          selectedItem={selectedRow}
          onSubmitData={onSubmitData}
        />
      )}
    </>
  );
};

export default Company;
